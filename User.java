/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.libyaguide.framework.usermanagement;

import com.datastax.driver.core.UserType;
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
 * @author basem
 */
public abstract class User {
    
    private int no;
    private int parentAccNo;
    private String id;
    private String name;
    private Date lastLogin;
    private String loginIP;
    private UserTypes type;
    private HashSet<String> privs;
    private HashSet<Integer> groups;
    private HashSet<Integer> globalGroups;
    private HashSet<Integer> specialGroups;
    private String globalGroupList;
    private String mobileDevId;    
    public final boolean canManage;
    
    
    private final int ALLOW_USER_CHANGE_PIN_AFTER = 5;  //MINUTES
            
    public User(AjaxGet req, ResultSet userInfo) throws SQLException{
        this.no = userInfo.getInt("no");
        this.parentAccNo = userInfo.getInt("parent_acc");
        this.id = userInfo.getString("user_id");
        this.name = userInfo.getString("name");
        //this.lastLogin = userInfo.getDate("last_login");
        this.loginIP  = req.V.getRemoteAddr();
        this.type = UserTypes.valueOf(userInfo.getInt("user_type"));
        //this.timeDiff = userInfo.getInt("time_diff");
        //this.timeDiff = this.timeDiff > 0? this.timeDiff : 0;

        App.dbPool.execute("update user_managment.users set LAST_LOGIN = NOW() WHERE NO = "+this.no,false);
        
        this.addHistory(req,"LOGIN",1,"Logged in.");
        this.loadPrivileges(req);
        this.loadGroups(req);
        // @TODO redefine what canManage means.
        this.canManage = this.hasPrivilege("LOGIN ADMINISTRATION UI");
    }
    
    public boolean isAdmin(){
        return this.type == UserTypes.ADMINISTRATOR;
    }
    
    public int getNo() {
        return no;
    }
    public int getParentAccNo() {
        return parentAccNo;
    }
    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public String getLoginIP() {
        return loginIP;
    }
    public UserTypes getType() {
        return type;
    }
   
    public Document getUserSettings(DefaultServlet req){
        
        Document settings = new Document();
        
        Document userInfo = new Document();
        userInfo.append("NAME", this.name)
                .append("LASTLOGIN", (lastLogin != null)?Utils.dateToStdStringFormat(lastLogin):null )
                .append("USERTYPE", this.type.val())
                .append("MANAGE", this.canManage)
                .append("ADMIN", this.type == UserTypes.ADMINISTRATOR)
                .append("ACCOUNT_ADMIN", this.type != UserTypes.SUB_USER)
                .append("ASSIGN_GROUPS", this.hasPrivilege("USER GROUPS ASSIGN"));
        
        Document uPrivs = new Document();
        this.privs.forEach((p) -> {
            uPrivs.append(p, true);
        });
        userInfo.append("PRIVS", uPrivs);
        
        settings.append("UserInfo", userInfo);
        
        App.modules.forEach((key, value) -> value.loadUserSettings(this, settings));
        
        return settings;
    }

    public void logout(AjaxGet req) throws SQLException{
        App.modules.forEach((key, module) -> module.onUserLoggedOut(this));
        if(req.MobileDevice != null && mobileDevId != null){
            App.dbPool.execute(
                "update user_managment.user_mobile_devs set loged_in = 0 where mobile_dev_type = ? and mobile_id = ? ",
                false, new Object[]{req.MobileDevice, mobileDevId}
            );
        }
        req.V.getSession().invalidate();
        this.privs.clear();
        this.groups.clear();
        this.globalGroups.clear();
        this.specialGroups.clear();
        req.user = null;
    }
    
    
            
    public void addHistory(AjaxGet req, String opType, long opNo, String opDesc, long doneTo)throws SQLException{
        App.dbPool.execute(
                    "INSERT INTO user_managment.history (op_type, op_no, op_desc, done_by,done_to,ip) "+
                    "VALUES('"+opType+"',"+opNo+",'"+opDesc+"',"+this.no+","+doneTo+",'"+this.loginIP+"')"
                ,false);

    }
    public void addHistory(AjaxGet req, String opType, long[] opNo, String opDesc, long doneTo)throws SQLException{
        for(long v: opNo){
            addHistory(req, opType, v, opDesc, doneTo);
        }
    }
    public void addHistory(AjaxGet req, String opType, long opNo, String opDesc)throws SQLException{
        addHistory(req,opType, opNo, opDesc, this.parentAccNo);
    }
    
    private void loadPrivileges(AjaxGet req) throws SQLException{
        privs = new HashSet();
        DataSet query = new DataSet(App.dbPool, "privilege_no",true,
                                 " SELECT distinct t3.module||'.'||t3.func as priv"+
                                 " FROM user_managment.user_roles t1, user_managment.r_role_privileges t2, user_managment.privileges t3  "+
                                 " WHERE t1.user_no = "+this.no +
                                 " AND t1.role_no = t2.role_no "+
                                 " AND t2.privilege_no = t3.no ");
        query.exportTo(privs, "priv");
        query.close();
    }
    
    
    private void loadGroups(AjaxGet req) throws SQLException{
        groups = new HashSet();
        specialGroups = new HashSet();
        globalGroups = new HashSet();
        
        DataSet query = new DataSet(App.dbPool, "dev_no","SELECT distinct group_no FROM user_managment.r_user_groups WHERE user_no = "+this.no);
        int grp;
        String list = "";
        while(query.res.next()){
            grp = query.res.getInt("group_no");
            groups.add(grp);
            if(grp >= 100){
                globalGroups.add(grp);
                list += (list.equals("")?"":",") + grp;
            }else{
                specialGroups.add(grp);
            }
        }
        query.close();
        globalGroupList = list;
    }
    
    public boolean hasPrivilege(AjaxGet req, String... privs){
        if(type == UserTypes.ADMINISTRATOR || privs.length == 0) return true;
        for(String p: privs){
            if(!this.privs.contains(p)){
                if(req != null) req.setReturnVal(ReturnErrorType.NO_PERMISSION);
                return false;
            }
        }
        return true;
    }
    public boolean hasPrivilege(String... privs){
        return this.hasPrivilege(null, privs);
    }
    
    public boolean hasAnyOfPrivilege(AjaxGet req, String... privs){
        if(type == UserTypes.ADMINISTRATOR || privs.length == 0) return true;
        for(String p: privs)
            if(this.privs.contains(p)){
                return true;
            }
        
        if(req != null) req.setReturnVal(ReturnErrorType.NO_PERMISSION);
        return false;
    }
    public boolean hasAnyOfPrivilege(String... privs){
        return this.hasAnyOfPrivilege(null, privs);
    }
    
    public boolean belongsToGroups(int... grpIDs){
        if(type == UserTypes.ADMINISTRATOR || grpIDs.length == 0) return true;
        for(int gid: grpIDs)
            if(!this.groups.contains(gid)){
                return false;
            }
        return true;
    }
    public boolean belongsToSpecialGroups(int... grpIDs){
        if(type == UserTypes.ADMINISTRATOR || grpIDs.length == 0) return true;
        for(int gid: grpIDs)
            if(!this.specialGroups.contains(gid)){
                return false;
            }
        return true;
    }
    public boolean belongsToGlobalGroups(int... grpIDs){
        if(type == UserTypes.ADMINISTRATOR || grpIDs.length == 0) return true;
        for(int gid: grpIDs)
            if(!this.globalGroups.contains(gid)){
                return false;
            }
        return true;
    }
    public boolean isAllowedToChangePin(){
        return isAllowedToChangePin(this.getNo());
    }
    public boolean isAllowedToChangePin(int user_no){
        try{
            return App.dbPool.getValueAsLong(
                            "select no "
                            + "from user_managment.users where no = ? "
                            + "and ( "
                                    + "last_changed_pin is NULL "
                                    + "or  current_timestamp >= (last_changed_pin + INTERVAL '"+ALLOW_USER_CHANGE_PIN_AFTER+" minutes')"
                                + ") ",
                    new Object[]{ user_no }
            ) == user_no;
        }catch(SQLException e){
        }
        return false;
    }

    /**
     * For Normal Users always check isAllowedToChangePin() before calling changePin()
     * 
     * @param user_no
     * @return 
     */
    public boolean changePin(int user_no){
        try{
            /*
                Removed from query, admins can change pins any time. users must be notified.
            
                and ( last_changed_pin is NULL or current_timestamp >= (last_changed_pin + INTERVAL '"+ALLOW_USER_CHANGE_PIN_AFTER+" hours')
            
            */
            App.dbPool.execute((conn) -> {
                conn.execute("update user_managment.users set pin=?, last_changed_pin= current_timestamp where no = ?  ", new Object[]{
                    String.format("%1$06d", (long)(Math.random()*1000000) ),
                    user_no
                });
            }, false);
            return true;
        }catch(SQLException e){
            App.log.add("Change My Own PIN failure, ", e);
        }
        return false;
    }
    
    public boolean changePin(){
        return changePin(this.getNo());
    }
    
    /**
     * should only be called for the logged in user
     * 
     * @param oldPin
     * @param newPin
     * @return boolean
     */
    public boolean setCustomPin(String newPin){
        try{
            App.dbPool.execute((conn) -> {
                conn.execute("update user_managment.users set pin=?, last_changed_pin= current_timestamp where no = ? ", new Object[]{
                    newPin,
                    this.getNo()
                });
            }, false);
            
            String pin = App.dbPool.getValueAsString(
                    "select pin from user_managment.users where no=?", 
                    new Object[]{
                        this.getNo()
                    }
            );
            
            
            return ( pin==null ? false : newPin.equals(pin));
            
            
        }catch(SQLException e){
            App.log.add("Change My Own PIN failure, ", e);
        }
        return false;
    }
    
    public void setNo(int no){
    this.no = no;
    }
    
    public void setName(String name){
    this.name = name;
    }
    
    public void setParentAccNo(int parentAccNo){
    this.parentAccNo = parentAccNo;
    }
     
    public void setId(String id){
    this.id = id;
    }
    public void setLastLogin(Date lastLogin){
        this.lastLogin = lastLogin;

    }
    public void setLoginIp(String loginIp){
    this.loginIP = loginIp;
    }
        
    public void setType(UserTypes type){
    this.type = type;

    }
   
    public void setMobileDevId(String mobileDevId){
        this.mobileDevId = mobileDevId;
    
    }
    
      public String getMobileDevId(){
       return this.mobileDevId;
    
    }
      
      
}
