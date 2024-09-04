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

        
        /**
         * Fetches the chat data from a JSON file and returns it as a JSONModel. Simulates real world oData call.
         * Shows a busy indicator while data is loading and hides it once the data is loaded.
         * @async
         * @returns {Promise<sap.ui.model.json.JSONModel>} - A promise that resolves to the chat data model.
         * @memberof com.basf.yardmanagement.chatapp.chatapplication.model
         */
        getChats: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("chatsSet.json"); 
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },

        /**
         * Fetches the received messages from a JSON file and returns them as a JSONModel.  Simulates real world oData call.
         * Shows a busy indicator while data is loading and hides it once the data is loaded.
         * @async
         * @returns {Promise<sap.ui.model.json.JSONModel>} - A promise that resolves to the received messages model.
         * @memberof com.basf.yardmanagement.chatapp.chatapplication.model
         */
        getReceivedMessages: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("ReceivedMessagesSet.json"); 
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },

        
        /**
         * Fetches the sent messages from a JSON file and returns them as a JSONModel.  Simulates real world oData call.
         * Shows a busy indicator while data is loading and hides it once the data is loaded.
         * @async
         * @returns {Promise<sap.ui.model.json.JSONModel>} - A promise that resolves to the received messages model.
         * @memberof com.basf.yardmanagement.chatapp.chatapplication.model
         */
        getSentMessages: async function(){
            sap.ui.core.BusyIndicator.show();
            var oMydata = new sap.ui.model.json.JSONModel(); 
            await oMydata.loadData("SentMessagesSet.json");             
            sap.ui.core.BusyIndicator.hide();
            return oMydata;
        },
    };

});