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


            /**
             * Initializes the controller. Sets up the router and model.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             */
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Chat").attachPatternMatched(this._onObjectMatched, this);

                this.getView().setModel(new JSONModel(), "viewModel");

                
            },
            
            /**
             * Event handler for when the route pattern is matched.
             * @param {sap.ui.base.Event} oEvent - The route matched event.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             * @async
             */
            _onObjectMatched: async function (oEvent) {
                var sPhone = oEvent.getParameter("arguments").phone;
                var sName = oEvent.getParameter("arguments").name;
                var sImage = oEvent.getParameter("arguments").image;

                var oView = this.getView();
                var oModel = oView.getModel("viewModel");

                oModel.setProperty("/currentName", sName);
                oModel.setProperty("/image", "images/" + sImage);

                var oReceivedMessages = await this.models.getReceivedMessages(); // Mock function
                var oSentMessages = this.getOwnerComponent().getModel("sentMessages"); // Mock function

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

                //Use a timeout to ensure the view is rendered
                setTimeout(() => {
                    this._scrollToLastItem();
                }, 475);  // Adjust the timeout as needed               
            },

            /**
             * Event handler for the Send button press.
             * Retrieves the input value, creates a new message, and updates the models.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             */
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

                var date = new Date();
                var customDateStr = this.formatCustomDate(date);
    
                // Create a new message object
                var oNewMessage = {
                    text: sMessage,
                    date: customDateStr,
                    flag: "S",  // Assuming "S" for sent messages
                    phone: sPhone,
                    sent: true,
                    delivered: true,
                    read: false,
                    check: 'G' //we assume that the message is sent but not read
                };
    
                // Add the new message to the model
                aMessages.push(oNewMessage);
                aMessages = this.processMessages(aMessages);
                oModel.setProperty("/", aMessages);
                var aGlobalSentMessages = this.getOwnerComponent().getModel("sentMessages").getData();
                aGlobalSentMessages.push(oNewMessage);
                // We use owner component in this case to make the sent messages persist in the app, in a real world application we would make a oData call to save the message.
                this.getOwnerComponent().getModel("sentMessages").setData(aGlobalSentMessages);
    
                // Clear the input field
                oInput.setValue("");

                this._scrollToLastItem();
            },

            /**
             * Scrolls to the last item in the chat list.
             * @async
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             */
            _scrollToLastItem: async function () {
                var oList = this.byId("chatList");  // Get the list control
                var iLastItemIndex = oList.getItems().length - 1;  // Get the index of the last item
    
                // Scroll to the last item using scrollToIndex method
                if (iLastItemIndex >= 0) {
                    await oList.scrollToIndex(iLastItemIndex);
                }
            },

            /**
             * Formats the given date into a custom string format.
             * @param {Date} date - The date to format.
             * @returns {string} The formatted date string in "DD/MM/YYYYTHH:mm" format.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             */
            formatCustomDate: function(date) {
                // Extract day, month, year, hours, and minutes
                var day = date.getDate().toString().padStart(2, '0');
                var month = (date.getMonth() + 1).toString().padStart(2, '0');
                var year = date.getFullYear();
                var hours = date.getHours().toString().padStart(2, '0');
                var minutes = date.getMinutes().toString().padStart(2, '0');
            
                // Construct the custom format string
                return `${day}/${month}/${year}T${hours}:${minutes}`;
            },

            /**
             * Processes messages to determine the visibility of the date and the 'check' property.
             * @param {Object[]} aMessages - Array of message objects to process.
             * @returns {Object[]} The processed array of message objects.
             * @memberof com.basf.yardmanagement.chatapp.chatapplication.controller.Chat
             */
            processMessages: function (aMessages) {
                // Ensure the array is not empty
                if (!aMessages || aMessages.length === 0) {
                    return;
                }
            
                aMessages.forEach((message, index) => {
                    // Determine whether to show the date
                    if (index === 0) {
                        message.showDate = true; // Show the date for the first message
                    } else {
                        var previousMessage = aMessages[index - 1];
                        // Show the date if different from the previous message
                        message.showDate = message.date !== previousMessage.date;
                    }
            
                    // Add 'check' property based on sent and read properties
                    if (message.sent) {
                        if (message.read) {
                            message.check = 'R'; // Sent and read
                        } else {
                            message.check = 'G'; // Sent but not read
                        }
                    } else {
                        message.check = ''; // Not sent
                    }
                });

                return aMessages;
            }
        });
    });
