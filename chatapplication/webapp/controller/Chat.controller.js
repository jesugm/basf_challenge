sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter"
],
    function (Controller, JSONModel, Filter, FilterOperator, formatter) {
        "use strict";

        return Controller.extend("com.basf.yardmanagement.chatapp.chatapplication.controller.Chat", {
            
            formatter: formatter,

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Chat").attachPatternMatched(this._onObjectMatched, this);

                this._scrollToLastItem();
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
                return this._receivedMessages.map(message => ({ ...message, flag: 'R' }));;
            },

            _getSentMessages: function () {
                return this._sentMessages.map(message => ({ ...message, flag: 'S' }));;
            },


            _onObjectMatched: function (oEvent) {
                var sPhone = oEvent.getParameter("arguments").phone;

                var oReceivedMessages = this._getReceivedMessages(); // Mock function
                var oSentMessages = this._getSentMessages(); // Mock function

                // Filter the received messages by phone number
                var aFilteredReceivedMessages = oReceivedMessages.filter(function (message) {
                    return message.phone === sPhone;
                });

                // Filter the sent messages by phone number
                var aFilteredSentMessages = oSentMessages.filter(function (message) {
                    return message.phone === sPhone;
                });

                // Use sPhone and oData to display the relevant messages
                console.log("Phone: ", sPhone);
                console.log("Received Messages: ", aFilteredReceivedMessages);
                console.log("Sent Messages: ", aFilteredSentMessages);

                // Combine and sort messages by date
                var aAllMessages = aFilteredReceivedMessages.concat(aFilteredSentMessages);
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

                 // Add a flag to control the visibility of the date
                aAllMessages.forEach((message, index) => {
                    if (index === 0) {
                        message.showDate = true; // Show the date for the first message
                    } else {
                        var previousMessage = aAllMessages[index - 1];
                        // Compare dates; show the date if different from the previous message
                        message.showDate = message.date !== previousMessage.date;
                    }
                });

                // Create a JSON model with the combined messages
                var oChatModel = new JSONModel(aAllMessages);
                this.getView().setModel(oChatModel, "chat");
                
            },

            onSendPress: function () {
                // Retrieve input value
                var oInput = this.byId("messageInput");
                var sMessage = oInput.getValue().trim();
                
                // Basic validation
                if (!sMessage) {
                    sap.m.MessageToast.show("Please enter a message.");
                    return;
                }
                
                // Retrieve chat model
                var oModel = this.getView().getModel("chat");
                var aMessages = oModel.getProperty("/");

                var sPhone = aMessages[0] ? aMessages[0].phone : "";
    
                // Create a new message object
                var oNewMessage = {
                    text: sMessage,
                    date: new Date().toLocaleString(),  // Example date format
                    flag: "S",  // Assuming "S" for sent messages
                    phone: sPhone,
                    sent: true,
                    delivered: true,
                    read: false
                };
    
                // Add the new message to the model
                aMessages.push(oNewMessage);
                oModel.setProperty("/", aMessages);
    
                // Clear the input field
                oInput.setValue("");

                this._scrollToLastItem();
            },

            _scrollToLastItem: async function () {
                var oList = this.byId("chatList");  // Get the list control
                var iLastItemIndex = oList.getItems().length - 1;  // Get the index of the last item
    
                // Scroll to the last item using scrollToIndex method
                if (iLastItemIndex >= 0) {
                    await oList.scrollToIndex(iLastItemIndex);
                }
            }
        });
    });
