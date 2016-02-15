// Write your package code here!
SupportChatMessages = new Mongo.Collection("supportchatmessages");
SupportChatChannels = new Mongo.Collection("supportchatchannels");

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