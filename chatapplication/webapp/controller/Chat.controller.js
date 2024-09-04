sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "../model/models"
],
    function (Controller, JSONModel, formatter, models) {
        "use strict";

        return Controller.extend("com.basf.yardmanagement.chatapp.chatapplication.controller.Chat", {
            
            formatter: formatter,
            models: models,

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Chat").attachPatternMatched(this._onObjectMatched, this);

                this._scrollToLastItem();
            },

            _onObjectMatched: async function (oEvent) {
                var sPhone = oEvent.getParameter("arguments").phone;

                var oReceivedMessages = await this.models.getReceivedMessages(); // Mock function
                var oSentMessages = await this.models.getSentMessages(); // Mock function

                // Filter the received messages by phone number
                var aFilteredReceivedMessages = oReceivedMessages.getData().map(message => ({ ...message, flag: 'R' })).filter(function (message) {
                    return message.phone === sPhone;
                });

                // Filter the sent messages by phone number
                var aFilteredSentMessages = oSentMessages.getData().map(message => ({ ...message, flag: 'S' })).filter(function (message) {
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

                    // Add 'check' property based on sent and read properties
                    if (message.sent) {
                        if (message.read) {
                            message.check = 'R'; // Sent and read
                        } else {
                            message.check = 'G'; // Sent but not read
                        }
                    }else{
                        message.check = '';
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
                    date: new Date().toLocaleString().replace(/:\d{2}$/, ''),  // Example date format
                    flag: "S",  // Assuming "S" for sent messages
                    phone: sPhone,
                    sent: true,
                    delivered: true,
                    read: false,
                    check: 'G'
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
