
/* global jUI, app */
(function(){
    
    // =================================================================================
    // Dataset Start 
    // =================================================================================
    
    /**
     * jUI.Dataset 
     * @extends jUI.Object.
     * 
     * @param {json} pa {<br>
     *      url: String | ":master//fieldName" (to use data from the master data set),<br>
     *      data: json { <br>
     *          fields: [String] (optional) if not specified, the fields will be just numbers starting from 0, <br>
     *          rows: [[String]] each row must contain the same number of items the fields array has<br>
     *      }, <br>
     *      masterDataset: jUI.Dataset, <br>
     *      masterKey: String,<br>
     *      dataKey: String,<br>
     *      type: "Table" | "Document", <br>
     *      autoSubmit: Boolean (default false),<br>
     *      keyField: String | ":pos", (if the row number is needed to be the key) <br>
     *      params: json {name: value},<br>
     *      datasetFields: json {fieldName: jUI.Dataset.DatasetField{ <br/>
     *          dataField: String, (the field to match from this dataset) <br/>
     *          dataset: jUI.Dataset, (the dataset to match with) <br/>
     *          keyField: String, (the key field to match dataField with) <br/>
     *          listField: String, (the field from the matched dataset to display) <br/>
     *      }<br>
     *      calcFields: json {fieldName: function(fieldName: String, pos: int)},<br>
     *      mode: jUI.dsmXXX, <br>
     *      
     *      events: {
     *          dataSaved: function(),
     *          ready: function(),
     *          refresh: function(),
     *          dataChanged: function(),
     *          dataUpdate: function(from, to),
     *          dataDelete: function(startRowNo, endRowNo),
     *          dataAdd: function(startRowNo, endRowNo),
     *          beforeDataDelete: function(startRowNo, endRowNo),
     *          receivedResponse: function(data),
     *          modeChanged: function(mode:jUI.dsmXXX)
     *      }
     * }
     * @constructor
     */
    jUI.Dataset = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
        }, false);
        jUI.Object.call(this, newPa);
        this.getAutoSubmit() && this.submit();
    };
    (function(){
        jUI.dsmView = jUI.Dataset.dsmView = "view";
        jUI.dsmAdd = jUI.Dataset.dsmAdd = "add";
        jUI.dsmEdit = jUI.Dataset.dsmEdit = "edit";
    })();
    (function(){
        jUI.Dataset.prototype = new jUI.Object({__loading__: true});
        jUI.Dataset.prototype.constructor = jUI.Dataset;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Dataset.prototype._initProp = function(pa){
            jUI.Object.prototype._initProp.call(this, pa);
            this.__V.Dataset = {
                fields: {},
                url: null,
                datasetFields: [],
                records: [], 
                // The field type is either Table or Document. If Table, 
                // there will be fields and the rows are arrays of values.
                // If Document, there will be no fields and rows will be
                // json objects. If not provided, the default value is Table.
                type: null, 
                staticType: null,
                datasetData: null,
                pos: 0,
                eof: true,
                errorCode: 0,
                errorType: 0,
                otherInfo: [],
                disableComponentsStatus: 0,
                dbComponents: [],
                beforeRefreshPos: null,
                keyField: null,
                lockPos: false,
                fLength:0,
                childDatasets: [],
                calcFields: {},
                masterDataset: null,
                masterKey: null,
                dataKey: null,
                sortedBy: null,
                sortOrder: null,
                childDSDis: false,
                params: {},
                mode: jUI.dsmView,
                tempDate: new jUI.Date()
            };
        };
        
        jUI.Dataset.prototype.finalize = function(){
            var V = this.__V.Dataset;
            V.masterDataset && V.masterDataset._removeChildDataset(this);
            while(V.childDatasets.length > 0) V.childDatasets[0].setMasterDataset(null);
            while(V.dbComponents.length > 0) V.dbComponents[0].setDataset(null);
            jUI.Object.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        
        jUI.Dataset.prototype._prepare = function(data){
            var V = this.__V.Dataset,inf,flds,rcs;
            V.fLength = 0;
            V.type = V.staticType || data.type || "Table";
            if(!data || !(rcs = data.rows)) return;
            (inf = data.datasetinfo) && (V.keyField = inf.key);
            if(V.type !== "Document"){
                if(flds=data.fields){ 
                    V.fLength = flds.length;
                    V.fLength && (V.fields = {});
                    for(var i=0;i<V.fLength;++i) V.fields[flds[i]] = i;
                }
                if(!V.fLength && rcs && rcs[0] && rcs[0].length){
                    rcs[0].forEach(function(v,i){ V.fields[i] = i; });
                }
            }
            return rcs;
        };
        
        jUI.Dataset.prototype.addData = function(recs, addPos, startRow, endRow){
            var V = this.__V.Dataset,l = recs.length,dif,i;
            !startRow && (startRow = 0);
            (!endRow || endRow >= l) && (endRow = l - 1);
            dif = endRow - startRow + 1;
            if(dif > 0){
                if(!addPos){
                    for(i=endRow;i>=startRow;--i){ 
                        V.records.unshift(recs[i]);
                    }
                    V.pos = 0;
                    V.eof = V.pos >= V.records.length;
                    this._doDataAdded(0,dif - 1);
                }else{
                    for(i=startRow;i<=endRow;i++){ 
                        V.records.push(recs[i]);
                    }
                    V.pos = (l=V.records.length)-1;
                    V.eof = V.pos >= l;
                    this._doDataAdded(l - dif,l - 1);
                }
            }
        };
        jUI.Dataset.prototype.updateData = function(recs, from, to){
            var V = this.__V.Dataset,l,cl,i,j,k;
            l = recs.length;
            cl = V.records.length;
            (!from || from < 0) && (from = 0);
            (!to || (to >= from + l && to >= cl) || to < 0) && (to = from + l - 1);
            i = from;
            j = 0;
            while(i <= to){
                if(i < cl){
                    if(j < l){ 
                        for(k in recs[j]){
                            V.records[i][k] = recs[j][k];
                        }
                    }else{ 
                        this.deleteRecords(i,cl-1); 
                        break; 
                    }
                }else{ 
                    this.addData(recs,1,j); 
                    break; 
                }
                i++;
                j++;
            }
            j && this._doDataUpdate(from,i-1);
        };
        jUI.Dataset.prototype.clear = function(){
            var V = this.__V.Dataset;
            V.otherInfo.clear();
            V.fields = {};
            V.records = [];
            V.fLength = 0;
            V.pos = 0;
            V.eof = V.pos >= V.records.length;
            this._doRefresh();
            this._doReady();
        };
        jUI.Dataset.prototype.setData = function(v){
            var V = this.__V.Dataset;
            V.errorType = 0;
            if(v === undefined || v === ''){ 
                this.clear(); 
                return; 
            }
            V.otherInfo.clear();
            V.datasetData = v;
            if(v.rows){
                V.errorCode = 0;
                V.fields = {};
                V.records = this._prepare(v);
                !V.records && (V.records = []);
                V.pos = 0;
                V.eof = V.pos >= V.records.length;
                this._doRefresh();
            }else{
                for(var tagName in v){
                    var content = v[tagName];
                    switch(tagName){
                        case 'records':
                            V.fields = {};
                            v.forEach(function(v,i){ V.fields[v] = i; });
                            break;
                        case 'ERROR':
                            V.errorType = 1;
                            jUI.showMessage(app.lang['error'],content, jUI.MessageDialog.mtError, [jUI.Form.btnCancel]);
                            break;
                        case 'WARNING':
                            V.errorType = 2;
                            jUI.showMessage(app.lang['warning'],content, jUI.MessageDialog.mtWarning, [jUI.Form.btnCancel]);
                            break;
                        case 'ERROR_CODE': V.errorCode = content; break;
                        case 'INFO': 
                            jUI.showMessage(app.lang['info'],content, jUI.MessageDialog.mtInformation, [jUI.Form.btnCancel]);
                            this._dataSaved();
                            break;
                        case 'DATASET':
                            V.errorCode = 0;
                            V.fields = {};
                            V.records = this._prepare(content);
                            !V.records && (V.records = []);
                            V.pos = 0;
                            V.eof = V.pos >= V.records.length;
                            this._doRefresh();
                            break;
                        case 'ENTRYADDED':
                            V.errorCode = 0;
                            var recs = this._prepare(content);
                            !recs && (recs = []);
                            this.addData(recs, 1);
                            this._dataSaved();
                            break;
                        case 'ENTRYADDEDB':
                            V.errorCode = 0;
                            var recs = this._prepare(content);
                            !recs && (recs = []);
                            this.addData(recs, 0);
                            this._dataSaved();
                            break;
                        case 'ENTRYUPDATED':
                            V.errorCode = 0;
                            var recs = this._prepare(content);
                            !recs && (recs = []);
                            this.updateData(recs, V.pos,V.pos);
                            this._dataSaved();
                            break;
                        case 'DELETECONFIRM':
                            V.errorCode = 0;
                            this.deleteRecords(V.pos,V.pos);
                            break;
                        default:
                            V.otherInfo.push({name: tagName, value: content});
                            break;
                    }
                }
            }
            this._doReady();
            if(V.beforeRefreshPos){ 
                this.setPos(V.beforeRefreshPos); 
                V.beforeRefreshPos = null; 
            }
        };
        
        /**
         * @TODO if the dataset is updated or has data added to it, the assignment is invalid.
         * @param {jUI.Dataset} sourceDS
         */
        jUI.Dataset.prototype.assign = function(sourceDS){
            
            if(!(sourceDS instanceof jUI.Dataset)) return;
            var V = this.__V.Dataset, dsV = sourceDS.__V.Dataset;
            V.otherInfo.splice(0,V.otherInfo.length);
            V.datasetData = dsV.datasetData;
            V.errorCode = 0;
            V.fields = app.clone(dsV.fields);
            V.type = dsV.type || "Table";
            var r,rs=dsV.records,i=0,j,l=rs.length;
            V.records = new Array(l);
            V.fLength = dsV.fLength;
            for(;i<l;++i){ 
                r = rs[i];
                V.records[i] = new Array(V.fLength);
                for(j=0;j<V.fLength;++j) V.records[i][j] = r[j];
            }
            V.pos = 0;
            V.eof = V.pos >= V.records.length;
            this._doRefresh();
            this._doReady();
            if(V.beforeRefreshPos){ this.setPos(V.beforeRefreshPos); V.beforeRefreshPos = null; }
        };
        jUI.Dataset.prototype.addRecord = function(data, addPos){ // addPos: 0: At the begining. 1: At the end
            var V = this.__V.Dataset,content,recs;
            V.datasetData = data;
            for(var tagName in data){
                content = data[tagName];
                switch(tagName){
                    case 'ERROR':
                        jUI.showMessage(app.lang['error'],content, jUI.MessageDialog.mtError, [jUI.Form.btnCancel]);
                        break;
                    case 'ERROR_CODE': V.errorCode = content; break;
                    case 'DATASET':
                        V.errorCode = 0;
                        recs = this._prepare(content);
                        !recs && (recs = []);
                        this.addData(recs, addPos);
                        break;
                }
            }
        };
        jUI.Dataset.prototype.updateRecord = function (data, from, to) {
            var V = this.__V.Dataset,content,recs;
            V.datasetData = data;
            for (var tagName in data) {
                content = data[tagName];
                switch (tagName) {
                    case 'ERROR':
                        jUI.showMessage(app.lang['error'],content, jUI.MessageDialog.mtError, [jUI.Form.btnCancel]);
                        break;
                    case 'ERROR_CODE':
                        V.errorCode = content;
                        break;
                    case 'DATASET':
                        V.errorCode = 0;
                        recs = this._prepare(content);
                        !recs && (recs = []);
                        this.updateData(recs, from, to);
                        break;
                }
            }
        };
        jUI.Dataset.prototype.deleteRecords = function(from, to){
            var V = this.__V.Dataset;
            var l = V.records.length;
            if(from < 0 || from >= l || to < 0 || to >= l || from > to) return;
            this._doBeforeDataDeleted(from, to);
            if(V.pos >= from && V.pos <= to) l -= Math.abs(to-from) + 1;
            if(V.pos >= l) V.pos = l - 1;
            if(V.pos < 0) V.pos = 0;
            V.records.splice(from,to-from+1);
            V.eof = V.pos >= V.records.length;
            this._doDataDeleted(from, to);
            if(V.records.length === 0) this._doReady();
        };
        jUI.Dataset.prototype.copyField = function(srcDS, srcFieldName,destFieldName){
            var V = this.__V.Dataset;
            this.disableComponents();
            srcDS.disableComponents();
            var srcPos = srcDS.getPos(),destPos = V.pos;
            if(V.type !== "Document" && V.fields[destFieldName] == null){
                V.fields[destFieldName] = V.fLength++;    
            }
            srcDS.first();
            while(!srcDS.isEof()){
                if(this.locate(V.keyField, srcDS.getKeyValue()))
                    this.setFieldValue(destFieldName,srcDS.f(srcFieldName));
                srcDS.next();
            }
            srcDS.setPos(srcPos);
            this.setPos(destPos);
            srcDS.enableComponents();
            this.enableComponents();
            this._doDataUpdate(0,V.records.length-1);
        };
        /**
         * @param {jUI.Dataset} sourceDataset
         */
        jUI.Dataset.prototype.setDataFrom = function(sourceDataset){
            this.setData(sourceDataset.getDatasetData());
        };
        jUI.Dataset.prototype.next = function (){
            this.setPos(this.__V.Dataset.pos+1);
        };
        jUI.Dataset.prototype.prev = function (){
            this.setPos(this.__V.Dataset.pos-1);
        };
        jUI.Dataset.prototype.first = function(){
            this.setPos(0);
        };
        jUI.Dataset.prototype.last = function(){
            this.setPos(this.__V.Dataset.records.length-1);
        };
        jUI.Dataset.prototype.reset = function(){
            this.setPos(0);		
        };
        /**
         * Locate chages the current position of the dataset cursor if the value found.
         * @param {String | [Strings] | ":pos"} fieldName
         * @param {String | [Strings]} fieldValue
         * @param {boolean} continueFromCurrPos (default false) it has no effect if fieldName = ":pos".
         * @returns {Boolean}
         */
        jUI.Dataset.prototype.locate = function(fieldName,fieldValue,continueFromCurrPos){
            var V = this.__V.Dataset;
            if(!fieldName) return false;
            
            // Although calling locate with fieldName = ":pos" is stupid (just use setPos),
            // there are other functions that use locate with fieldName = KeyField. Since
            // the keyField can be ":pos", we want these functions not to break in such a 
            // case, which is why we are handling this case here.
            if(fieldName === ":pos"){
                return this.setPos(+fieldValue);
            }
            
            var tempPos = V.pos;
            this.disableComponents();
            !continueFromCurrPos && this.first();
            var j,l,rec;
            if(fieldName instanceof Array && (l=fieldName.length)){
                if(V.type !== "Document")
                    for(j=0;j<l;++j){
                        fieldName[j] = V.fields[fieldName[j]];
                    }
                WHILE_LOOP:
                while(!V.eof){
                    rec = V.records[V.pos];
                    for(j=0;j<l;++j){
                        if(rec[fieldName[j]] != fieldValue[j]){
                            this.next();
                            continue WHILE_LOOP;
                        }
                    }
                    this.enableComponents();
                    this._doDataChanged();
                    return true;
                }
            }else{
                if(V.type !== "Document")
                    fieldName = V.fields[fieldName];
                while(!V.eof){
                    if(V.records[V.pos][fieldName] == fieldValue){ 
                        this.enableComponents();
                        this._doDataChanged();
                        return true;
                    }
                    this.next();
                }
            }
            this.setPos(tempPos);
            this.enableComponents();
            return false;
        };
        /**
         * LocateValue doesn't change the current position of the dataset cursor.
         * @param {String | ":pos"} fieldName
         * @param {String} fieldValue
         * @param {String | [String]} retField
         * @param {boolean} continueFromCurrPos (default false)
         * @returns {null | String | json{fieldName:value} } the value
         */
        jUI.Dataset.prototype.locateValue = function(fieldName,fieldValue, retField,continueFromCurrPos){
            var V = this.__V.Dataset;
            if(fieldName === ":pos"){
                if(retField instanceof Array){
                    retVal = {};
                    for(var i=0,l=retField.length;i<l;++i){
                        retVal[retField[i]] = this.fAt(retField[i],fieldValue);
                    }
                }else 
                    retVal = this.fAt(retField,fieldValue);
                return;
            }
            var fi = V.type !== "Document"? V.fields[fieldName] : fieldName;
            if(fi == null) return null;
            var tempPos = V.pos, retVal = null;
            this.disableComponents();
            !continueFromCurrPos && this.first();
            while(!V.eof){
                if(V.records[V.pos][fi] == fieldValue){ 
                    if(retField instanceof Array){
                        retVal = {};
                        for(var i=0,l=retField.length;i<l;++i){
                            retVal[retField[i]] = this.f(retField[i]);
                        }
                    }else 
                        retVal = this.f(retField);
                    break;
                }
                this.next();
            }
            this.setPos(tempPos);
            this.enableComponents();
            return retVal;
        };
        jUI.Dataset.prototype.isEof = function(){
            return this.__V.Dataset.eof;
        };
        jUI.Dataset.prototype.isEmpty = function(){
            return !this.__V.Dataset.records.length;
        };
        jUI.Dataset.prototype.addDBComponent = function(value){
            this.__V.Dataset.dbComponents.push(value);
        };
        jUI.Dataset.prototype.removeDBComponent = function(value){
            this.__V.Dataset.dbComponents.remove(value);
        };
        jUI.Dataset.prototype._qsort = function(f,o,start,end){
            var V = this.__V.Dataset;
            if(start >= end) return;
            var pivot = this.fAt(f,start),i = start + 1,j = end,t;
            while( i <= j ){
                if(o === "asc"){
                    while( i <= j && this.fAt(f,i) <= pivot) ++i;
                    while( i <= j && this.fAt(f,j) >= pivot) j--;
                }else{
                    while( i <= j && this.fAt(f,i) >= pivot) ++i;
                    while( i <= j && this.fAt(f,j) <= pivot) j--;
                }
                if( i <= j ){
                    t = V.records[i];
                    V.records[i] = V.records[j];
                    V.records[j] = t;
                }else{
                    t = V.records[start]
                    V.records[start] = V.records[j];
                    V.records[j] = t;
                }
            }
            this._qsort(f,o,start,j-1);
            this._qsort(f,o,i,end);
        };
        // @params: field: field name, order: 1. Ascending. 2. Descending.
        /**
         * @param {String} field name
         * @param {"asc" | "desc" | undefined} order if undefined, the order will be revered or "asc" if never defined before.
         */
        jUI.Dataset.prototype.sort = function(field,order){
            var V = this.__V.Dataset;
            order = order || (V.sortOrder === "asc"? "desc" : "asc");
            if(V.sortedBy != field)
                this._qsort(field,order,0,V.records.length-1);
            else if(V.sortOrder !== order){
                var i=0,j=V.records.length-1,t;
                while(i<j){
                    t = V.records[i];
                    V.records[i] = V.records[j];
                    V.records[j] = t;
                    ++i;
                    --j;
                }
            }
            V.sortedBy = field;
            V.sortOrder = order;
            this._doRefresh();
        };

        jUI.Dataset.prototype._addChildDataset = function(v){
            this.__V.Dataset.childDatasets.push(v);
        };
        jUI.Dataset.prototype._removeChildDataset = function(v){
            this.__V.Dataset.childDatasets.remove(v);
        };
        jUI.Dataset.prototype.disableComponents = function(){
            this.__V.Dataset.disableComponentsStatus++;
        };
        jUI.Dataset.prototype.enableComponents = function(){
            var V = this.__V.Dataset;
            if(V.disableComponentsStatus > 0)
                V.disableComponentsStatus--;
        };
        jUI.Dataset.prototype.refresh = function(){
            var V = this.__V.Dataset;
            V.beforeRefreshPos = V.pos;
            this.submit();
        };
        /**
         * 
         * @param {function(index:int) -> boolean} func if the func returns false, the forEach will terminate.
         * @returns {undefined}
         */
        jUI.Dataset.prototype.forEach = function(func){
            var V = this.__V.Dataset;
            if(func){
                for(var i=0,l=V.records.length;i<l;++i){
                    if(func.call(this,i) === false) return;
                }
            }
        };
        /**
         * @param {json{fieldName: jUI.Dataset.DatasetField}} fna <br/>
         *   jUI.Dataset.DatasetField {
         *      dataField: String, (the field to match from this dataset) <br/>
         *      dataset: jUI.Dataset, (the dataset to match with) <br/>
         *      keyField: String, (the key field to match dataField with) <br/>
         *      listField: String, (the field from the matched dataset to display) <br/>
         *   }
         */
        jUI.Dataset.prototype.addDatasetFields = function(fna){
            fna && app.$(this.__V.Dataset.datasetFields,fna,true);
        };
        /**
         * @param {String} fieldName 
         * @param {jUI.Dataset.DatasetField} datasetField <br/>
         *   jUI.Dataset.DatasetField {
         *      dataField: String, (the field to match from this dataset) <br/>
         *      dataset: jUI.Dataset, (the dataset to match with) <br/>
         *      keyField: String, (the key field to match dataField with) <br/>
         *      listField: String, (the field from the matched dataset to display) <br/>
         *   }
         */
        jUI.Dataset.prototype.addDatasetField = function(fieldName, datasetField){
            datasetField && (this.__V.Dataset.datasetFields[fieldName] = datasetField);
        };
        jUI.Dataset.prototype.removeDatasetField = function(fieldName){
            delete this.__V.Dataset.datasetFields[fieldName];
        };
        /**
         * @param {json{fieldName: function(fieldName: String, pos: int)}} fna <br/>
         */
        jUI.Dataset.prototype.addCalcFields = function(fna){
            fna && app.$(this.__V.Dataset.calcFields,fna,true);
        };
        /**
         * @param {String} fieldName description
         * @param {function(fieldName: String, pos: int)} func <br/>
         */
        jUI.Dataset.prototype.addCalcField = function(fieldName, func){
            var V = this.__V.Dataset;
            V.calcField && (V.calcFields[fieldName] = func);
        };
        jUI.Dataset.prototype.removeCalcField = function(fieldName){
            delete this.__V.Dataset.calcFields[fieldName];
        };
        /**
         * @param {String | ":pos"} fieldName The field name or ":pos" if the row number\
         *                                    is needed to be the key.
         */
        jUI.Dataset.prototype.setKeyField = function(fieldName){
            this.__V.Dataset.keyField = fieldName;
        }
        jUI.Dataset.prototype.setFieldValue = function(fieldName, value){
            this.setFieldValueAt(fieldName, this.__V.Dataset.pos, value);
        };
        jUI.Dataset.prototype.setFieldValueAt = function(fieldName, rowNo, value){
            var V = this.__V.Dataset;
            if(V.eof) return;
            var fi = V.type !== "Document"? V.fields[fieldName] : fieldName;
            if(fi != null){
                V.records[rowNo][fi] = value;
                this._doDataUpdate(rowNo,rowNo);
            }
        };
        jUI.Dataset.prototype.setPos = function(newPos){
            var V = this.__V.Dataset;
            if(V.lockPos || newPos == undefined || V.pos === newPos) return false;
            if(newPos <= V.records.length){ 
                V.pos = newPos;
            }
            V.eof = V.pos >= V.records.length;
            this._doDataChanged();
            return true;
        };
        /**
         * @param {jUI.Dataset} v
         */
        jUI.Dataset.prototype.setMasterDataset = function(v){
            var V = this.__V.Dataset;
            if(V.masterDataset === v) return;
            V.masterDataset && V.masterDataset._removeChildDataset(this);
            (V.masterDataset = v) && V.masterDataset._addChildDataset(this);
        };
        jUI.Dataset.prototype.setMasterKey = function(v){
            var V = this.__V.Dataset;
            V.masterKey = v;
        };
        jUI.Dataset.prototype.setDataKey = function(v){
            var V = this.__V.Dataset;
            V.dataKey = v;
        };
        jUI.Dataset.prototype.setUrl= function(v){
            this.__V.Dataset.url = v;
        };
        jUI.Dataset.prototype.setMode = function(v){
            this.__V.Dataset.mode = v;
        };
        jUI.Dataset.prototype.setType = function(v){
            this.__V.Dataset.staticType = v;
        };
        
        
        jUI.Dataset.prototype.setAutoSubmit = function(v){
            this.__V.Dataset.autoSubmit = v;
        };
        /**
         * @param {json {name: value}} v
         */
        jUI.Dataset.prototype.addParams = function(v){
            app.$(this.__V.Dataset.params,v,true);
        };
        /**
         * @see getFieldValueAt
         */
        jUI.Dataset.prototype.getFieldValue = function(fieldName){
            return this.f(fieldName);
        };
        /**
         * @see getFieldValueAt
         */
        jUI.Dataset.prototype.f = function(fieldName){
            return this.getFieldValueAt(fieldName, this.__V.Dataset.pos);
        };
        /**
         * @see getFieldValueAt
         */
        jUI.Dataset.prototype.fAt = function(fieldName,index){
            return this.getFieldValueAt(fieldName, index);
        };
        jUI.Dataset.prototype.getKeyValue = function(){
            var V = this.__V.Dataset;
            return this.getFieldValueAt(V.keyField, V.pos);
        };
        jUI.Dataset.prototype.getKeyValueAt = function(index){
            return this.getFieldValueAt(this.__V.Dataset.keyField, index);
        };
        jUI.Dataset.prototype._analyzeDocumentFieldValue = function(v){
            var V = this.__V.Dataset;
            if(v && v instanceof Object){
                if(v.$oid){
                    v = v.$oid;
                }else if(v.$date){
                    V.tempDate.setDateTimeIntValue(v.$date);
                    v = V.tempDate.toString("%Y-%M-%D %h:%m:%s");
                }
            }
            return v;
        };
        /**
         * @param {String} fieldName The value can be either a single field name or a path (e.g. parentField.childField) to a field in case of a Document type dataset.
         * @param {Integer} rowNo The index of the row for which field value to be returned.
         * @returns {Object} Mostly the value is going to be a String value. However, in the case of a Document type dataset, the value could be anything including an array or a JSON object.
         */
        jUI.Dataset.prototype.getFieldValueAt = function(fieldName, rowNo){
            var V = this.__V.Dataset;
            if(rowNo >= V.records.length || rowNo < 0 ) return '';
            var f,dsf,v;
            if(fieldName === ":pos") return V.pos;
            var compField = function(){
                if(V.datasetFields[fieldName] == undefined){ 
                    if(V.calcFields[fieldName] == undefined || !(f=V.calcFields[fieldName])) return '';
                    return f.call(this,fieldName,rowNo);
                }else{
                    (dsf=V.datasetFields[fieldName]).dataset.locate(dsf.keyField,this.getFieldValueAt(dsf.dataField,rowNo));
                    return dsf.dataset.f(dsf.listField);
                }
            };
            if(V.type === "Document"){
                var path = fieldName.split(".");
                v = V.records[rowNo];
                if(path.length > 1){
                    for(var i=0,l=path.length;i<l;++i){
                        if(v == null) break;
                        v = v[path[i]];
                    }
                }else{
                    v = v[fieldName];
                }
                v = this._analyzeDocumentFieldValue(v);
                if(v === undefined){
                    v = compField();
                }
            }else{
                if(V.fields[fieldName] == undefined){ 
                    v = compField();
                }else v = V.records[rowNo][V.fields[fieldName]];
            }
            return v == null? '' : v;
        };
        jUI.Dataset.prototype.getNumOfRows = function(){
            return this.__V.Dataset.records.length;
        };
        jUI.Dataset.prototype.indexOf = function(keyValue){
            var i = -1;
            this.forEach(function(index){
                if(this.getKeyValueAt(index) === keyValue){
                    i = index;
                    return false;
                }
            });
            return i;
        };
        jUI.Dataset.prototype.getErrorCode = function(){
            return this.__V.Dataset.errorCode;
        };
        jUI.Dataset.prototype.getErrorType = function(){
            return this.__V.Dataset.errorType;
        };
        jUI.Dataset.prototype.hadError = function(){
            return this.__V.Dataset.errorType != 0;
        };
        jUI.Dataset.prototype.getOtherInfo = function(tagName){
            var V = this.__V.Dataset;
            if(tagName){
                for(var i=0,l=V.otherInfo.length;i<l;++i){
                    if(V.otherInfo[i].getTagName() === tagName) return V.otherInfo[i];
                }
                return null;
            }
            return V.otherInfo;
        };
        jUI.Dataset.prototype.getPos = function(){
            return this.__V.Dataset.pos;
        };
        jUI.Dataset.prototype.getFields = function(){
            var V = this.__V.Dataset;
            if(V.type === "Document"){
                var flds = {};
                var rec = V.records[0], i =0;
                if(rec){
                    for(var f in rec){
                        flds[f] = i++;
                    }
                }
                return flds;
            }
            return V.fields;
        };
        jUI.Dataset.prototype.getFieldIndex = function(fName){
            var flds = this.getFields();
            return flds[fName] || -1;
        };
        jUI.Dataset.prototype.getRecords = function(){ return this.__V.Dataset.records; };
        jUI.Dataset.prototype.getNumOfColumns = function(){ 
            var flds = this.getFields(),count=0;
            for(var f in flds) ++count;
            return count;
        };
        jUI.Dataset.prototype.getDatasetData = function(){
            var V = this.__V.Dataset,ar = {DATASET:{datasetinfo:{key:V.keyField},fields:[],rows:[],type: V.type}},f = ar.DATASET.fields,rs = ar.DATASET.rows;
            for(var fld in V.fields) f.push(fld);
            for(var i=0,j,l=V.records.length,l2=f.length,r;i<l;++i){ 
                if(V.type !== "Document"){
                    rs.push(r = []);
                    for(j=0;j<l2;++j) r.push(V.records[i][j]);
                }else{
                    rs.push(V.records[i]);
                }
            }
            for(var i=0,l=V.otherInfo.length;i<l;++i) ar[V.otherInfo[i].getTagName()] = V.otherInfo[i].getResponse();
            return ar;
        };
        jUI.Dataset.prototype.getKeyField = function(){ return this.__V.Dataset.keyField; };
        jUI.Dataset.prototype.getMasterDataset = function(){ return this.__V.Dataset.masterDataset; };
        jUI.Dataset.prototype.getMasterKey = function(){ return this.__V.Dataset.masterKey; };
        jUI.Dataset.prototype.getDataKey = function(){ return this.__V.Dataset.dataKey; };
        jUI.Dataset.prototype.getUrl = function(){ return this.__V.Dataset.url; };
        jUI.Dataset.prototype.getAutoSubmit = function(){
            return this.__V.Dataset.autoSubmit;
        };
        jUI.Dataset.prototype.getMode = function(){
            return this.__V.Dataset.mode;
        };
        jUI.Dataset.prototype.isViewMode = function(){
            return this.__V.Dataset.mode === jUI.dsmView;
        };
        jUI.Dataset.prototype.isAddMode = function(){
            return this.__V.Dataset.mode === jUI.dsmAdd;
        };
        jUI.Dataset.prototype.isEditMode = function(){
            return this.__V.Dataset.mode === jUI.dsmEdit;
        };

        jUI.Dataset.prototype._doReady = function(){
            var V = this.__V.Dataset,so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDatasetReady(so);});
                this._doEvent("ready");
                this._doDataChanged();
            }
        };
        jUI.Dataset.prototype._doRefresh = function(){
            var V = this.__V.Dataset,so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDatasetRefresh(so);});
                this._doEvent("refresh");
            } 
        };
        jUI.Dataset.prototype._doDataChanged = function(){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDataChanged(so);});
                if(V.childDSDis) 
                    V.childDSDis = false;
                else
                    V.childDatasets.forEach(function(v){v.submit();});
                this._doEvent("dataChanged");
            }
        };
        jUI.Dataset.prototype._doDataUpdate = function(from, to){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDataUpdate && v._doDataUpdate(so,from, to);});
                this._doEvent("dataUpdate", from, to);
            }
        };
        jUI.Dataset.prototype._doDataAdded = function(startRowNo, endRowNo){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDataAdded && v._doDataAdded(so,startRowNo, endRowNo);});
                this._doEvent("dataAdd", startRowNo, endRowNo);
            }
        };
        jUI.Dataset.prototype._doBeforeDataDeleted = function(startRowNo, endRowNo){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doBeforeDataDeleted && v._doBeforeDataDeleted(so,startRowNo, endRowNo);});
                this._doEvent("beforeDataDelete", startRowNo, endRowNo);
            }
        };
        jUI.Dataset.prototype._doDataDeleted = function(startRowNo, endRowNo){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doDataDeleted && v._doDataDeleted(so,startRowNo, endRowNo);});
                this._doEvent("dataDelete", startRowNo, endRowNo);
            }
        };
        jUI.Dataset.prototype._doModeChanged = function(){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._doModeChanged && v._doModeChanged(so,V.mode);});
                this._doEvent("modeChanged", V.mode);
            }
        };
        jUI.Dataset.prototype._dataSaved = function(){
            var V = this.__V.Dataset, so = this;
            if(!V.disableComponentsStatus){
                V.dbComponents.forEach(function(v){v._dataSaved && v._dataSaved(so);});
                this._doEvent("dataSaved");
                this.setMode(jUI.dsmView);
            }
        };
        
        /**
         * @description If url is not ":master//", submit an ajax request.\
         *              Unless provided, a parameter FUNC_NO will be \
         *              added to the extraParams field with a value \
         *              according to the dataset mode (view, add, or edit).\
         *              If url is ":master//" and options is empty or\
         *              null, the function will transfer control directly\
         *              to setData where the data will be taken from\
         *              the master data set from the master key field.\
         *              If url is ":master//" and options is not empty,\
         *              the operation will be carried over using the url\
         *              provided by the master data set along with all\
         *              the necessary keys from the master data set.
         *              
         *              
         * @param {json} options {<br/>
         *      extraParams:{fieldName:value},<br/>
         *      extraCompos: [jUI.DBComponent], <br/>
         *      wait:boolean (default false) whether the call should be synchronous (true) or asynchronous (false), <br/>
         *      finish: function(status:boolean) status true if sucess, false otherwise, <br/>
         *      loader: jUI.LoaderViewController <br/>
         * }
         */
        jUI.Dataset.prototype.submit = function(options){
            var V = this.__V.Dataset,so = this,isMasterUrl = V.url && V.url.match(/^:master\/\/.*/g);
            options = options || {};
            if(isMasterUrl && app.isObjectEmpty(options)){
                var masterField = V.url.match(/^:master\/\/(.*)/)[1];
                var data = V.masterDataset.f(masterField);
                if(!data){
                    data = [];
                    V.masterDataset.setFieldValue(masterField, data);
                }
                so.setData({rows:data});
                return;
            }
            options.extraParams = options.extraParams || {};
            V.keyField && (options.extraParams[V.keyField] = so.f(V.keyField));
            
            var requestParams = app.$(app.clone(V.params),options.extraParams,true);
            var err = "", compos = V.dbComponents;
            options.extraCompos && (compos = compos.concat(options.extraCompos));
            for(var i=0,l=compos.length,c;i<l;++i){ 
                if(!(c=compos[i]).checkRequirements())
                    err += c.getErrorText()+"<br>";
                requestParams[c.getName()] = c.getValue();
            }
            
            if(V.masterDataset && V.masterKey && V.dataKey){ 
                var mkey = V.masterDataset.f(V.masterKey);
                if(mkey === undefined || mkey === ''){ 
                    so.clear(); 
                    options.finish && options.finish(false);
                    return; 
                }
                requestParams[V.dataKey] = mkey;
            }
            if(err === ""){
                // Before we submit, we need to check if the url is ":master//".
                // If so, then we need to gather the url info and the necessary,
                // key/value pairs from the master data set(s). The process should
                // continue upwards until we reach a master data set that has 
                // an actual url.
                var url = V.url,ds = V;
                while(isMasterUrl){
                    ds !== V && (requestParams[ds.dataKey] = ds.masterDataset.f(ds.masterKey));
                    ds = ds.masterDataset.__V.Dataset;
                    url = ds.url;
                    isMasterUrl = url && url.match(/^:master\/\/.*/g)
                }
                requestParams.FUNC_NO = requestParams.FUNC_NO || V.mode;
                app.ajax({
                    url: url,
                    params: requestParams,
                    loader: options.loader,
                    success: function(data){
                        so._doEvent("receivedResponse",data);
                        if(data.error){
                            jUI.showMessage(app.lang['error'],data.error, jUI.MessageDialog.mtError, [jUI.Form.btnCancel]);
                            options.finish && options.finish(false);
                        }else{
                            so.setData(data.data);
                            options.finish && options.finish(!so.hadError());
                        }
                    },
                    wait: options.wait || false
                });
            }else{ 
                jUI.showMessage(app.lang['error'],err, jUI.MessageDialog.mtError, [jUI.Form.btnCancel]);
                options.finish && options.finish(false);
            }
        };
        jUI.Dataset.prototype.disableChildDatasetsOnce = function(){
            this.__V.Dataset.childDSDis = true;
        };
        jUI.Dataset.prototype.clone = function(){
            var V = this.__V.Dataset;
            return new jUI.Dataset({
                url: V.url,
                masterDataset: V.masterDataset,
                masterKey: V.masterKey,
                dataKey: V.dataKey,
                datasetFields: V.datasetFields,
                calcFields: V.calcFields,
                data: V.datasetData,
                params: V.params
            });
        };
        
        
        app.$(jUI.Dataset.prototype.__props = app.clone(jUI.Dataset.prototype.__props), {
            url: "setUrl",
            data: "setData", 
            masterDataset: "setMasterDataset", 
            masterKey: "setMasterKey",
            dataKey: "setDataKey",
            params: "addParams",
            type: "setType",
            datasetFields: "addDatasetFields",
            calcFields: "addCalcFields",
            autoSubmit: 'setAutoSubmit',
            mode: "setMode",
            keyField: "setKeyField"
        });
        
        jUI.Dataset.prototype.__events = jUI.Dataset.prototype.__events.clone().concat([
            "dataSaved",
            "ready",
            "refresh",
            "dataChanged",
            "dataUpdate",
            "dataDelete",
            "dataAdd",
            "beforeDataDelete",
            "receivedResponse",
            "modeChanged"
        ]);
        
    })();
    
    // =================================================================================
    // Dataset End
    // =================================================================================
    
    
    // =================================================================================
    // List Start 
    // =================================================================================
    
    /**
     * jUI.List
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      columns: [jUI.List.Column], <br>
     *      autoSelect: boolean, (default false) <br>
     *      events: { <br>
     *        selectChange: function(row:int, status:boolean), <br>
     *        ready: function() <br>
     *      }<br>
     * }
     * @constructor
     */
    jUI.List = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui list"
        }, false);
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.List.prototype = new jUI.DBComponent({__loading__: true});
	jUI.List.prototype.constructor = jUI.List;
        
        
        // Overriden Function Start ===========================================
        
        jUI.List.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var tbl,tbody,so = this,el = this.__V.el;
            var V = this.__V.List = {
                table: tbl = document.createElement("table"),
                body: tbody = document.createElement("tbody"),
                cols: [],
                selectedRow: null,
                autoSelect: false
            };
            tbl.appendChild(tbody);
            el.style.overflow = "auto";
            app.$(tbl.style,{
                "table-layout": "fixed",
                width: "100%",
                "overflow-x": "hidden"
            },true);
            el.tabIndex = "1";
            
            tbl.onmousedown = function(e){
                e = e || window.event;
                var y = e.layerY + (app.brwFirefox? 0 : el.scrollTop - this.offsetTop), tbl = this;
                var findRow = function(start,end){
                    if(start > end) return null;
                    var mid = (start + end) >> 1, rMid = tbl.rows[mid], t = rMid.offsetTop, b = t + rMid.offsetHeight;
                    if(t > y) return findRow(start,mid - 1);
                    if(b < y) return findRow(mid + 1, end);
                    return rMid;
                };
                var r = findRow(0,this.rows.length-1);
                if(r){
                    var ri = r.rowIndex;
                    ri >= 0 && so.select(ri);
                }
            };
            el.onkeydown = function(e){
                var selRow = V.selectedRow,k = e.keyCode,cancel;
                if(selRow != null){
                    if(k === 38){
                        so.select(selRow-1);
                        cancel = true;
                    }else if(k === 40){
                        so.select(selRow+1);
                        cancel = true;
                    }
                }
                if(cancel){
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble=true;
                    e.returnValue=false;
                    return false;
                }
            };
            el.appendChild(tbl);
        };
        /**
         * @param {int} flag 1: Horizontal, 2: Vertical, 3: Both
         * @param {int} extraSpace
         */
        jUI.List.prototype.fitContent = function(flag, extraSpace){ 
            var V = this.__V,tbl = V.List.table;
            if(!V.el.offsetParent) return;
            !flag && (flag = 3);
            !extraSpace && (extraSpace = 0);
            var cw = tbl.offsetWidth, ch = tbl.offsetHeight;
            (flag & 1) && this.setInnerWidth(cw + extraSpace);
            (flag & 2) && this.setInnerHeight(ch + extraSpace);
        };
        jUI.List.prototype.finalize = function(){
            jUI.DBComponent.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        /**
         * @param {int|null} li left index, the column from which the refresh should happen. If null, it starts from the first column.
         * @param {int|null} ti top index, the row from which the refresh should happen. If null, it starts from the first row.
         * @param {int|null} ri right index, the column to which the refresh should happen. If null, it ends at the last column.
         * @param {int|null} bi bottom index, the row to which the refresh should happen. If null, it ends at the last row.
         */
        jUI.List.prototype._refresh = function(li,ti,ri,bi){
            var V = this.__V.List,tblBody = V.body,r,l1,l2,ds=this.getDataset();
            l1 = ds ? ds.getNumOfRows() : 0;
            l2 = tblBody.rows.length;
            li = li || 0;
            ti = ti || 0;
            ri = ri || V.cols.length - 1;
            bi = bi || l2 - 1;
            
            if(l2 - 1 > bi) l2 = bi + 1;
            
            // Update the data.
            for(var i=ti;i<=bi;++i){
                r = tblBody.rows[i];
                // Update the cell contents.
                for(var j=li,c;j<=ri;++j){
                    c = V.cols[j];
                    r.cells[j].innerHTML = ds.getFieldValueAt(c.__V.ListColumn.dataField,i);
                    c._updateTableCell(r.cells[j]);
                }
            }
        };
        jUI.List.prototype._scrollTo = function(index){
            var V = this.__V.List,el = this.__V.el, r = V.body.rows[index];
            var pos = r.offsetTop - el.scrollTop;
            if( 
                pos + r.offsetHeight > this.getHeight() - 30 ||
                pos < 0
            ){
                el.scrollTop = r.offsetTop;
            }
        };
        jUI.List.prototype.setAutoSelect = function(v){
            this.__V.List.autoSelect = v;
            var ds = this.getDataset();
            ds && this.select(ds.getPos());
        };
        /**
         * @param {[jUI.List.Column]} v
         */
        jUI.List.prototype.addColumns = function(v){
            var V = this.__V.List,li = V.cols.length;
            v && v.forEach(function(c){
                V.cols.push(c);
                for(var i=0,l=V.body.rows.length;i<l;++i){
                    V.body.rows[i].insertCell(-1);
                }
            });
            this._refresh(li);
        };
        jUI.List.prototype.removeColumn = function(index){
            var V = this.__V.List,c=V.cols[index];
            if(c){
                V.cols.deleteItem(index);
                for(var i=0,l=V.body.rows.length;i<l;++i){
                    V.body.rows[i].deleteCell(index);
                }
                // there is no reason for a refresh since all cells are removed.
                //this._refresh();
            }
        };
        jUI.List.prototype.select = function(index){
            var V = this.__V.List, tblBody = V.body;
            if(V.selectedRow === index) return;
            if(index != null){
                if(index < 0 || index >= tblBody.rows.length) return;
                V.selectedRow != null && this.select(null);
                tblBody.rows[index].setAttribute("class","selected");
                this._scrollTo(index);
                V.selectedRow = index;
                this.getDataset().setPos(index);
                this._doEvent("selectChange",index,true);
            }else{
                this._doEvent("selectChange",V.selectedRow,false);
                tblBody.rows[V.selectedRow].setAttribute("class","");
                V.selectedRow = null;
            }
        };
        
        
        jUI.List.prototype.getColumn = function(index){
            return this.__V.List.cols[index];
        };
        jUI.List.prototype.getAutoSelect = function(){
            return this.__V.List.autoSelect;
        };
        jUI.List.prototype.getSelectedRow = function(){
            return this.__V.List.selectedRow;
        };
        jUI.List.prototype.export = function (filename) {
            var csvFile = '',csvRow, ds = this.getDataset(), cols = this.__V.List.cols;
            if(!ds) return;
            var addRow = function(i){
                csvRow = '';
                for (var j=0,l=cols.length,val;j<l;j++) {
                    if(i === -1)
                        val = cols[j].getTitle();
                    else
                        val = ds.fAt(cols[j].getDataField(),i);
                    if(val == null)
                        val = '';
                    val = val.replace(/"/g, '""');
                    if (val.search(/("|,|\n)/g) >= 0)
                        val = '"' + val + '"';
                    if (j > 0)
                        csvRow += ',';
                    csvRow += val;
                }
                csvFile += csvRow + '\n';
            };
            // add the headers.
            addRow(-1);
            // add the data.
            ds.forEach(addRow);
            // download the file.
            var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };
        
        jUI.List.prototype._doDatasetReady = function(dataset){
            // There is no reason to refresh the grid since
            // since the reason for this being fired happens 
            // after one of the other events has already been
            // fired.
            this._doEvent("ready");
        };
        jUI.List.prototype._doDatasetRefresh = function(dataset){
            var V = this.__V.List,r,ds = this.getDataset(),l1=ds ? ds.getNumOfRows() : 0,l2=V.body.rows.length;
            V.table.style.display = "none";
            if(l1 < l2){
                while(l2 > l1) V.body.deleteRow(--l2);
            }else if(l1 > l2){
                while(l1 > l2++){ 
                    r = V.body.insertRow(-1);
                    for(var j=0,l=V.cols.length;j<l;++j) r.insertCell(-1);
                }
            }
            this._refresh();
            ds && V.autoSelect && this.select(ds.getPos());
            V.table.style.display = "";
        };
        jUI.List.prototype._doDataChanged = function(dataset){
            var ds = this.getDataset();
            this.select(ds ? ds.getPos() : null);
        };
        jUI.List.prototype._doDataUpdate = function(dataset,from, to){
            this._refresh(null,from,null,to);
        };
        jUI.List.prototype._doDataAdded = function(dataset,from ,to){
            var t = to, V = this.__V.List,r;
            while(t-- > from){ 
                r = V.body.rows.insertRow(from);
                for(var i=0,l=V.cols.length;i<l;++i) r.insertCell(-1);
            }
            this._refresh(null,from,null,to);
        };
        jUI.List.prototype._doBeforeDataDeleted = function(dataset,from ,to){
            
        };
        jUI.List.prototype._doDataDeleted = function(dataset,from ,to){
            var V = this.__V.List,reselect;
            reselect = V.selectedRow >= from && V.selectedRow <= to;
            while(to-- > from) V.body.rows.deleteRow(from);
            reselect && this.select(V.selectedRow);
        };
        
        
        app.$(jUI.List.prototype.__props = app.clone(jUI.List.prototype.__props), {
            columns: "addColumns",
            autoSelect: "setAutoSelect"
        });
        
        jUI.List.prototype.__events = jUI.List.prototype.__events.clone().concat([
            "selectChange",
            "ready"
        ]);
        
    })();
    
    
    /**
     * jUI.List.Column 
     * @extends jUI.Object.
     * 
     * @param {json} pa {<br>
     *      title: String, <br>
     *      width: int | % | undefined (autoresize), <br>
     *      dataField: String, <br>
     *      checkColumn: boolean (default: false), <br/>
     *      align: "left" | "center" | "right" or "<" | "|" | ">" (defualt "left"), <br>
     *      valign: "top" | "middle" | "bottom" or "^" | "-" | "_" (defualt "middle") <br>
     * }
     * @constructor
     */
    jUI.List.Column = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            align: "<",
            valign: "-"
        }, false);
        jUI.Object.call(this, newPa);
    };
    (function(){
        jUI.List.Column.prototype = new jUI.Object({__loading__: true});
        jUI.List.Column.prototype.constructor = jUI.List.Column;
        
        
        // Overriden Function Start ===========================================
        
        jUI.List.Column.prototype._initProp = function(pa){
            jUI.Object.prototype._initProp.call(this, pa);
            var V = this.__V.ListColumn = {
                title: "",
                width: undefined,
                dataField: String,
                align: null,
                valign: null
            };
        };
        
        jUI.List.Column.prototype.finalize = function(){
            jUI.Object.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================

        
        jUI.List.Column.prototype._updateTableCell = function(cell){
            var V = this.__V.ListColumn,s = cell.style;
            if(cell.parentNode.rowIndex === 1)
                s.width = V.width + (+V.width? "px" : "");
            var v = V.align;
            if(app.rtl){
                if(v === "left") v = "right";
                else if(v === "right") v = "left";
            }
            s.textAlign = v;
            s.verticalAlign = V.valign;
            
        };
        jUI.List.Column.prototype.setTitle = function(v){
            this.__V.ListColumn.title = v;
        };
        jUI.List.Column.prototype.setWidth = function(v){
            this.__V.ListColumn.width = v;
        };
        jUI.List.Column.prototype.setDataField = function(v){
            this.__V.ListColumn.dataField = v;
            // We need to refresh this column on the list.
        };
        jUI.List.Column.prototype.setAlign = function(v){
            var V = this.__V;
            switch(v){
                case "<": v = "left"; break;
                case "|": v = "center"; break;
                case ">": v = "right"; break;
            }
            V.ListColumn.align = v;
        };
        jUI.List.Column.prototype.setVAlign = function(v){
            var V = this.__V;
            switch(v){
                case "^": v = "top"; break;
                case "-": v = "middle"; break;
                case "_": v = "bottom"; break;
            }
            V.ListColumn.valign = v;
        };
        
        
        
        
        jUI.List.Column.prototype.getTitle = function(){
            return this.__V.ListColumn.title;
        };
        jUI.List.Column.prototype.getWidth = function(){
            return this.__V.ListColumn.width;
        };
        jUI.List.Column.prototype.getDataField = function(){
            return this.__V.ListColumn.dataField;
        };
        jUI.List.Column.prototype.getAlign= function(){
            return this.__V.ListColumn.align;
        };
        jUI.List.Column.prototype.getVAlign= function(){
            return this.__V.ListColumn.valign;
        };
        
        app.$(jUI.List.Column.prototype.__props = app.clone(jUI.List.Column.prototype.__props), {
            title: "setTitle",
            width: "setWidth",
            dataField: "setDataField",
            align: "setAlign",
            valign: "setVAlign"
        });
        
        jUI.List.Column.prototype.__events = jUI.List.Column.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // List End
    // =================================================================================
    
    
    
    // =================================================================================
    // Grid Start 
    // =================================================================================
    
    /**
     * jUI.Grid
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      showTitle: boolean (default true), <br>
     *      columns: [jUI.Grid.Column], <br>
     *      selectionMode: jUI.smXXX, (default jUI.smSingle) <br>
     *      events: { <br>
     *        selectChange: function(row:int, status:boolean) ,<br>
     *        ready: function() <br>
     *      }<br>
     * }
     * @constructor
     */
    jUI.Grid = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui grid",
            showTitle: true
        }, false);
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.smSingle = 1;
        jUI.smMultiple = 2;
    })();
    (function(){
        
        jUI.Grid.prototype = new jUI.DBComponent({__loading__: true});
        jUI.Grid.prototype.constructor = jUI.Grid;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Grid.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var tbl,thd,tbody,lbtbl,lbthd,so = this,el = this.__V.el;
            var V = this.__V.Grid = {
                table: tbl = document.createElement("table"),
                header: thd = tbl.createTHead(),
                body: tbody = document.createElement("tbody"),
                labelTable: lbtbl = document.createElement("table"),
                labelHeader: lbthd = lbtbl.createTHead(),
                showTitle: false,
                cols: [],
                selectedRows: [],
                selectionMode: jUI.smSingle
            };
            tbl.appendChild(tbody);
            el.style.overflow = "auto";
            el.tabIndex = "1";
            var f = app.rtl ? "right" : "left";
            tbl.style["float"] = f;
            thd.style.display = "none";
            thd.insertRow(0);
            
            lbtbl.style.display = "none";
            lbtbl.style.position = "absolute";
            lbtbl.style["float"] = f;
            lbthd.insertRow(0);
            
            lbtbl.onmousedown = tbl.onmousedown = function(e){
                e = e || window.event;
                var y = e.layerY + (app.brwFirefox? 0 : el.scrollTop - this.offsetTop), tbl = this;
                var findRow = function(start,end){
                    if(start > end) return null;
                    var mid = (start + end) >> 1, rMid = tbl.rows[mid], t = rMid.offsetTop, b = t + rMid.offsetHeight;
                    if(t > y) return findRow(start,mid - 1);
                    if(b < y) return findRow(mid + 1, end);
                    return rMid;
                };
                var r = findRow(0,this.rows.length-1);
                if(r){
                    var ri = r.rowIndex;
                    if(ri > 0){
                        if(V.selectionMode === jUI.smMultiple){
                            so.setSelected(ri-1,V.selectedRows.indexOf(ri-1) === -1);
                        }else{
                            so.select(ri-1);
                        }
                    }else if(so.getShowTitle()){
                        for(var i=0,l=this.rows[0].cells.length,c;i<l;++i){
                            c = this.rows[0].cells[i];
                            if(e.layerX >= c.offsetLeft && e.layerX <= c.offsetLeft + c.offsetWidth){
                                so._clickColumn(c.cellIndex);
                                return;
                            }
                        }
                    }
                }
            };
            el.onkeydown = function(e){
                if(V.selectionMode !== jUI.smSingle) return;
                var selRow = V.selectedRows.getLast(),k = e.keyCode,cancel;
                if(selRow != null){
                    if(k === 38){
                        so.select(selRow-1);
                        cancel = true;
                    }else if(k === 40){
                        so.select(selRow+1);
                        cancel = true;
                    }
                }
                if(cancel){
                    if(e.preventDefault) e.preventDefault();
                    e.cancelBubble=true;
                    e.returnValue=false;
                    return false;
                }
            };
            el.appendChild(tbl);
            el.appendChild(lbtbl);
            el.onscroll = function(){
                if(!so.getShowTitle()) return;
                var r1 = tbl.rows[0], r2 = lbtbl.rows[0];
                for(var i=0,l=r1.cells.length;i<l;++i){
                    r2.cells[i].style.width = r1.cells[i].offsetWidth + "px";
                }
                lbtbl.style.width = tbl.offsetWidth + "px";
                lbtbl.style.top = this.scrollTop+"px";
                lbtbl.style.display = this.scrollTop > 0? "" : "none";

            };
        };
        /**
         * @param {int} flag 1: Horizontal, 2: Vertical, 3: Both
         * @param {int} extraSpace
         */
        jUI.Grid.prototype.fitContent = function(flag, extraSpace){ 
            var V = this.__V,tbl = V.Grid.table;
            if(!V.el.offsetParent) return;
            !flag && (flag = 3);
            !extraSpace && (extraSpace = 0);
            var cw = tbl.offsetWidth, ch = tbl.offsetHeight;
            (flag & 1) && this.setInnerWidth(cw + extraSpace);
            (flag & 2) && this.setInnerHeight(ch + extraSpace);
        };
        jUI.Grid.prototype.getValue = function(){
            var V = this.__V.Grid, retVal = "",ds = this.getDataset();
            if(V.selectedRows.length){
               V.selectedRows.forEach(function(val){
                   retVal += (retVal === ""? "" : ",") + ds.getKeyValueAt(val);
               }); 
            }
            return retVal;
            
        };
        jUI.Grid.prototype.finalize = function(){
            
            jUI.DBComponent.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================
        
        jUI.Grid.prototype.setShowTitle = function(v){
            var V = this.__V.Grid;
            V.header.style.display = v ? "" : "none";
            !v && (V.labelTable.style.display = "none");
            V.showTitle = v;
        };
        /**
         * @param {int|null} li left index, the column from which the refresh should happen. If null, it starts from the first column.
         * @param {int|null} ti top index, the row from which the refresh should happen. If null, it starts from the first row.
         * @param {int|null} ri right index, the column to which the refresh should happen. If null, it ends at the last column.
         * @param {int|null} bi bottom index, the row to which the refresh should happen. If null, it ends at the last row.
         */
        jUI.Grid.prototype._refresh = function(li,ti,ri,bi){
            var V = this.__V.Grid,tblBody = V.body,r,l1,l2,ds=this.getDataset();
            l1 = ds ? ds.getNumOfRows() : 0;
            l2 = tblBody.rows.length;
            li = li || 0;
            ti = ti || 0;
            ri = ri || V.cols.length - 1;
            bi = bi || l2 - 1;
            
            if(l2 - 1 > bi) l2 = bi + 1;
            
            // Update the data.
            for(var i=ti;i<=bi;++i){
                r = tblBody.rows[i];
                // Update the cell contents.
                for(var j=li,c;j<=ri;++j){
                    c = V.cols[j];
                    c._updateTableCell(r.cells[j], ds.getFieldValueAt(c.__V.GridColumn.dataField,i));
                }
            }
            
        };
        jUI.Grid.prototype._scrollTo = function(index){
            var V = this.__V.Grid,el = this.__V.el, r = V.body.rows[index],
                lblh = (V.showTitle ? V.header.offsetHeight : 0);
            var pos = r.offsetTop - el.scrollTop;
            if( 
                pos + r.offsetHeight > this.getHeight() - 30 ||
                pos - lblh < 0
            ){
                el.scrollTop = r.offsetTop - lblh;
            }
        };
        /**
         * @param {[jUI.Grid.Column]} v
         */
        jUI.Grid.prototype.addColumns = function(v){
            var V = this.__V.Grid,li = V.cols.length;
            v && v.forEach(function(c){
                V.header.rows[0].appendChild(c.__V.GridColumn.scrollEl);
                V.labelTable.rows[0].appendChild(c.__V.el);
                V.cols.push(c);
                for(var i=0,l=V.body.rows.length;i<l;++i){
                    V.body.rows[i].insertCell(-1);
                }
            });
            this._refresh(li);
        };
        jUI.Grid.prototype.removeColumn = function(index){
            var V = this.__V.Grid,c=V.cols[index];
            if(c){
                V.header.rows[0].removeChild(c.__V.GridColumn.scrollEl);
                V.labelTable.rows[0].removeChild(c.__V.el);
                V.cols.deleteItem(index);
                for(var i=0,l=V.body.rows.length;i<l;++i){
                    V.body.rows[i].deleteCell(index);
                }
                // there is no reason for a refresh since all cells are removed.
                //this._refresh();
            }
        };
        jUI.Grid.prototype._clickColumn = function(index){
            var V = this.__V.Grid, ds = this.getDataset();
            ds && ds.sort(V.cols[index].getDataField());
        };
        jUI.Grid.prototype.setSelected = function(index, status){
            var V = this.__V.Grid, tblBody = V.body;
            if(index != null){
                if(index < 0 || index >= tblBody.rows.length) return;
                if(status){
                    if(V.selectedRows.indexOf(index) !== -1) return;
                    if(V.selectionMode === jUI.smSingle && V.selectedRows.length){
                        this.setSelected(V.selectedRows[0],false);
                    }
                    this._scrollTo(index);
                    V.selectedRows.push(index);
                    this.getDataset().setPos(index);
                }else{
                    V.selectedRows.remove(index);
                }
                tblBody.rows[index].setAttribute("class", status? "selected" : "");
                tblBody.rows[index].setAttribute("selected", status);
                this._doEvent("selectChange",index,status);
            }
        };
        jUI.Grid.prototype.getSelected = function(index){
            return this.__V.Grid.selectedRows.indexOf(index) !== -1;
        }
        jUI.Grid.prototype.setSelectionMode = function(v){
            var V = this.__V.Grid;
            if(v === V.selectionMode) return;
            if(v === jUI.smSingle){
                while(V.selectedRows.length > 1){
                    this.setSelected(V.selectedRows[0],false);
                }
            }
            V.selectionMode = v;
        };
        jUI.Grid.prototype.select = function(index){
            if(index != null){
                this.setSelected(index, true);
            }else{
                this.setSelected(this.__V.Grid.selectedRows.getLast(), false);
            }
        };
        jUI.Grid.prototype.selectValue = function(v){
            var ds = this.getDataset();
            if(v != null && ds){
                var i = ds.indexOf(v);
                i !== -1 && this.setSelected(i, true);
            }
        };
        
        
        jUI.Grid.prototype.getShowTitle = function(){
            return this.__V.Grid.showTitle;
        };
        jUI.Grid.prototype.getColumn = function(index){
            return this.__V.Grid.cols[index];
        };
        jUI.Grid.prototype.getSelectedRow = function(){
            return this.__V.Grid.selectedRows.getLast();
        };
        jUI.Grid.prototype.getSelectedRows = function(){
            return this.__V.Grid.selectedRows;
        };
        jUI.Grid.prototype.export = function (filename) {
            var csvFile = '',csvRow, ds = this.getDataset(), cols = this.__V.Grid.cols;
            if(!ds) return;
            var addRow = function(i){
                csvRow = '';
                for (var j=0,l=cols.length,val;j<l;j++) {
                    if(i === -1)
                        val = cols[j].getTitle();
                    else
                        val = ds.fAt(cols[j].getDataField(),i);
                    if(val == null)
                        val = '';
                    val = val.replace(/"/g, '""');
                    if (val.search(/("|,|\n)/g) >= 0)
                        val = '"' + val + '"';
                    if (j > 0)
                        csvRow += ',';
                    csvRow += val;
                }
                csvFile += csvRow + '\n';
            };
            // add the headers.
            addRow(-1);
            // add the data.
            ds.forEach(addRow);
            // download the file.
            var blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        };
        
        jUI.Grid.prototype._doDatasetReady = function(dataset){
            // There is no reason to refresh the grid since
            // the reason for this being fired happens 
            // after one of the other events has already been
            // fired.
            this._doEvent("ready");
            
        };
        jUI.Grid.prototype._doDatasetRefresh = function(dataset){
            var V = this.__V.Grid,r,ds = this.getDataset(),l1=ds ? ds.getNumOfRows() : 0,l2=V.body.rows.length;
            V.table.style.display = "none";
            if(l1 < l2){
                while(l2 > l1) V.body.deleteRow(--l2);
            }else if(l1 > l2){
                while(l1 > l2++){ 
                    r = V.body.insertRow(-1);
                    for(var j=0,l=V.cols.length;j<l;++j) r.insertCell(-1);
                }
            }
            this._refresh();
            V.selectedRows.clear();
            ds && V.selectionMode === jUI.smSingle && this.select(ds.getPos());
            V.table.style.display = "";
        };
        jUI.Grid.prototype._doDataChanged = function(dataset){
            var ds = this.getDataset();
            this.__V.Grid.selectionMode === jUI.smSingle && this.select(ds ? ds.getPos() : null);
        };
        jUI.Grid.prototype._doDataUpdate = function(dataset,from, to){
            this._refresh(null,from,null,to);
        };
        jUI.Grid.prototype._doDataAdded = function(dataset,from ,to){
            var t = to, V = this.__V.Grid,r;
            while(t-- >= from){ 
                r = V.body.insertRow(from);
                for(var i=0,l=V.cols.length;i<l;++i) r.insertCell(-1);
            }
            this._refresh(null,from,null,to);
            V.selectedRows.forEach(function(val, i){ 
                val > to && (this[i] += to - from + 1);
            });
        };
        jUI.Grid.prototype._doBeforeDataDeleted = function(dataset,from ,to){
            
        };
        jUI.Grid.prototype._doDataDeleted = function(dataset,from ,to){
            var V = this.__V.Grid;
            V.selectedRows.forEachR(function(val, i){ 
                val >= from && val <= to && (this.deleteItem(i));
                val > to && (this[i] -= to - from + 1);
            });
            while(to-- >= from) V.body.deleteRow(from);
            
        };
        
        
        app.$(jUI.Grid.prototype.__props = app.clone(jUI.Grid.prototype.__props), {
            showTitle: "setShowTitle",
            columns: "addColumns",
            selectionMode: "setSelectionMode"
        });
        
        jUI.Grid.prototype.__events = jUI.Grid.prototype.__events.clone().concat([
            "selectChange",
            "ready"
        ]);
        
    })();
    
    
    /**
     * jUI.Grid.Column 
     * @extends jUI.Object.
     * 
     * @param {json} pa {<br>
     *      title: String, <br>
     *      width: int | % | undefined (autoresize), <br>
     *      dataField: String, <br>
     *      align: "left" | "center" | "right" or "<" | "|" | ">" (defualt "left"), <br>
     *      valign: "top" | "middle" | "bottom" or "^" | "-" | "_" (defualt "middle") <br>
     * }
     * @constructor
     */
    jUI.Grid.Column = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            align: "<",
            valign: "-"
        }, false);
        jUI.Object.call(this, newPa, document.createElement("th"));
    };
    (function(){
        jUI.Grid.Column.prototype = new jUI.Object({__loading__: true});
        jUI.Grid.Column.prototype.constructor = jUI.Grid.Column;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Grid.Column.prototype._initProp = function(pa){
            jUI.Object.prototype._initProp.call(this, pa);
            var V = this.__V.GridColumn = {
                scrollEl: document.createElement("th"),
                title: "",
                width: undefined,
                dataField: String,
                align: null,
                valign: null
            };
            this.__V.el.appendChild(document.createTextNode(""));
            V.scrollEl.appendChild(document.createTextNode(""));
        };
        
        jUI.Grid.Column.prototype.finalize = function(){
            var V = this.__V;
            V.el.parentNode && V.el.parentNode.removeChild(V.el);
            jUI.Object.prototype.finalize.call(this);
        };
        
        // Overriden Function End ===========================================

        
        jUI.Grid.Column.prototype._updateTableCell = function(cell, value){
            var V = this.__V.GridColumn,s = cell.style, s2 = V.scrollEl.style;
            if(cell.parentNode.rowIndex === 1)
                s2.width = s.width = V.width + (+V.width? "px" : "");
            var v = V.align;
            if(app.rtl){
                if(v === "left") v = "right";
                else if(v === "right") v = "left";
            }
            s2.textAlign = s.textAlign = v;
            s2.verticalAlign = s.verticalAlign = V.valign;
            cell.innerHTML = value;
        };
        jUI.Grid.Column.prototype.setTitle = function(v){
            var V = this.__V;
            V.GridColumn.scrollEl.childNodes[0].nodeValue = V.el.childNodes[0].nodeValue = v;
            V.GridColumn.title = v;
        };
        jUI.Grid.Column.prototype.setWidth = function(v){
            var V = this.__V;
            V.GridColumn.scrollEl.style.width = V.el.style.width = v + (+v? "px" : "");
            V.GridColumn.width = v;
        };
        jUI.Grid.Column.prototype.setDataField = function(v){
            this.__V.GridColumn.dataField = v;
            // We need to refresh this column on the grid.
        };
        jUI.Grid.Column.prototype.setAlign = function(v){
            var V = this.__V;
            switch(v){
                case "<": v = "left"; break;
                case "|": v = "center"; break;
                case ">": v = "right"; break;
            }
            V.GridColumn.align = v;
            if(app.rtl){
                if(v === "left") v = "right";
                else if(v === "right") v = "left";
            }
            V.el.style.textAlign = v ;
            V.GridColumn.scrollEl.style.textAlign = v;
        };
        jUI.Grid.Column.prototype.setVAlign = function(v){
            var V = this.__V;
            switch(v){
                case "^": v = "top"; break;
                case "-": v = "middle"; break;
                case "_": v = "bottom"; break;
            }
            V.el.style.verticalAlign = v;
            V.GridColumn.scrollEl.style.verticalAlign = v;
            V.GridColumn.valign = v;
        };
        
        
        
        
        jUI.Grid.Column.prototype.getTitle = function(){
            return this.__V.GridColumn.title;
        };
        jUI.Grid.Column.prototype.getWidth = function(){
            return this.__V.GridColumn.width;
        };
        jUI.Grid.Column.prototype.getDataField = function(){
            return this.__V.GridColumn.dataField;
        };
        jUI.Grid.Column.prototype.getAlign= function(){
            return this.__V.GridColumn.align;
        };
        jUI.Grid.Column.prototype.getVAlign= function(){
            return this.__V.GridColumn.valign;
        };
        
        app.$(jUI.Grid.Column.prototype.__props = app.clone(jUI.Grid.Column.prototype.__props), {
            title: "setTitle",
            width: "setWidth",
            dataField: "setDataField",
            align: "setAlign",
            valign: "setVAlign"
        });
        
        jUI.Grid.Column.prototype.__events = jUI.Grid.Column.prototype.__events.clone().concat([
        ]);
        
    })();
    
    /**
     * jUI.Grid.CheckColumn 
     * @extends jUI.Grid.Column.
     * 
     * @param {json} pa {<br>
     *      title: String, <br>
     *      width: int | % | undefined (autoresize), <br>
     *      dataField: String, <br>
     *      align: "left" | "center" | "right" or "<" | "|" | ">" (defualt "left"), <br>
     *      valign: "top" | "middle" | "bottom" or "^" | "-" | "_" (defualt "middle") <br>
     * }
     * @constructor
     */
    /*
    jUI.Grid.CheckColumn = function(pa){
        if(pa && pa.__loading__) return;
        jUI.Grid.Column.call(this, pa);
    };
    (function(){
        jUI.Grid.CheckColumn.prototype = new jUI.Grid.Column({__loading__: true});
        jUI.Grid.CheckColumn.prototype.constructor = jUI.Grid.CheckColumn;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Grid.CheckColumn.prototype._initProp = function(pa){
            jUI.Grid.Column.prototype._initProp.call(this, pa);
            var options = {
                layout: jUI.ltFollowVer, 
                className:"jui checkbox"
            };
            var V = this.__V.GridCheckColumn = {
                checkIcon: app.$(options,jUI.Checkbox.prototype.getCheckIcon(),true),
                clearIcon: app.$(options,jUI.Checkbox.prototype._getClearIcon(),true),
                checkClick: function(){
                    var val = !this.getTag();
                    this.setTag(val);
                    alert(val);
                    this.$(val? V.checkIcon : V.clearIcon);
                },
                checkShape: null,
                checkShapeScroll: null
            };
            var pV = this.__V.GridColumn, el = this.__V.el;
            el.innerHTML = "";
            el.appendChild((V.checkShape = new jUI.Shape(V.clearIcon)).__V.el);
            V.checkShape.addEvent("click",V.checkClick);
            pV.scrollEl.innerHTML = "";
            pV.scrollEl.appendChild((V.checkShapeScroll = new jUI.Shape(V.clearIcon)).__V.el);
            V.checkShapeScroll.addEvent("click",V.checkClick);
        };
        
        jUI.Grid.CheckColumn.prototype.finalize = function(){
            var V = this.__V, cV = V.GridCheckColumn;
            V.el.parentNode && V.el.parentNode.removeChild(V.el);
            cV.checkShape.free();
            cV.checkShapeScroll.free();
            jUI.Grid.Column.prototype.finalize.call(this);
        };
        
        jUI.Grid.CheckColumn.prototype._updateTableCell = function(cell,value){
            var pV = this.__V.GridColumn, V = this.__V.GridCheckColumn,s = cell.style, s2 = pV.scrollEl.style;
            if(cell.parentNode.rowIndex === 1)
                s2.width = s.width = pV.width + (+pV.width? "px" : "");
            s2.textAlign = s.textAlign = "center";
            s2.verticalAlign = s.verticalAlign = "middle";
            if(!cell.firstChild){
                cell.appendChild((new jUI.Shape(V.clearIcon)).__V.el);
                cell.firstChild.juiObject.addEvent("click",V.checkClick);
            }
            cell.firstChild.juiObject.$(!value || (+value === 0)? V.clearIcon : V.checkIcon);
            cell.firstChild.juiObject.setTag(value);
        };
        
        jUI.Grid.CheckColumn.prototype.setTitle = function(v){
        };
        
        // Overriden Function End ===========================================
        
        app.$(jUI.Grid.CheckColumn.prototype.__props = app.clone(jUI.Grid.CheckColumn.prototype.__props), {
        });
        
        jUI.Grid.CheckColumn.prototype.__events = jUI.Grid.CheckColumn.prototype.__events.clone().concat([
        ]);
        
    })();
    */
    // =================================================================================
    // Grid End
    // =================================================================================
    
    // =================================================================================
    // TextField Start 
    // =================================================================================
    
    /**
     * jUI.TextField
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      placeholder: String, <br>
     *      readOnly: boolean (default false) <br>
     * }
     * @param {boolean} password (default false)
     * @constructor
     */
    jUI.TextField = function(pa, password){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui textfield"
        }, false);
        var el = document.createElement("input");
        el.type = password? "password" : "text";
        jUI.DBComponent.call(this,newPa,el);
    };
    (function(){
        jUI.TextField.prototype = new jUI.DBComponent({__loading__: true});
        jUI.TextField.prototype.constructor = jUI.TextField;
        
        
        // Overriden Function Start ===========================================
        
        jUI.TextField.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            this.__V.TextField = {
                
            };
            this._appendToClassName("input");
        };
        
        // Overriden Function End ===========================================
        
        jUI.TextField.prototype.setPlaceholder = function(v){
            this.__V.el.placeholder = v;
        };
        jUI.TextField.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        jUI.TextField.prototype.setName = function(v){
            this.__V.el.name = v;
        };
        
        jUI.TextField.prototype.getPlaceholder = function(){
            return this.__V.el.placeholder;
        };
        jUI.TextField.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };
        jUI.TextField.prototype.getName = function(){
            return this.__V.el.name;
        };
        
        app.$(jUI.TextField.prototype.__props = app.clone(jUI.TextField.prototype.__props), {
            placeholder: "setPlaceholder",
            readOnly: "setReadOnly",
            name: "setName"
        });
        
        jUI.TextField.prototype.__events = jUI.TextField.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // TextField End
    // =================================================================================
    
    
    // =================================================================================
    // TextArea Start 
    // =================================================================================
    
    /**
     * jUI.TextArea
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      cols: int, <br>
     *      rows: int, <br>
     *      readOnly: boolean (default false) <br>
     * }
     * @constructor
     */
    jUI.TextArea = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui textarea"
        }, false);
        var el = document.createElement("textarea");
        jUI.DBComponent.call(this,newPa,el);
    };
    (function(){
        jUI.TextArea.prototype = new jUI.DBComponent({__loading__: true});
	jUI.TextArea.prototype.constructor = jUI.TextArea;
        
        
        // Overriden Function Start ===========================================
        
        jUI.TextArea.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            this.__V.TextArea = {
                
            };
            this._appendToClassName("input");
        };
        
        // Overriden Function End ===========================================
        
        jUI.TextArea.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        jUI.TextArea.prototype.setCols = function(v){
            this.__V.el.cols = v;
        };
        jUI.TextArea.prototype.setRows = function(v){
            this.__V.el.rows = v;
        };
        /*
        jUI.TextArea.prototype.setWrapText = function(v){
            this.__V.el.wrap = v? "hard" : "soft";
        };
        */
        jUI.TextArea.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };
        jUI.TextArea.prototype.getCols = function(){
            return this.__V.el.cols;
        };
        jUI.TextArea.prototype.getRows = function(){
            return this.__V.el.rows;
        };
        /*
        jUI.TextArea.prototype.getWrapText = function(){
            return this.__V.el.wrap === "hard";
        };
        */
        app.$(jUI.TextArea.prototype.__props = app.clone(jUI.TextArea.prototype.__props), {
            cols: "setCols",
            rows: "setRows",
            readOnly: "setReadOnly",
            //wrapText: "setWrapText"
        });
        
        jUI.TextArea.prototype.__events = jUI.TextArea.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // TextArea End
    // =================================================================================
    
    // =================================================================================
    // Checkbox Start 
    // =================================================================================
    
    /**
     * jUI.Checkbox
     * 
     * @extends jUI._IconLabelComponent
     * 
     * @param {json} pa {<br>
     *      checked: boolean (default false), <br>
     *      readOnly: boolean (default false), <br>
     *      label: String, <br>
     *      events:{ <br>
     *          check: function(status:boolean) <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.Checkbox = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui checkbox"
        }, false);
        jUI._IconLabelComponent.call(this,newPa);
    };
    (function(){
        jUI.Checkbox.prototype = new jUI._IconLabelComponent({__loading__: true});
        jUI.Checkbox.prototype.constructor = jUI.Checkbox;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Checkbox.prototype._initProp = function(pa){
            jUI._IconLabelComponent.prototype._initProp.call(this, pa);
            var so = this,el = this.__V.el;
            this.__V.Checkbox = {
                checked: false
            };
            el.onclick = function(){
                so.toggle();
            };
            el.onkeyup = function(e){
                e.keyCode === 32 && so.toggle();
            };
            
            el.tabIndex = "1";
            this._appendToClassName("input");
            
            this._setIconPosition("left");
            this._setIcon(new jUI.Shape(this._getClearIcon()));
        };
        jUI.Checkbox.prototype.setValue = function(v){
            this.setChecked(!!v);
        };
        jUI.Checkbox.prototype.getValue = function(){
            return this.getChecked()? 1 : 0;
        };
        
        // Overriden Function End ===========================================
        
        jUI.Checkbox.prototype.toggle = function(){
            this.setChecked(!this.__V.Checkbox.checked);
        };
        
        jUI.Checkbox.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        jUI.Checkbox.prototype.setChecked = function(v){
            var V = this.__V.Checkbox, sh = this.__V._IconLabelComponent.shape;
            if(V.checked != v){
                V.checked = v;
                if(v){
                    sh.$(this.getCheckIcon());
                    this._appendToClassName("checked");
                }else{
                    sh.$(this._getClearIcon());
                    this._removeFromClassName("checked");
                }
                this._doEvent("check",v);
            }
        };
        jUI.Checkbox.prototype.setLabel = function(v){
            this._setText(v);
        };
        
        jUI.Checkbox.prototype._getClearIcon = function(){
            return app.resources.icons.paths.checkboxClear;
        };
        jUI.Checkbox.prototype.getCheckIcon = function(){
            return app.resources.icons.paths.checkbox;
        };
        
        jUI.Checkbox.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };
        jUI.Checkbox.prototype.getChecked = function(){
            return this.__V.Checkbox.checked;
        };
        jUI.Checkbox.prototype.getLabel = function(){
            return this._getText();
        };

        app.$(jUI.Checkbox.prototype.__props = app.clone(jUI.Checkbox.prototype.__props), {
            checked: "setChecked",
            readOnly: "setReadOnly",
            label: "setLabel"
        });
        
        jUI.Checkbox.prototype.__events = jUI.Checkbox.prototype.__events.clone().concat([
            "check"
        ]);
        
    })();
    
    // =================================================================================
    // Checkbox End
    // =================================================================================
    
    
    // =================================================================================
    // Radio Start 
    // =================================================================================
    
    /**
     * jUI.Radio
     * 
     * @extends jUI.Checkbox
     * 
     * @param {json} pa {<br>
     *      group: int <br>
     * }
     * @constructor
     */
    jUI.Radio = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui radio"
        }, false);
        jUI.Checkbox.call(this,newPa);
    };
    (function(){
        jUI.Radio.prototype = new jUI.Checkbox({__loading__: true});
        jUI.Radio.prototype.constructor = jUI.Radio;
        jUI.Radio._groups = {};
        
        // Overriden Function Start ===========================================
        
        jUI.Radio.prototype._initProp = function(pa){
            jUI.Checkbox.prototype._initProp.call(this, pa);
            this.__V.Radio = {
                group: null
            };
        };
        
        jUI.Radio.prototype._getClearIcon = function(){
            return app.resources.icons.paths.radioClear;
        };
        jUI.Radio.prototype.getCheckIcon = function(){
            return app.resources.icons.paths.radio;
        };
        jUI.Radio.prototype.setChecked = function(v){
            jUI.Checkbox.prototype.setChecked.call(this, v);
            var st = this.getChecked(), V = this.__V.Radio, grps = jUI.Radio._groups;
            if(!V.group) return;
            if(st && grps[V.group] !== this){
                grps[V.group] && grps[V.group].setChecked(false);
                grps[V.group] = this;
            }
            if(!st && grps[V.group] === this){
                grps[V.group] = null;
            }   
        };
        
        jUI.Radio.prototype.finalize = function(){
            var grps = jUI.Radio._groups, V = this.__V.Radio;
            V.group && grps[V.group] && (grps[V.group] = null);
            jUI.Checkbox.prototype.finalize.call(this);
        };
        // Overriden Function End ===========================================
        
        
        jUI.Radio.prototype.setGroup = function(v){
            var V = this.__V.Radio, grps = jUI.Radio._groups;
            if(V.group === v) return;
            V.group && grps[V.group] === this && (grps[V.group] = null);
            V.group = v;
            if(v && this.getChecked()){
                grps[v] && grps[v].setChecked(false);
                grps[v] = this;
            }
        };
        
        jUI.Radio.prototype.getGroup = function(){
            return this.__V.Radio.group;
        };

        app.$(jUI.Radio.prototype.__props = app.clone(jUI.Radio.prototype.__props), {
            group: "setGroup"
        });
        
        jUI.Radio.prototype.__events = jUI.Radio.prototype.__events.clone().concat([
        ]);
        
    })();
    
    // =================================================================================
    // Radio End
    // =================================================================================
    
    
    // =================================================================================
    // Select Start 
    // =================================================================================
    
    /**
     * jUI.Select
     * 
     * @extends jUI._IconLabelComponent
     * 
     * @param {json} pa {<br>
     *      listDataset: jUI.Dataset, <br>
     *      listField: String, <br>
     *      placeholder: String, <br>
     *      readOnly: boolean, <br>
     *      maxMenuHeight: int (default 200), <br>
     *      events:{ <br>
     *          select: function(index:int, KeyValue) <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.Select = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui select"
        }, false);
        jUI._IconLabelComponent.call(this,newPa);
    };
    (function(){
        jUI.Select.prototype = new jUI._IconLabelComponent({__loading__: true});
        jUI.Select.prototype.constructor = jUI.Select;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Select.prototype._initProp = function(pa){
            jUI._IconLabelComponent.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            var so = this;
            this.__V.Select = {
                listDataset: null,
                listField: null,
                win: null,
                list: null,
                maxMenuHeight: 200,
                placeholder: ""
            };
            el.onmousedown = function(e){
                if(so.__V.Select.win)
                    so.hideMenu.call(so);
                else
                    so.showMenu.call(so);
                
            };
            
            el.onkeyup = function(e){
                e.keyCode === 32 && so.toggle();
            };
            
            el.tabIndex = "1";
            this._appendToClassName("input");
            this._setIconPosition("right");
            this._setIcon(new jUI.Shape(app.resources.icons.paths.downArrow));
        };
        jUI.Select.prototype.finalize = function(){
            this.setListDataset(null);
            delete this.__V.Select.listDataset;
            jUI._IconLabelComponent.prototype.finalize.call(this);
        };
        jUI.Select.prototype.setValue = function(v){
            var V = this.__V.Select,lds = V.listDataset,txt = V.placeholder;
            jUI._IconLabelComponent.prototype.setValue.call(this, v);
            if(lds && v){
                if(lds.getKeyValue() === v){
                    txt = lds.f(V.listField);
                }else{
                    if(lds.locate(lds.getKeyField(),v)){
                        txt = lds.f(V.listField);
                    }
                }
                this._doEvent("select", lds.getPos(), lds.getKeyValue());
            }
            this._setText(txt);
        };
        jUI.Select.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField(),V = this.__V.Select;
            this.setValue(V.listDataset && V.listField && ds && df && ds.getMode() !== jUI.dsmAdd ? ds.f(df) : "");
            
        };
        
        
        jUI.Select.prototype._doDataChanged = function(dataset){
            var V = this.__V.Select;
            if(dataset === V.listDataset){
                this.setValue(V.listDataset.getKeyValue());
            }else{
                this._updateValue(dataset);
            }
        };
        
        // Overriden Function End ===========================================
        
        jUI.Select.prototype.showMenu = function(){
            var so = this, V = this.__V.Select;
            if(V.win) return;
            V.win = new jUI.Window({
                autoClose: true,
                autoFree: true,
                width: this.getWidth(),
                maxHeight: V.maxMenuHeight, 
                className: "jui selectmenu",
                events:{
                    click: function(){
                        V.win.close();
                        so.__V.el.focus();
                    },
                    close: function(){ 
                        V.win = V.list = null; 
                    }
                },
                children: [
                    V.list = new jUI.List({
                        parent: V.win,
                        width: "100%",
                        layout: jUI.Layout.ltFollowHor,
                        dataset: V.listDataset,
                        maxHeight: V.maxMenuHeight, 
                        autoSelect: true,
                        columns: [
                            new jUI.List.Column({dataField: V.listField})
                        ]
                    })
                ]
            });
            
            var coor = this.getAbsolutePosition();
            V.win.show(false, coor.x, coor.y+this.getHeight());
        };
        jUI.Select.prototype.hideMenu = function(){
            var V = this.__V.Select;
            V.win && V.win.close();
        };
        
        jUI.Select.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        jUI.Select.prototype.setPlaceholder = function(v){
            this.__V.Select.placeholder = v;
            this._updateValue(this.getDataset());
        };
        jUI.Select.prototype.setListDataset = function(v){
            var V = this.__V.Select;
            if(V.listDataset === v) return;
            V.listDataset && V.listDataset.removeDBComponent(this);
            V.listDataset = v;
            v && v.addDBComponent(this);
        };
        jUI.Select.prototype.setListField= function(v){
            this.__V.Select.listField = v;
        };
        jUI.Select.prototype.setMaxMenuHeight = function(v){
            this.__V.Select.maxMenuHeight = v;
        };
        
        jUI.Select.prototype.getPlaceholder = function(){
            return this.__V.Select.placeholder;
        };
        jUI.Select.prototype.getListDataset = function(){
            return this.__V.Select.listDataset;
        };
        jUI.Select.prototype.getListField = function(){
            return this.__V.Select.listField;
        };
        jUI.Select.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };
        jUI.Select.prototype.getMaxMenuHeight = function(){
            return this.__V.Select.maxMenuHeight;
        };

        app.$(jUI.Select.prototype.__props = app.clone(jUI.Select.prototype.__props), {
            placeholder: "setPlaceholder",
            readOnly: "setReadOnly",
            listDataset: "setListDataset",
            listField: "setListField",
            maxMenuHeight: "setMaxHeight"
        });
        
        jUI.Select.prototype.__events = jUI.Select.prototype.__events.clone().concat([
            "select"
        ]);
        
    })();
    
    // =================================================================================
    // Select End
    // =================================================================================
    
    
    // =================================================================================
    // ProgressBar Start 
    // =================================================================================
    
    /**
     * jUI.ProgressBar
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      percent: double, <br>
     *      orientation: jUI.orXXX (default jUI.porLeftRight), <br>
     *      events:{ <br>
     *          valueChange: function(int: val) <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.ProgressBar = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui progressbar",
            width: 100,
            height: 20,
            orientation: jUI.orLeftRight,
            percent: 0
        }, false);
        // Move the percent property to the end.
        var val = newPa.percent;
        delete newPa.percent;
        newPa.percent = val;
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.ProgressBar.prototype = new jUI.DBComponent({__loading__: true});
        jUI.ProgressBar.prototype.constructor = jUI.ProgressBar;
        
        
        // Overriden Function Start ===========================================
        
        jUI.ProgressBar.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            this.__V.ProgressBar = {
                orientation: null,
                orientationFunc: "Left",
                barCover: new jUI.Layout({
                    className: "jui cover",
                    anchor: {l:0,r:0,t:0,b:0},
                    visible: true,
                    parent: this
                })
            };
        };
        jUI.ProgressBar.prototype.setValue = function(v){
            v = +v;
            if((v || v ===0) && v >= 0 && v <= 100){
                jUI.DBComponent.prototype.setValue.call(this, v);
                this._rebuild();
            }
        };
        jUI.ProgressBar.prototype.getValue = function(){
            return jUI.DBComponent.prototype.getValue.call(this);
        };
        jUI.ProgressBar.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField();
            ds && df && this.setValue(ds.f(df)); 
        };
        
        // Overriden Function End ===========================================
        
        jUI.ProgressBar.prototype._rebuild = function(){
            var V = this.__V.ProgressBar;
            V.barCover["set"+V.orientationFunc](this.getValue()+"%");
        };
        
        jUI.ProgressBar.prototype.setOrientation = function(v){
            var V = this.__V.ProgressBar;
            V.orientation = v;
            V.barCover.setAnchor({l:0,t:0,b:0,r:0});
            switch(v){
                case jUI.orRightLeft:
                    V.orientationFunc = "Right";
                    break;
                case jUI.orTopBottom:
                    V.orientationFunc = "Top"; 
                    break;
                case jUI.orBottomTop:
                    V.orientationFunc = "Bottom"; 
                    break;
                default:
                    V.orientationFunc = "Left"; 
                    break;
            }
            this._rebuild();
        };
        jUI.ProgressBar.prototype.setPercent = function(v){
            this.setValue(v);
        };
        
        jUI.ProgressBar.prototype.getPercent = function(){
            return this.getValue();
        };
        jUI.ProgressBar.prototype.getOrientation = function(){
            var V = this.__V.ProgressBar;
            return V.orientation;
        };

        app.$(jUI.ProgressBar.prototype.__props = app.clone(jUI.ProgressBar.prototype.__props), {
            percent: "setPercent",
            orientation: "setOrientation"
        });
        
        jUI.ProgressBar.prototype.__events = jUI.ProgressBar.prototype.__events.clone().concat([
            "valueChange"
        ]);
        
    })();
    
    // =================================================================================
    // ProgressBar End
    // =================================================================================
    
    
    // =================================================================================
    // SlideBar Start 
    // =================================================================================
    
    /**
     * jUI.SlideBar
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      readOnly: boolean, <br>
     *      minVal: double, <br>
     *      maxVal: double, <br>
     *      delta: double | "auto" (defalt "auto"), <br>
     *      size: int (default 5), <br>
     *      orientation: jUI.orXXX (default jUI.porLeftRight), <br>
     *      events:{ <br>
     *          valueChange: function(int: newVal, int: oldVal) <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.SlideBar = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui slidebar",
            minVal: 0,
            maxVal: 100,
            delta: "auto",
            size: 5,
            width: 100,
            height: 20,
            orientation: jUI.orLeftRight,
            value: 0
        }, false);
        // Move the value property to the end.
        var val = newPa.value;
        delete newPa.value;
        newPa.value = val;
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.SlideBar.prototype = new jUI.DBComponent({__loading__: true});
        jUI.SlideBar.prototype.constructor = jUI.SlideBar;
        
        
        // Overriden Function Start ===========================================
        
        jUI.SlideBar.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            var so = this, bar, V,mouseStartPos, size = 10, half = size >> 1;
            V = this.__V.SlideBar = {
                orientation: null,
                orientationFunc: "Left",
                size: size,
                bar: bar = new jUI.Layout({
                    className: "jui bar",
                    anchor: {l:half,r:half,t:half,b:half},
                    visible: true,
                    parent: this,
                    _style: {
                        overflow: "visible"
                    }
                }),
                barCover: new jUI.Layout({
                    className: "jui cover",
                    anchor: {l:0,r:0,t:0,b:0},
                    visible: true,
                    parent: bar
                }),
                button: new jUI.Layout({
                    className: "jui slidebutton",
                    anchor: {l:-half,t:-half,b:-half},
                    width: size,
                    visible: true,
                    parent: bar,
                    events: {
                        dragStart: function(e){
                            if(so.getReadOnly()) return;
                            mouseStartPos = V.orientation&3? e.screenX : e.screenY;
                            document.body.style.cursor = "pointer";
                        },
                        drag: function(e){
                            if(so.getReadOnly()) return;
                            var pos = V.orientation&3? e.screenX : e.screenY;
                            var diff = pos - mouseStartPos;
                            (V.orientation&10) && (diff = -diff);
                            app.rtl && (V.orientation&3) && (diff = -diff);
                            var len = V.orientation&3? bar.getWidth() : bar.getHeight();
                            if(len){
                                var difPerc = diff / len;
                                var lenVal = V.maxVal - V.minVal;
                                var difVal = lenVal * difPerc;
                                var oldVal = so.getValue();
                                var oldBtnPos = V.button[V.orientation&3? "getLeft" : "getTop"]();
                                so.setValue(oldVal + difVal);
                                var newBtnPos = V.button[V.orientation&3? "getLeft" : "getTop"]();
                                var posDiff = newBtnPos - oldBtnPos;
                                app.rtl && (V.orientation&3) && (posDiff = -posDiff);
                                newBtnPos !== oldBtnPos && (mouseStartPos = mouseStartPos + posDiff);
                            }
                        },
                        dragStop: function(e){
                            if(so.getReadOnly()) return;
                            mouseStartPos = null;
                            document.body.style.cursor = null;
                        }
                    }
                }),
                minVal: undefined,
                maxVal: undefined,
                delta: undefined
            };
            
            el.tabIndex = "1";
            this._appendToClassName("input");
        };
        jUI.SlideBar.prototype.setValue = function(v){
            var oldVal = this.getValue();
            var newVal = this._rebuild(+v);
            jUI.DBComponent.prototype.setValue.call(this, newVal);
            oldVal !== newVal && this._doEvent("valueChange", newVal, oldVal);
        };
        jUI.SlideBar.prototype.getValue = function(){
            return jUI.DBComponent.prototype.getValue.call(this);
        };
        jUI.SlideBar.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField();
            ds && df && this.setValue(ds.f(df)); 
        };
        
        // Overriden Function End ===========================================
        
        jUI.SlideBar.prototype._rebuild = function(v){
            var V = this.__V.SlideBar;
            var bSize = V.size;
            v == undefined && (v = this.getValue());
            v > V.maxVal && (v = V.maxVal);
            v < V.minVal && (v = V.minVal);
            v = v || 0;
            var len = V.maxVal - V.minVal;
            if(V.delta && V.delta !== "auto"){
                var xDelta = ((v - V.minVal) / V.delta).toFixed(0);
                v = V.minVal + V.delta * xDelta;
            }
            var perc = ((v - V.minVal) / len) * 100;
            V.barCover["set"+V.orientationFunc](perc+"%");
            V.button["set"+V.orientationFunc]("calc("+perc+"% - "+(bSize >> 1)+"px)");
            return v;
        };
        
        jUI.SlideBar.prototype.setOrientation = function(v){
            var V = this.__V.SlideBar;
            V.orientation = v;
            V.barCover.setAnchor({l:0,t:0,b:0,r:0});
            V.button[v&3? "setWidth" : "setHeight"](V.size);
            V.button[v&3? "setHeight" : "setWidth"](undefined);
            var half = V.size >> 1;
            switch(v){
                case jUI.orRightLeft:
                    V.orientationFunc = "Right";
                    V.button.setAnchor({l:undefined,t:-half, b:-half});
                    break;
                case jUI.orTopBottom:
                    V.orientationFunc = "Top"; 
                    V.button.setAnchor({l:-half, r:-half, b:undefined});
                    break;
                case jUI.orBottomTop:
                    V.orientationFunc = "Bottom"; 
                    V.button.setAnchor({l:-half, r:-half, t:undefined});
                    break;
                default:
                    V.orientationFunc = "Left"; 
                    V.button.setAnchor({r:undefined,t:-half, b:-half});
                    break;
            }
            this._rebuild();
        };
        jUI.SlideBar.prototype.setMinVal = function(v){
            var V = this.__V.SlideBar;
            V.minVal = v;
            this._rebuild();
        };
        jUI.SlideBar.prototype.setMaxVal = function(v){
            var V = this.__V.SlideBar;
            V.maxVal = v;
            this._rebuild();
        };
        jUI.SlideBar.prototype.setDelta = function(v){
            var V = this.__V.SlideBar;
            V.delta = v;
            this._rebuild();
        };
        jUI.SlideBar.prototype.setSize = function(v){
            var V = this.__V.SlideBar;
            //V.bar.setHeight(v);
            //this._rebuild();
        };
        jUI.SlideBar.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        
        jUI.SlideBar.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };
        jUI.SlideBar.prototype.getMinVal = function(){
            return this.__V.SlideBar.minVal;
        };
        jUI.SlideBar.prototype.getMaxVal = function(){
            return this.__V.SlideBar.maxVal;
        };
        jUI.SlideBar.prototype.getDelta = function(){
            return this.__V.SlideBar.delta;
        };
        jUI.SlideBar.prototype.getSize = function(){
            return this.__V.SlideBar.var.getHeight();
        };

        app.$(jUI.SlideBar.prototype.__props = app.clone(jUI.SlideBar.prototype.__props), {
            readOnly: "setReadOnly",
            minVal: "setMinVal",
            maxVal: "setMaxVal",
            delta: "setDelta",
            size: "setSize",
            orientation: "setOrientation"
        });
        
        jUI.SlideBar.prototype.__events = jUI.SlideBar.prototype.__events.clone().concat([
            "valueChange"
        ]);
        
    })();
    
    // =================================================================================
    // SlideBar End
    // =================================================================================
    
    
    
    // =================================================================================
    // Select Start 
    // =================================================================================
    
    /**
     * jUI.DatetimePicker
     * 
     * @extends jUI._IconLabelComponent
     * 
     * @param {json} pa {<br>
     *      placeholder: String, <br>
     *      readOnly: boolean, <br>
     *      date: jUI.Date, <br>
     *      events:{ <br>
     *          select: function() <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.DatetimePicker = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui datetimepicker",
            date: new jUI.Date()
        }, false);
        jUI._IconLabelComponent.call(this,newPa);
    };
    (function(){
        jUI.DatetimePicker.prototype = new jUI._IconLabelComponent({__loading__: true});
	jUI.DatetimePicker.prototype.constructor = jUI.DatetimePicker;
        
        
        // Overriden Function Start ===========================================
        
        jUI.DatetimePicker.prototype._initProp = function(pa){
            jUI._IconLabelComponent.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            var so = this;
            this.__V.DatetimePicker = {
                win: null,
                tbl: null,
                monthsTbl: null,
                yearsTbl: null,
                date: new jUI.Date(),
                viewDate: new jUI.Date(),
                // possible values are "days", "months", or "years" 
                viewLevel: "days"
            };
            el.onmousedown = function(e){
                if(so.__V.DatetimePicker.win)
                    so.hideMenu.call(so);
                else
                    so.showMenu.call(so);
                
            };
            
            el.tabIndex = "1";
            this._appendToClassName("input");
            this._setIconPosition("right");
            this._setIcon(new jUI.Shape(app.resources.icons.paths.calendar));
        };
        jUI.DatetimePicker.prototype.setValue = function(v){
            var V = this.__V.DatetimePicker;
            jUI._IconLabelComponent.prototype.setValue.call(this, v);
            if(v){
                V.date.setDateFromStr(v);
            }else{
                V.date.updateToCurrDate();
            }
            this.setDate(V.date);
        };
        jUI.DatetimePicker.prototype.getValue = function(){
            return this.__V.DatetimePicker.date.toString("%Y-%M-%D");
        };
        jUI.DatetimePicker.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField();
            this.setValue(ds && df ? ds.f(df) : ""); 
        };
        
        // Overriden Function End ===========================================
        
        jUI.DatetimePicker.prototype._selectCell = function(){
            var so = this.juiObject, V = so.__V.DatetimePicker, val = this.val;
            switch(V.viewLevel){
                case "days":
                    V.date.setDateFrom(V.viewDate);
                    V.date.setDay(val);
                    so.setDate(V.date);
                    so._updateCalendar();
                    break;
                case "months":
                    V.viewDate.setMonth(val);
                    V.date.setMonth(val);
                    V.viewLevel = "days";
                    so.setDate(V.date);
                    so._initCalendar(false);
                    break;
                case "years":
                    V.viewDate.setYear(val);
                    V.date.setYear(val);
                    V.viewLevel = "months";
                    so.setDate(V.date);
                    so._initCalendar(false);
                    break;
            }
        };
        
        jUI.DatetimePicker.prototype._updateCalendar = function(){
            var V = this.__V.DatetimePicker, so = this;
            
            var dt = new jUI.Date(V.viewDate), dow = dt.getDayOfWeek() + 1, currDate = new jUI.Date();
            V.tbl.forEach(function(cell, i, j){
                switch(V.viewLevel){
                    case "days":
                        if(i === 0){
                            if(j===1){ 
                                cell.innerHTML = app.lang["month"+(dt.getMonth())+"f"] + " - " + dt.getYear();
                                cell.style.cursor = "pointer";
                                cell.onclick = function(){
                                    V.viewLevel = "months";
                                    so._initCalendar(false);
                                };
                            }
                        }else if(i === 1){
                            cell.innerHTML = app.lang["wday"+(j+1)+"s"];
                        }else {
                            var dom = (i-2) * 7 + j - dow,className = "currmonth";
                            dt.setDateFrom(V.viewDate);
                            dt.addDays(dom);
                            cell.innerHTML = dt.getDay();
                            cell.val = dt.getDay();

                            if(dt.equalsTruncatedTo(V.viewDate, "M")){
                                cell.onclick = so._selectCell;
                            }else{
                                cell.onclick = null;
                                className = "notcurrmonth";
                            }
                            dt.equalsTruncatedTo(currDate, "D") && (className += " today");
                            dt.equals(V.date) && (className += " selected");
                            cell.className = className;
                            cell.juiObject = so;
                        }
                        break;
                    case "months":
                        if(i === 0){
                            if(j===1){ 
                                cell.innerHTML = dt.getYear();
                                cell.style.cursor = "pointer";
                                cell.onclick = function(){
                                    V.viewLevel = "years";
                                    so._initCalendar(false);
                                };
                            }
                        }else {
                            var moy = (i-1) * 4 + j + 1, className = "currmonth";
                            dt.setDateFrom(V.viewDate);
                            dt.setMonth(moy);
                            cell.innerHTML = app.lang["month"+(moy)+"s"];
                            cell.val = moy;
                            cell.onclick = so._selectCell;
                            
                            dt.equalsTruncatedTo(currDate, "M") && (className += " today");
                            dt.equalsTruncatedTo(V.date, "M") && (className += " selected");
                            cell.className = className;
                            cell.juiObject = so;
                        }
                        break;
                    case "years":
                        if(i === 0){
                            if(j===1){ 
                                cell.innerHTML = dt.getYear();
                            }
                        }else {
                            var y = (i-1) * 4 + j, className = "currmonth";
                            dt.setDateFrom(V.viewDate);
                            dt.addYears(y);
                            cell.innerHTML = dt.getYear();
                            cell.val = dt.getYear();
                            cell.onclick = so._selectCell;
                            
                            dt.equalsTruncatedTo(currDate, "Y") && (className += " today");
                            dt.equalsTruncatedTo(V.date, "Y") && (className += " selected");
                            cell.className = className;
                            cell.juiObject = so;
                        }
                        break;
                }
            });
        };
        /**
         * @param {boolean} resetViewDate (default true)
         */
        jUI.DatetimePicker.prototype._initCalendar = function(resetViewDate){
            var V = this.__V.DatetimePicker, ic = app.resources.icons.paths,so = this;
            if(resetViewDate || resetViewDate === undefined){
                V.viewDate.setDateFrom(V.date);
                V.viewDate.truncate("M");
            }
            V.tbl && V.tbl.free();
            var tblStruct;
            if(V.viewLevel === "days"){
                tblStruct = [
                    {rows:1, cols:[1,5,1]},
                    {rows:7, cols:7}
                ];
            }else{
                tblStruct = [
                    {rows:1, cols:[1,2,1]},
                    {rows:3, cols:4}
                ];
            }
            
            V.tbl = new jUI.Table({
                layout: jUI.Layout.ltFollowVer,
                classModifier: "datetimepickertbl",
                structure: tblStruct,
                propsFor:[
                    {
                        row: 0,
                        col: 0,
                        children:[ 
                            new jUI.Shape(app.$({
                                events: {
                                    "click": function(){
                                        switch(V.viewLevel){
                                            case "days":
                                                V.viewDate.addMonths(-1);
                                                break;
                                            case "months":
                                                V.viewDate.addYears(-1);
                                                break;
                                            case "years":
                                                V.viewDate.addYears(-12);
                                                break;
                                        }
                                        so._updateCalendar();
                                    }
                                }
                            },app.rtl? ic.rightArrow : ic.leftArrow,true))
                        ]
                    },
                    {
                        row: 0,
                        col: 2,
                        children:[ 
                            new jUI.Shape(app.$({
                                layout: jUI.Layout.ltFollowHor,
                                align: ">",
                                events: {
                                    "click": function(){
                                        switch(V.viewLevel){
                                            case "days":
                                                V.viewDate.addMonths(1);
                                                break;
                                            case "months":
                                                V.viewDate.addYears(1);
                                                break;
                                            case "years":
                                                V.viewDate.addYears(12);
                                                break;
                                        }
                                        so._updateCalendar();
                                        so._updateCalendar();
                                    }
                                }
                            },app.rtl? ic.leftArrow : ic.rightArrow,true))
                        ]
                    }
                ],
                parent: V.win
            });
            this._updateCalendar();
        };
        
        jUI.DatetimePicker.prototype.showMenu = function(){
            var so = this, V = this.__V.DatetimePicker;
            if(V.win) return;
            V.win = new jUI.Window({
                autoClose: true,
                autoFree: true,
                className: "jui datetimepickermenu",
                events:{
                    close: function(){ 
                        V.win = V.tbl = null; 
                    }
                }
            });
            
            this._initCalendar();
            
            var selectChange = function(row, status){
                if(status){
                    so.setValue(V.listDataset.getKeyValue());
                    V.win.close();
                    so.__V.el.focus();
                }
            };
            
            var coor = this.getAbsolutePosition();
            V.win.show(false, coor.x, coor.y+this.getHeight());
        };
        jUI.DatetimePicker.prototype.hideMenu = function(){
            var V = this.__V.DatetimePicker;
            V.win && V.win.close();
        };
        
        jUI.DatetimePicker.prototype.setDate = function(v){
            var V = this.__V.DatetimePicker;
            if(v){
                V.date.setDateFrom(v);
            }else{
                V.date.updateToCurrDate();
            }
            this._setText(V.date.toString("%Y-%M-%D"));
        };
        jUI.DatetimePicker.prototype.setReadOnly = function(v){
            this.__V.el.readonly = v;
        };
        jUI.DatetimePicker.prototype.setPlaceholder = function(v){
            this._setText(v);
        };
        
        jUI.DatetimePicker.prototype.getPlaceholder = function(){
            return this._getText();
        };
        jUI.DatetimePicker.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };

        app.$(jUI.DatetimePicker.prototype.__props = app.clone(jUI.DatetimePicker.prototype.__props), {
            placeholder: "setPlaceholder",
            readOnly: "setReadOnly",
            date: "setDate"
        });
        
        jUI.DatetimePicker.prototype.__events = jUI.DatetimePicker.prototype.__events.clone().concat([
            "select"
        ]);
        
    })();
    
    // =================================================================================
    // Select End
    // =================================================================================
    
    
    // =================================================================================
    // Tree Start 
    // =================================================================================
    
    /**
     * jUI.Tree
     * 
     * @extends jUI.DBComponent
     * 
     * @param {json} pa {<br>
     *      nodes: [jUI.Tree.Node]
     *      events:{ <br>
     *          valueChange: function(int: newVal, int: oldVal) <br>
     *      } <br>
     * }
     * @constructor
     */
    jUI.Tree = function(pa){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui tree",
            width: 100,
            height: 200
        }, false);
        
        jUI.DBComponent.call(this,newPa);
    };
    (function(){
        jUI.Tree.prototype = new jUI.DBComponent({__loading__: true});
        jUI.Tree.prototype.constructor = jUI.Tree;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Tree.prototype._initProp = function(pa){
            jUI.DBComponent.prototype._initProp.call(this, pa);
            var el = this.__V.el;
            this.__V.Tree = {
                root: new jUI.Tree.Node({
                    parent: this,
                    expanded: true
                },true)
            };
            
            el.tabIndex = "1";
        };
        jUI.Tree.prototype.setValue = function(v){
            //jUI.DBComponent.prototype.setValue.call(this, newVal);
        };
        jUI.Tree.prototype.getValue = function(){
            //return jUI.DBComponent.prototype.getValue.call(this);
        };
        jUI.Tree.prototype._updateValue = function(dataset){
            var ds = this.getDataset(), df = this.getDataField();
            ds && df && this.setValue(ds.f(df)); 
        };
        
        // Overriden Function End ===========================================
        
        /**
         * @param {jUI.Tree.Node} node
         */
        jUI.Tree.prototype.addNode = function(node){
            var V = this.__V.Tree;
            V.root.addNode(node);
        };
        /**
         * @param {[jUI.Tree.Node]} nodes
         */
        jUI.Tree.prototype.addNodes = function(nodes){
            var V = this.__V.Tree;
            V.root.addNodes(nodes);
        };
        
        jUI.Tree.prototype.getReadOnly = function(){
            return this.__V.el.readonly;
        };

        app.$(jUI.Tree.prototype.__props = app.clone(jUI.Tree.prototype.__props), {
            nodes: "addNodes"
        });
        
        jUI.Tree.prototype.__events = jUI.Tree.prototype.__events.clone().concat([
            "valueChange"
        ]);
        
    })();
    
    
    /**
     * jUI.Tree.Node
     * 
     * @extends jUI.Layout
     * 
     * @param {json} pa {<br>
     *      nodes: [jUI.Tree.Node], <br>
     *      text: String, <br>
     *      checked: boolean, <br>
     *      chackable: boolean, <br>
     *      selected: boolean, <br>
     *      expanded: boolean <br>
     * }
     * @param {boolean} _isRoot Internal use only. Specifies whether this is a root node or not.
     * @constructor
     */
    jUI.Tree.Node = function(pa, _isRoot){
        if(pa && pa.__loading__) return;
        var newPa = app.$(app.clone(pa),{
            className: "jui treenode"
        }, false);
        
        newPa = app.$(newPa,{
            width: undefined,
            height: undefined,
            layout: jUI.ltFollowVer,
            visible: true
        }, true);
        
        jUI.Layout.call(this,newPa, _isRoot? null : document.createElement("li"));
    };
    (function(){
        jUI.Tree.Node.prototype = new jUI.Layout({__loading__: true});
        jUI.Tree.Node.prototype.constructor = jUI.Tree.Node;
        
        
        // Overriden Function Start ===========================================
        
        jUI.Tree.Node.prototype._initProp = function(pa){
            jUI.Layout.prototype._initProp.call(this, pa);
            var el = this.__V.el, lbl;
            this.__V.TreeNode = {
                nodes: [],
                label: lbl = new jUI._IconLabelComponent({
                    layout: jUI.ltFollowVer,
                    parent: this
                }),
                ul: null,
                checkShape: null,
                expanded: false
            };
            
            //el.tabIndex = "1";
            
            lbl._setIconPosition("left");
            lbl._setIcon(new jUI.Shape({width:16, height: 16}));
        };
	
        
        // Overriden Function End ===========================================
        
        /**
         * @param {jUI.Tree.Node} node
         */
        jUI.Tree.Node.prototype.addNode = function(node){
            var V = this.__V.TreeNode, ic = app.resources.icons.paths, so = this;
            if(node instanceof jUI.Tree.Node){
                V.nodes.push(node);
                if(V.nodes.length === 1){
                    V.label._getIcon().$(V.expanded? ic.downArrow2 : (app.rtl? ic.leftArrow2 : ic.rightArrow2));
                    V.label._getIcon().addEvent("click",function(){
                        so.setExpanded(!V.expanded);
                    });
                    V.ul = new jUI.Layout({
                        layout: jUI.ltFollowVer,
                        height: V.expanded? undefined : 0,
                        visible: V.expanded,
                        parent: this,
                        padding: {l:15,t:0,b:0,r:5}
                    }, document.createElement("ul"));
                }
                node.setParent(V.ul);
            }
        };
        /**
         * @param {[jUI.Tree.Node]} nodes
         */
        jUI.Tree.Node.prototype.addNodes = function(nodes){
            var so = this;
            nodes.forEach(function(n){so.addNode(n);});
        };
        /**
         * @param {jUI.Tree.Node} node
         */
        jUI.Tree.Node.prototype.removeNode = function(node){
            var V = this.__V.TreeNode;
            if(node instanceof jUI.Tree.Node){
                var i = V.nodes.remove(node);
                if(i !== -1){
                    
                }
            }
        };
        /**
         * @param {int} index
         */
        jUI.Tree.Node.prototype.deleteNode = function(index){
            var V = this.__V.TreeNode;
        };
        /**
         * @returns {boolean} st
         */
        jUI.Tree.Node.prototype.setExpanded = function(st){
            var V = this.__V.TreeNode, ic = app.resources.icons.paths;
            if(V.expanded !== st){
                V.expanded = st;
                V.ul && V.ul.$({
                    height: st? undefined : 0,
                    visible: st,
                });
                V.label._getIcon().$(st? ic.downArrow2 : (app.rtl? ic.leftArrow2 : ic.rightArrow2));
            }
        };
        /**
         * @returns {String} text
         */
        jUI.Tree.Node.prototype.setText = function(text){
            var V = this.__V.TreeNode;
            V.label._setText(text);
        };
        
        /**
         * @returns {jUI.Tree.Node}
         */
        jUI.Tree.Node.prototype.getFirst = function(){
            var V = this.__V.TreeNode;
        };
        /**
         * @returns {jUI.Tree.Node}
         */
        jUI.Tree.Node.prototype.getLast = function(){
            var V = this.__V.TreeNode;
        };
        /**
         * @param {jUI.Tree.Node} node
         * @returns {int} -1 if not existent.
         */
        jUI.Tree.Node.prototype.getIndexOf = function(node){
            var V = this.__V.TreeNode;
        };
        /**
         * @returns {[jUI.Tree.Node]} null if it has no children.
         */
        jUI.Tree.Node.prototype.getNodes = function(){
            var V = this.__V.TreeNode;
        };

        app.$(jUI.Tree.Node.prototype.__props = app.clone(jUI.Tree.Node.prototype.__props), {
            nodes: "addNodes",
            text: "setText",
            expanded: "setExpanded"
        });
        
        jUI.Tree.Node.prototype.__events = jUI.Tree.Node.prototype.__events.clone().concat([
            "valueChange"
        ]);
        
    })();
    
    // =================================================================================
    // Tree End
    // =================================================================================
    
    
})();