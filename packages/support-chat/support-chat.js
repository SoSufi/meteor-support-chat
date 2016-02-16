// Write your package code here!
SupportChatMessages = new Mongo.Collection("supportchatmessages");
SupportChatChannels = new Mongo.Collection("supportchatchannels");

var strings = {};
strings['headingInChatWith'] = "In chat with";
strings['headingRequestSupport'] = "Request support";
strings['buttonRequestSupport'] = "Request support";
strings['labelYourName'] = "Your name";
strings['buttonSetHandle'] = "Set your chat handle";
strings['labelYourTopic'] = "Your problem";
strings['labelYourMessage'] = "Message";
strings['sendMessage'] = "Send";
strings['labelName'] = "Name";
strings['err_enterYourName'] = "Please enter your name";
strings['buttonCloseSupport'] = "Close chat";
strings['exitMessage_client'] = "Client has left the chat";
strings['exitMessage_supporter'] = "Supporter has left the chat";
strings['waitingForSupport'] = "Waiting for support";
strings['entranceMessage_supporter'] = " has entered the chat";
strings['acceptChat'] = "Accept chat";
strings['openChat'] = "Open chat";
strings['supportIsNotAvailable'] = "Currently no live support available";
strings['supportIsAvailable'] = "Live support available";
strings['pingSupporters_do'] = "Alert offline supporters";
strings['pingSupporters_done'] = "Offline supporters alerted. There is no guarantee anyone will respond";

SupportChat = {
    settings: {
        emailNotifications: true,
        emailSender: "SupportChat",
        emailTopic: "Support request",
        emailBody: "Chat request on Your Server",
        strings: strings
    },
    config: function (configObj) {
        var self = this;
        if (_.isObject(configObj)) {
            for(var item in configObj){
                if(item === "strings"){
                    for(var s in configObj[item]){
                        self.settings.strings[s] = configObj[item][s];
                    }
                }
                else{
                    self.settings = _.extend(self.settings, configObj);
                }
            }
        } else {
            throw new Meteor.Error(400, 'Config must be an object!');
        }
    }
};
/*
var schemaChannels = {
    _id: {
        type: String
    },
    clientHandle: {
        type: String
    },
    clientId: {
        type: String
    },
    clientIpAddress:{
        type: String
    },
    supporterHandle: {
        type: String
    },
    supporterId: {
        type: String
    },
    supporterIpAddress:{
        type: String
    },
    created: {
        type: Date
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    closedBy:{
        type: String
    }
};


var schemaMessages = {
    _id: {
        type: String
    },
    channel:{
        type: String
    },
    from: {
        type: String
    },
    timestamp: {
        type: Date
    },
    message: {
        type: Date
    },
    isSupporter:{
        type: Boolean
    }

};
*/