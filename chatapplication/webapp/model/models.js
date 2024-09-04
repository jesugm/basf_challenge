sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        
        
        getChats: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("chatsSet.json"); 
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },

        getReceivedMessages: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("ReceivedMessagesSet.json"); 
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },

        getSentMessages: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("SentMessagesSet.json");             
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },
    };

});