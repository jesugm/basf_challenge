sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/models"
],
    function (Controller, JSONModel, Filter, FilterOperator, models) {
        "use strict";

        return Controller.extend("com.basf.yardmanagement.chatapp.chatapplication.controller.Main", {

            models: models,

            onInit:async function () {

                // Set up the chat model               
                var aChats = await this.models.getChats();
                this.getView().setModel(aChats, "chats");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteMain").attachPatternMatched(this._onObjectMatched, this);

                this._loadAndProcessData();

            },

            // _onObjectMatched: async function(){
            //     await this._loadAndProcessData();
            // },

            _loadAndProcessData: async function () {
                // Example data loading - replace with actual data fetch if needed
                var oReceivedMessagesModel = await this.models.getReceivedMessages(); // Mock function
                var oSentMessagesModel = await this.models.getSentMessages(); // Mock function

                // Combine and find the latest message per contact
                this._getLatestMessages(oReceivedMessagesModel.getData(), oSentMessagesModel.getData());
            },


            _getLatestMessages: function (receivedMessages, sentMessages) {
                var oLatestMessages = {};
                var aChats = this.getView().getModel("chats").getData();

                // Combine messages into a single object
                [...receivedMessages, ...sentMessages].forEach(function (message) {
                    var sPhone = message.phone;
                    if (!oLatestMessages[sPhone] || new Date(message.date) > new Date(oLatestMessages[sPhone].date)) {
                        oLatestMessages[sPhone] = message;
                    }
                });

                aChats.forEach(chat => {
                    if (oLatestMessages[chat.phone]) {
                        chat.lastMessage = oLatestMessages[chat.phone];
                    } else {
                        chat.lastMessage = "";
                    }
                });

                // Create a new JSONModel with the updated chat data
                var oModel = new sap.ui.model.json.JSONModel(aChats);

                // Set the new model to the view
                this.getView().setModel(oModel, "chats");
            },

            onSearch: function (oEvent) {
                // Get the search query
                var sQuery = oEvent.getParameter("newValue");

                // Get the List control
                var oList = this.byId("chatsList"); // Make sure to give an ID to your List

                // Get the binding of the List
                var oBinding = oList.getBinding("items");

                // Create a filter
                var oFilter = new Filter({
                    path: "contactName",
                    operator: FilterOperator.Contains,
                    value1: sQuery
                });

                // Apply the filter to the List
                oBinding.filter([oFilter]);
            },

            onChatPress: async function (oEvent) {

                var oReceivedMessages = await this.models.getReceivedMessages(); // Mock function
                var oSentMessages = await this.models.getSentMessages(); // Mock function

                // Get the selected item from the event
                var oItem = oEvent.getSource();

                // Get the binding context of the selected item
                var oContext = oItem.getBindingContext("chats");

                // Retrieve the phone number of the clicked chat item from the context
                var sPhone = oContext.getProperty("phone");

                // Filter the received messages by phone number
                var aFilteredReceivedMessages = oReceivedMessages.getData().filter(function (message) {
                    return message.phone === sPhone;
                });

                // Filter the sent messages by phone number
                var aFilteredSentMessages = oSentMessages.getData().filter(function (message) {
                    return message.phone === sPhone;
                });

                // Define the data to pass to the next view
                var oData = {
                    receivedMessages: aFilteredReceivedMessages,
                    sentMessages: aFilteredSentMessages
                };

                // Perform navigation to the chat detail view, passing the filtered messages as parameters
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Chat", {
                    phone: sPhone, // Pass data as a JSON string
                    receivedMessages: oData.receivedMessages,
                    sentMessages: oData.sentMessages
                });

            }
        });
    });
