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
                var oChatModel = this.createChatModel();
                this.getView().setModel(oChatModel, "chats");
                var aChats = await this.models.getChats();

                this._loadAndProcessData();

            },


            // Sample JSON data for received messages
            _receivedMessages: [
                { "id": "10KSUGF873", "date": "26/01/2022T12:00", "text": "Ey! fine! and you?", "phone": "649120010" },
                { "id": "347TIDGBLASD", "date": "26/01/2022T12:02", "text": "not much! how are you?", "phone": "649120010" },
                { "id": "9THAEOIUH438", "date": "26/01/2022T12:03", "text": "always!", "phone": "649120010" },
                { "id": "834TDAUYOYWE", "date": "26/01/2022T12:05", "text": "perfect! see you there!", "phone": "649120010" },
                { "id": "3946THISBGSEW", "text": "That chocolate cake was insane!", "phone": "649120011", "date": "18/12/2021T15:00" },
                { "id": "1E9RTP94FQWXG", "text": "Hi! how are you?", "date": "20/01/2022T12:00", "phone": "649120010" },
                { "id": "2ETG34TDSGAT", "text": "is there a network issue?", "date": "20/01/2022T16:00", "phone": "649120010" },
                { "id": "YTGU56UTRH", "text": "did you received any of my texts?", "date": "20/01/2022T16:00", "phone": "649120010" },
                { "id": "568UDJFCX", "text": "hello?", "date": "20/01/2022T16:00", "phone": "649120010" },
                { "id": "47YRTHXDFGBX", "text": "come on...", "date": "20/01/2022T16:01", "phone": "649120010" },
                { "id": "6URHFNGC", "text": "hi.......", "date": "20/01/2022T16:02", "phone": "649120010" },
                { "id": "RTHBGCBXTDFH", "text": "?????", "date": "20/01/2022T16:02", "phone": "649120010" },
                { "phone": "649120012", "text": "Hi Ben! ", "date": "26/01/2022T12:00", "id": "PIOBGPIDSBRGP" },
                { "phone": "649120012", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin venenatis tincidunt lacus sed placerat. Morbi volutpat justo vel sagittis volutpat. Nunc bibendum tempus sagittis. Morbi consequat eu magna luctus vestibulum. Nam dapibus elit vulputate mi cursus, ac pretium ipsum feugiat. Praesent pharetra sem a nibh tristique efficitur. Sed vulputate at sapien eget mollis.", "date": "30/01/2022T12:03", "id": "IFBVLAGSDFGSDGFF" },
                { "phone": "649120012", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin venenatis tincidunt lacus sed placerat. Morbi volutpat justo vel sagittis volutpat. Nunc bibendum tempus sagittis. Morbi consequat eu magna luctus vestibulum. Nam dapibus elit vulputate mi cursus, ac pretium ipsum feugiat. Praesent pharetra sem a nibh tristique efficitur. Sed vulputate at sapien eget mollis.", "date": "30/01/2022T12:04", "id": "DSFGSDFGSDGF" },
                { "phone": "649120012", "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin venenatis tincidunt lacus sed placerat. Morbi volutpat justo vel sagittis volutpat. Nunc bibendum tempus sagittis. Morbi consequat eu magna luctus vestibulum. Nam dapibus elit vulputate mi cursus, ac pretium ipsum feugiat. Praesent pharetra sem a nibh tristique efficitur. Sed vulputate at sapien eget mollis.", "date": "30/01/2022T12:04", "id": "SDFGSDFGFGSDFG" }
            ],

            // Sample JSON data for sent messages
            _sentMessages: [
                { "id": "HAPISTRHQ3BSD", "text": "what's up?", "phone": "649120010", "date": "26/01/2022T12:00", "sent": true, "delivered": true, "read": true },
                { "id": "OUBTERYBGUFVHX", "text": "I'm fine!", "phone": "649120010", "date": "26/01/2022T12:02", "sent": true, "delivered": true, "read": true },
                { "id": "34IUZDGFSDFG", "text": "wanna hang out?", "phone": "649120010", "date": "26/01/2022T12:03", "sent": true, "delivered": true, "read": true },
                { "id": "FESZDVADSGF", "text": "7pm at the bar?", "phone": "649120010", "date": "26/01/2022T12:08", "sent": true, "read": true, "delivered": true },
                { "id": "SG34TGSDXG", "text": "See you there!", "phone": "649120010", "date": "26/01/2022T12:09", "sent": true, "read": false, "delivered": false },
                { "text": "Yes!!", "read": true, "delivered": true, "sent": true, "date": "26/01/2022T12:03", "phone": "649120012", "id": "ABGZ46934FDN" },
                { "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin venenatis tincidunt lacus sed placerat. Morbi volutpat justo vel sagittis volutpat. Nunc bibendum tempus sagittis. Morbi consequat eu magna luctus vestibulum. Nam dapibus elit vulputate mi cursus, ac pretium ipsum feugiat. Praesent pharetra sem a nibh tristique efficitur. Sed vulputate at sapien eget mollis.", "sent": true, "delivered": true, "read": true, "date": "26/01/2022T12:04", "phone": "649120012", "id": "ODIHYP985HEYT" },
                { "text": "See you there!", "read": true, "delivered": true, "sent": true, "date": "30/01/2022T12:04", "phone": "649120012", "id": "E9S8TGHDIUG" },
                { "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin venenatis tincidunt lacus sed placerat. Morbi volutpat justo vel sagittis volutpat. Nunc bibendum tempus sagittis. Morbi consequat eu magna luctus vestibulum. Nam dapibus elit vulputate mi cursus, ac pretium ipsum feugiat. Praesent pharetra sem a nibh tristique efficitur. Sed vulputate at sapien eget mollis.", "delivered": true, "sent": true, "date": "30/01/2022T12:04", "phone": "649120012", "id": "HYU54HYI4545" }
            ],

            _getReceivedMessages: function () {
                return this._receivedMessages;
            },

            _getSentMessages: function () {
                return this._sentMessages;
            },

            _loadAndProcessData: function () {
                // Example data loading - replace with actual data fetch if needed
                var oReceivedMessages = this._getReceivedMessages(); // Mock function
                var oSentMessages = this._getSentMessages(); // Mock function

                // Combine and find the latest message per contact
                this._getLatestMessages(oReceivedMessages, oSentMessages);
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

            createChatModel: function () {
                var oChatModel = new JSONModel([
                    {
                        "phone": "649120010",
                        "contactName": "Mike",
                        "photo": "images/miguel.jpg"
                    },
                    {
                        "phone": "649120011",
                        "contactName": "Yalan",
                        "photo": "images/yalan.jpg"
                    },
                    {
                        "phone": "649120012",
                        "contactName": "Emilio",
                        "photo": "images/john.jpg"
                    },
                    {
                        "phone": "649120013",
                        "contactName": "Sergio",
                        "photo": "images/joseph.jpg"
                    },
                    {
                        "phone": "649120014",
                        "contactName": "Luise",
                        "photo": "images/jane.jpg"
                    },
                    {
                        "phone": "649120015",
                        "contactName": "Lizzy",
                        "photo": "images/naomi.jpg"
                    },
                    {
                        "phone": "649120016",
                        "contactName": "Kyra",
                        "photo": "images/nora.jpg"
                    },
                    {
                        "phone": "649120017",
                        "contactName": "Pablo",
                        "photo": "images/sharon.jpg"
                    }
                ]);
                return oChatModel;
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

            onChatPress: function (oEvent) {

                var oReceivedMessages = this._getReceivedMessages(); // Mock function
                var oSentMessages = this._getSentMessages(); // Mock function

                // Get the selected item from the event
                var oItem = oEvent.getSource();

                // Get the binding context of the selected item
                var oContext = oItem.getBindingContext("chats");

                // Retrieve the phone number of the clicked chat item from the context
                var sPhone = oContext.getProperty("phone");

                // Filter the received messages by phone number
                var aFilteredReceivedMessages = oReceivedMessages.filter(function (message) {
                    return message.phone === sPhone;
                });

                // Filter the sent messages by phone number
                var aFilteredSentMessages = oSentMessages.filter(function (message) {
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
