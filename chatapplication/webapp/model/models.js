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

        
        createChatModel: function () {
            var oChatModel = new JSONModel();
            oChatModel.loadData("model/chatSet.json"); // Load the JSON file
            return oChatModel;
        }
    };

});