// Write your package code here!
SupportChatMessages = new Mongo.Collection("supportchatmessages");
SupportChatChannels = new Mongo.Collection("supportchatchannels");

var strings = {
    'headingInChatWith' : "In chat with",
    'headingRequestSupport' : "Request support" ,
    'buttonRequestSupport' : "Request support" ,
    'labelYourName' : "Your name" ,
    'buttonSetHandle' : "Set your chat handle" ,
    'labelYourTopic' : "Your problem" ,
    'labelYourMessage' : "Message" ,
    'sendMessage' : "Send" ,
    'labelName' : "Name" ,
    'err_enterYourName' : "Please enter your name" ,
    'buttonCloseSupport' : "Close chat" ,
    'exitMessage_client' : "Client has left the chat" ,
    'exitMessage_supporter' : "Supporter has left the chat" ,
    'waitingForSupport' : "Waiting for support" ,
    'entranceMessage_supporter' : " has entered the chat" ,
    'acceptChat' : "Accept chat" ,
    'openChat' : "Open chat" ,
    'supportIsNotAvailable' : "Currently no live support available" ,
    'supportIsAvailable' : "Live support available" ,
    'pingSupporters_do' : "Alert offline supporters" ,
    'pingSupporters_done' : "Offline supporters alerted. There is no guarantee anyone will respond"
};

SupportChat = {
    settings: {
        emailNotifications: true,
        emailSender: "SupportChat",
        emailTopic: "Support request",
        emailBody: "Chat request on Your Server",
        strings: {
            'headingInChatWith' : "In chat with",
            'headingRequestSupport' : "Request support" ,
            'buttonRequestSupport' : "Request support" ,
            'labelYourName' : "Your name" ,
            'buttonSetHandle' : "Set your chat handle" ,
            'labelYourTopic' : "Your problem" ,
            'labelYourMessage' : "Message" ,
            'sendMessage' : "Send" ,
            'labelName' : "Name" ,
            'err_enterYourName' : "Please enter your name" ,
            'buttonCloseSupport' : "Close chat" ,
            'exitMessage_client' : "Client has left the chat" ,
            'exitMessage_supporter' : "Supporter has left the chat" ,
            'waitingForSupport' : "Waiting for support" ,
            'entranceMessage_supporter' : " has entered the chat" ,
            'acceptChat' : "Accept chat" ,
            'openChat' : "Open chat" ,
            'supportIsNotAvailable' : "Currently no live support available" ,
            'supportIsAvailable' : "Live support available" ,
            'pingSupporters_do' : "Alert offline supporters" ,
            'pingSupporters_done' : "Offline supporters alerted. There is no guarantee anyone will respond"
        }
    },
    config: function (configObj) {
        var self = this;
        if (_.isObject(configObj)) {
            for(var item in configObj){
                if(configObj.hasOwnProperty(item)){
                    if(item === "strings"){

                        for(var s in configObj[item]){

                            self.settings['strings'][s] = configObj[item][s];

                        }

                    }
                    else{
                        self.settings[item] =  configObj[item];
                    }
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