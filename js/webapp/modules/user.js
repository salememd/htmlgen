
/* global app, webapp, jUI */
(function(){
    
    webapp.User = function(data){
        
        var so = this;
        this.name = null;
        this.lastLogin = null;
        this.type = null;
        this.uiConf = null;
        
        this.bankAccountsDs = new jUI.Dataset({
            url: webapp.reqUrl,
            autoSubmit: true,
            params: {
                MODULE_NAME: "Accounts",
                FUNC_NO: "bank_accounts"
            },
            calcFields:{
                title: function(f, pos){
                    var mdl_bnk = so.bankAccountsDs;
                    var v = mdl_bnk.fAt("acc_type",pos);
                    v += "  -  (*******"+mdl_bnk.fAt("bank_account_id", pos).slice(-6) + ")";
                    var balance = app.round( mdl_bnk.fAt("balance", pos),3 ) + "  " + app.__("LYD");
                    return  "<span style=\"float: left;\">" + v + "</span>" 
                            + "<span style=\"display: inline; float: right;\">" + balance + "</span>" ;
                }
            },
            events: {
                ready: function () {
                }
            }
        });

        var loadSettings = function () {
            var fna = {}, pa = {hiddenFields: fna, data: null};
            for (var name in data) {
                var content = data[name];
                switch (name) {
                    case 'NAME':
                        so.name = content;
                        break;
                    case 'LASTLOGIN':
                        so.lastLogin = content;
                        break;
                    case 'USERTYPE':
                        so.type = +content;
                        break;
                    case 'UICONF':
                        so.uiConf = content;
                        break;
                    case 'DATASETS':
                        for (var datasetName in content) {
                            var datasetContent = content[datasetName];
                            pa.data = datasetContent;
                            switch (datasetName) {
                                
                            }
                        }
                        break;
                }
            }
        };
        
        loadSettings();
    };
    
})();
