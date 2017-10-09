/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.libyaguide.framework.usermanagement;

import com.libyaguide.framework.AbstractModule;
import com.libyaguide.framework.App;
import com.libyaguide.framework.Utils;
import com.libyaguide.framework.enums.ReturnErrorType;
import com.libyaguide.framework.servlets.AjaxGet;
import com.libyaguide.db.DataSet;
import com.libyaguide.framework.Locker;
import com.libyaguide.framework.servlets.DefaultServlet;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashSet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.bson.Document;

/**
 *
 * @author salem
 */
public class DefaultUser extends User {
    
    private DefaultUser(AjaxGet req, ResultSet userInfo) throws SQLException{
        super(req,userInfo);
    }    
       
    public static void register(AjaxGet req) throws SQLException{

        // For sending a list of error messages in one time.
        StringBuilder errorsBuilder = new StringBuilder();
        
        int reqUserType;
        try {
            reqUserType = req.getParamAsInt("userType");
        } catch (Exception e) {
            reqUserType = UserTypes.UNKNOWN.val();
        }
        UserTypes userType = UserTypes.valueOf(reqUserType);
        int active ;
        switch(userType){
            case DISTRIBUTER:
            case EMPLOYEE:
            case CUSTOMER_COMPANY:
                /* Allowed to register, but the account will remain disabled waiting for administrators activation */
                active = 0;
                break;
            case CUSTOMER_INDIVIDUAL:
                /* Individuals can register and start using their accounts immediatly. */
                active = 1;
                break;
            default:
                errorsBuilder.append("<li>Wrong User Type selected</li>");
                active = 0;
        }
        
        String user_id = req.getParam("UserNameEd","").trim();
        String pass = req.getParam("PassEd","");
        String pass2 = req.getParam("PassEd2","");
        String email = req.getParam("email","").trim();
        String phone = req.getParam("phone","").trim();
        String name = req.getParam("name","").trim();
        
        if(user_id.isEmpty()){
            errorsBuilder.append("<li>"+"Username is messing"+"</li>");
        }
        if(pass.isEmpty() || pass2.isEmpty()){
            errorsBuilder.append("<li>"+"Password is missing"+"</li>");
        }else if(!pass.equals(pass2)){
            errorsBuilder.append("<li>"+"Passwords doesn't match"+"</li>");
        }
        if(email.isEmpty()){
            errorsBuilder.append("<li>"+"Email is missing"+"</li>");
        }
        if(name.isEmpty()){
            errorsBuilder.append("<li>"+"Name is missing"+"</li>");
        }
        if(phone.isEmpty()){
            errorsBuilder.append("<li>"+"Phone is missing"+"</li>");
        }
        
        if(errorsBuilder.length()>0){
            req.setReturnVal(ReturnErrorType.WRONG_OPERATION);
            req.jsonData.append("ERROR", "<ul>"+errorsBuilder.toString()+"</ul>");
            return;
        }

        App.dbPool.execute((conn) -> {
            
            try {
                conn.execute("INSERT INTO user_managment.users (no, user_id, pass, email, phone, name, user_type, active, parent_acc, created_by) VALUES( DEFAULT,?,MD5(?),?,?,?,?,?,2,2)",
                        new Object[]{
                            user_id, //req.getParam("user_id"),
                            pass,
                            email,
                            phone,
                            name,
                            userType.val(),
                            active
                        }
                );
            } catch (SQLException e) {
                errorsBuilder.append("<li>"+e.getMessage()+"</li>");
            }
        }, false);
        if(errorsBuilder.length()>0){
            req.setReturnVal(ReturnErrorType.WRONG_OPERATION);
            req.jsonData.append("ERROR", "<ul>"+errorsBuilder.toString()+"</ul>");
            return;
        }
        req.jsonData.append("REGISTRATION", 1);
    }

    public static DefaultUser login(AjaxGet req) throws SQLException{
        DefaultUser user = null;
        HttpServletRequest V = req.V;
        String remoteAddr = V.getRemoteAddr();
        String userName = V.getParameter("UserNameEd");
        String pass = V.getParameter("PassEd");
        
        ResultSet ipCheck = App.dbPool.executeQuery("select * from user_managment.black_list where ip = '"+remoteAddr+"' ");
        boolean ipCheckEmpty = !ipCheck.next();
        if(!ipCheckEmpty && ipCheck.getInt("locked") == 1){
            req.setReturnVal(ReturnErrorType.IP_BLOCKED);
        }else{
            ResultSet query = App.dbPool.executeQuery(
                "select no,name,last_login,user_id,pass, user_type,active, account_id, "+
                       " case when parent_acc is null then no else parent_acc end parent_acc "+
                "from  user_managment.users "+
                "where user_id = LOWER(?)  "+
                "and pass = md5(?) "+
                // And the user is not a group user.
                "and user_type != 8 ", true, new Object[]{userName, pass}
            );


            if(!query.next()){
                int attempts = 0;
                if(!ipCheckEmpty){
                    attempts = ipCheck.getInt("attempts");
                    App.dbPool.execute("update user_managment.black_list set attempts = attempts + 1, locked = case when attempts >= 10 then 1 else 0 end WHERE ip = '"+remoteAddr+"' ", false);
                }else{
                    App.dbPool.execute("insert into user_managment.black_list values('"+remoteAddr+"',1,0)", false);
                }
                App.dbPool.execute(
                    "insert into user_managment.black_list_log values(?, ?, NOW())", false, 
                    new Object[]{remoteAddr,"LOGIN: Wrong user name or password. USER NAME = "+userName+", PASS = "+pass}
                );
                req.setReturnVal(attempts + 2 == 10 ? ReturnErrorType.IP_WILL_BLOCK : ReturnErrorType.WRONG_LOGIN_INFO);
            }else if(query.getInt("active") == 0){
                req.setReturnVal(ReturnErrorType.ACCOUNT_INACTIVE);
            }else{
                user = new DefaultUser(req, query);
                if(!ipCheckEmpty){ 
                    App.dbPool.execute("delete from user_managment.black_list WHERE ip = '"+remoteAddr+"' ", false);
                }
                
                user.setNo(query.getInt("no"));
                user.setParentAccNo(query.getInt("parent_acc"));
                user.setId(query.getString("user_id"));
                user.setName(query.getString("name"));
                user.setLastLogin(query.getDate("last_login"));
                user.setLoginIp(remoteAddr);
                user.setType(UserTypes.valueOf(query.getInt("user_type")));
                
                App.dbPool.execute("update user_managment.users set LAST_LOGIN = NOW() WHERE NO = "+ user.getNo(), false);
                
                HttpSession session = V.getSession();
                session.setAttribute("user", req.user = user);
                
                user.setMobileDevId(V.getParameter("mobileDevId"));
                if(req.MobileDevice != null && user.getMobileDevId() != null){
                    if(App.dbPool.getValueAsInt(
                            "select count(*) from user_managment.user_mobile_devs where mobile_dev_type = ? and mobile_id = ? and user_no = ? ", 
                            req.MobileDevice, user.getMobileDevId() , user.getNo()
                        ) > 0
                    ){
                        App.dbPool.execute(
                            "update user_managment.user_mobile_devs set loged_in = 1 where mobile_dev_type = ? and mobile_id = ? and user_no = ? ",
                            false, new Object[]{req.MobileDevice, user.getMobileDevId() , user.getNo()}
                        );
                    }else{
                        App.dbPool.execute(
                            "INSERT INTO user_managment.user_mobile_devs (mobile_dev_type, mobile_id, user_no, local_settings, loged_in) VALUES(?,?,?,'{}',1)",
                            false, new Object[]{req.MobileDevice, user.getMobileDevId() , user.getNo()}
                        );
                    }
                }
                for(AbstractModule module: App.modules.values()){
                    module.onUserLoggedIn(user);
                }
            }
            query.getStatement().close();
        }
        ipCheck.getStatement().close();
        return user;
    }
}
