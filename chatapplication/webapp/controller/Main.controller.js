sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/models"
],
    function (Controller, Filter, FilterOperator, models) {
        "use strict";

        return Controller.extend("com.basf.yardmanagement.chatapp.chatapplication.controller.Main", {

            models: models,

            /**
             * Initializes the controller. Sets up the chat model and attaches route pattern matched event.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             * @async
             */
            onInit:async function () {

                // Set up the chat model               
                var aChats = await this.models.getChats();
                this.getView().setModel(aChats, "chats");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteMain").attachPatternMatched(this._onObjectMatched, this);

                var oSentMessagesModel = await this.models.getSentMessages();
                this.getOwnerComponent().setModel(oSentMessagesModel, "sentMessages");

                this._loadAndProcessData();

            },

            /**
             * Event handler for when the route pattern is matched.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             * @async
             */
            _onObjectMatched: async function(){
                await this._loadAndProcessData();
            },

             /**
             * Loads and processes data to find and update the latest messages for each chat.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             * @async
             */
            _loadAndProcessData: async function () {
                // Example data loading - replace with actual data fetch if needed
                var oReceivedMessagesModel = await this.models.getReceivedMessages(); // Mock function
                var oSentMessagesModel = this.getOwnerComponent().getModel("sentMessages"); // Mock function

                // Combine and find the latest message per contact
                this._getLatestMessages(oReceivedMessagesModel.getData(), oSentMessagesModel.getData());

            },

             /**
             * Finds the latest messages from received and sent messages and updates the chat model.
             * @param {Object[]} receivedMessages - Array of received message objects.
             * @param {Object[]} sentMessages - Array of sent message objects.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             */
            _getLatestMessages: function (receivedMessages, sentMessages) {
                var aChats = this.getView().getModel("chats").getData();

                var aAllMessages =  [...receivedMessages, ...sentMessages];

                aAllMessages.sort(function (a, b) {
                    // Custom date parsing to handle "DD/MM/YYYYTHH:mm"
                    var parseDate = function (dateString) {
                        var parts = dateString.split('T');
                        var dateParts = parts[0].split('/');
                        var timeParts = parts[1].split(':');
                        // Rearrange to "YYYY-MM-DDTHH:mm" format
                        return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`);
                    };

                    return parseDate(a.date) - parseDate(b.date);
                });

                var messageMap = aAllMessages.reduce((map, message) => {
                    // Initialize array if it doesn't exist
                    if (!map[message.phone]) {
                        map[message.phone] = [];
                    }
                    // Add message to the corresponding phone number key
                    map[message.phone].push(message);
                    return map;
                }, {});            

                var oLatestMessages = Object.keys(messageMap).reduce((latestMessages, phone) => {
                    var messages = messageMap[phone];
                    // The last message is the most recent one due to sorting
                    latestMessages[phone] = messages[messages.length - 1];
                    return latestMessages;
                }, {});


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

             /**
             * Event handler for the search field's liveChange event.
             * Applies a filter to the chat list based on the search query.
             * @param {sap.ui.base.Event} oEvent - The event object.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             */
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

            /**
             * Event handler for when a chat item is pressed.
             * Navigates to the chat detail view with the selected chat's data.
             * @param {sap.ui.base.Event} oEvent - The event object.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Main
             * @async
             */
            onChatPress: async function (oEvent) {

                // Get the selected item from the event
                var oItem = oEvent.getSource();

                // Get the binding context of the selected item
                var oContext = oItem.getBindingContext("chats");

                // Retrieve the phone number of the clicked chat item from the context
                var sPhone = oContext.getProperty("phone");
                var sName = oContext.getProperty("contactName");
                var sImage = oContext.getProperty("photo").replace("images/", "");

                // Perform navigation to the chat detail view, passing the filtered messages as parameters
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Chat", {
                    phone: sPhone, // Pass data as a JSON string
                    name: sName,
                    image: sImage
                });

            },

            
        });
    });
