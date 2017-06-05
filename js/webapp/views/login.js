
/* global app, webapp, jUI */
(function(){
    webapp.Login = function(){jUI.ViewController.call(this);};
    webapp.Login.prototype = new jUI.ViewController({__loading__:true});
    webapp.Login.prototype.constructor = webapp.Login;
    webapp.Login.prototype._initController = function(){
        var so = this;
        this.userNameEd = null;
        this.passEd = null;
        this.loginBtn = null;
        this.regEds = [];
        
        this.registrationFormUI = function(){
            return [
                    webapp.createFormLabel(app.__("Full Name")),
                    so.regEds["name"] = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "name",
                        tabIndex: 1
                    }),
                    webapp.createFormLabel(app.__("Login User Name")),
                    so.regEds["username"]  = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "UserNameEd",
                        tabIndex: 2
                    }),
                    webapp.createFormLabel(app.__("Password")),
                    so.regEds["pass"]  = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "PassEd",
                        tabIndex: 2
                    },true),
                    webapp.createFormLabel(app.__("Password Confirmation")),
                    so.regEds["pass2"]  = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "PassEd2",
                        tabIndex: 2
                    },true),
                    webapp.createFormLabel(app.__("Email")),
                    so.regEds["email"]  = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "email",
                        tabIndex: 2
                    }),
                    webapp.createFormLabel(app.__("Phone")),
                    so.regEds["phone"]  = new jUI.TextField({
                        layout: jUI.Layout.ltFollowVer,
                        width: "100%",
                        name: "phone",
                        tabIndex: 2
                    })
                ];
        };
        
        this.viewDidLoad = function(){
            document.getElementsByTagName("body")[0].style.backgroundColor = "#032d4f";
            this.view.show();
            if(webapp.sessionActive)
                so.loginButnClick();
        };
        
        this.loginButnKeyPress = function(){
            if(typeof arguments[0] !== 'undefined' && arguments[0].type === 'keypress' && arguments[0].key === 'Enter'){
                so.loginButnClick();
            }
        };
        
        this.registerButnKeyPress = function(){
            if(typeof arguments[0] !== 'undefined' && arguments[0].type === 'keypress' && arguments[0].key === 'Enter'){
                so.registerBtnClick();
            }
        };
        
        this.loginRequest = function(username,password){
            app.ajax({
                url: webapp.reqUrl,
                params: {
                    FUNC_NO: "LOGIN",
                    UserNameEd: username,
                    PassEd: password
                },
                loader: webapp.loader,
                success: function(data){
                    if (data.data.ERROR) {
                        jUI.showMessage(app.lang['error'],data.data.ERROR,jUI.MessageDialog.mtError,[jUI.Form.btnCancel]);
                    } else {
                        webapp.user = new webapp.User(data.data.USERINFO.UserInfo);
                        webapp.home = new webapp.Home();
                        so.view.close();
                        document.getElementsByTagName("body")[0].style.backgroundColor = "#FFFFFF";
                    }
                }
            });
        };
        
        this.loginButnClick = function(){
            so.loginRequest(so.userNameEd.getValue(), so.passEd.getValue());
        };
        this.registerBtnClick = function(){
            webapp.displayEntryForm("Registration", null, so.registrationFormUI(), {}, so.registerBtnAction );
        };
        
        this.registerBtnAction = function(inputForm){
            
            var userNameEd= so.regEds['username'].getValue(),
                passEd= so.regEds['pass'].getValue(),
                passEd2= so.regEds['pass2'].getValue(),
                name= so.regEds['name'].getValue(),
                email= so.regEds['email'].getValue(),
                phone= so.regEds['phone'].getValue();
            
            app.ajax({
                url: webapp.reqUrl,
                params: {
                    FUNC_NO: "REGISTER",
                    UserNameEd:  userNameEd ,
                    PassEd: passEd,
                    PassEd2: passEd2,
                    name: name,
                    email: email,
                    phone: phone,
                    userType: 100
                },
                loader: webapp.loader,
                success: function(data){
                    if (data.data.ERROR){
                        jUI.showMessage(app.lang['error'],data.data.ERROR,jUI.MessageDialog.mtError,[jUI.Form.btnCancel]);
                    }else if(data.data.REGISTRATION){
                        inputForm.view.close();
                        jUI.showMessage(app.__("Registration successful"), app.__("Registration successful"), jUI.MessageDialog.mtInformation, [
                            jUI.butAction(app.__("ok"), function(){
                                so.loginRequest(userNameEd, passEd );
                                return true;
                            })
                        ]);
                    }else{
                        jUI.showMessage(app.__("error"), "Unhandled error", [ jUI.btnCancel ]);
                    }
                }
            });
            
            
        };
    };
    webapp.Login.prototype._initView = function(){
        return new  jUI.Window({
            align: "|",
            valign: "-",
            //margin:{t:-50},
            classModifier: "login-form",
            autoFree: true,
            width: 400,
            height: 240,
            tabIndex: 1,
            children: [
                
                new jUI.Layout({
                    width: "100%",
                    height: 60,
                    align: "|",
                    layout: jUI.Layout.ltFollowVer,
                    visible: true,
                    children:[
                        new jUI.Image({
                            url: webapp.baseUrl + "/images/login-logo.png",
                            width: 100,
                            height: 60,
                            align: "|",
                            layout: jUI.ltFollowVer
                        })
                    ]
                }),                
                this.userNameEd = new jUI.TextField({
                    placeholder: app.lang["user_name"],
                    name: "username",
                    width: "100%",
                    layout: jUI.ltFollowVer,
                    tabIndex: 2,
                    margin: {b:10},
                    events:{
                        keypress: this.loginButnKeyPress
                    }
                }),
                this.passEd = new jUI.TextField({
                    placeholder: app.lang["pass"],
                    name: "password",
                    width: "100%",
                    layout: jUI.ltFollowVer,
                    margin: {b:10},
                    tabIndex: 3,
                    events:{
                        keypress: this.loginButnKeyPress
                    }
                },true),
                this.loginBtn = new jUI.Button({
                    text: app.lang["login"],
                    width: 150,
                    layout: jUI.ltFollowVer,
                    align: "|",
                    tabIndex: 4,
                    events:{
                        click: this.loginButnClick,
                        keypress: this.loginButnKeyPress
                    }
                })
                ,
                new jUI.Image({
                    url: webapp.baseUrl + "/images/libyaguide_logo_35.png",
                    layout: jUI.ltFollowVer,
                    classModifier: "login_sponsored_logo",
                    align: ">",
                    margin:{t:45}
                })
//                ,
//                this.registerBtn = new jUI.Button({
//                    classModifier: "alternate",
//                    text: app.__("Register"),
//                    width: "30%",
//                    layout: jUI.ltFollowHor,
//                    align: ">",
//                    tabIndex: 4,
//                    events:{
//                        click: this.registerBtnClick,
//                        keypress: this.registerButnKeyPress
//                    }
//                })
            ]
        });
    };
})();
