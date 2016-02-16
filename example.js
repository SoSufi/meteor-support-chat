Meteor.startup(function(){

        SupportChat.config({
            emailNotifications: true,
            emailSender: "SupportChat@yourserver.domain",
            emailTopic: "Support request",
            emailBody: "Chat request on Your Server",
            strings: {"supportIsAvailable": "I am overriding the text for supportIsAvailable"}
        });

});
