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
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("chatsSet.json"); 
            return oMydata;
        },

        getReceivedMessages: async function(){
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("ReceivedMessages.json"); 
            return oMydata;
        },

        getSentMessages: async function(){
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("SentMessages.json"); 
            return oMydata;
        },
    };

});