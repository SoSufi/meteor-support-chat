Meteor.startup(function () {


    smtp = {
        username: 'info@telkey.com',
        password: 'telkeym4a',
        server: 'smtp.gmail.com',
        port: 587
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

Meteor.publish("supportChatMessages",function(channel){
    return SupportChatMessages.find({channel: channel}, {sort:{timestamp:1}, limit:20});
});

Meteor.publish("mySupportChatChannel",function(channel){
    return SupportChatChannels.find({_id: channel});
});

Meteor.publish("supporterChatChannels",function(){
    if(Roles.userIsInRole(this.userId, "chatSupporter")){
        return SupportChatChannels.find();
    }
});

Meteor.publish("supporters",function(){

        return Meteor.users.find({"roles": "chatSupporter"}, {fields: {username:1, roles:1, "status.online": true}});

});


SupportChatChannels.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"]);
    },
    remove: function(){
        return Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"]);
    }
});
SupportChatMessages.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"]);
    },
    remove: function(){
        return Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"]);
    }
});

Meteor.methods({
    createSupportRequest: function(data){
        data['clientIpAddress']  = this.connection.clientAddress;
        data['isClosed'] = false;
        var id = SupportChatChannels.insert(data);
        return id;
    },
    closeSupportRequest: function(channel, closedBy){

        return  SupportChatChannels.update({_id: channel}, {$set: {closedBy: closedBy, isClosed: true, endTime: new Date() }});

    },
    deleteChat: function(channel){
        if(!Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"])){
            throw new Meteor.Error( 401, "Unauthorized" );
        }
        SupportChatChannels.remove({_id: channel})
        SupportChatMessages.remove({channel: channel})
    },
    pingSupporters: function(){
        var supporters = Meteor.users.find({"roles": "chatSupporter"}).fetch();
        try{
            supporters.forEach(function(supporter){
                if(supporter.emails[0] && supporter.emails[0].address){
                    Email.send({
                        to: supporter.emails[0].address,
                        from: SupportChat.settings.emailSender,
                        subject:  SupportChat.settings.emailTopic,
                        text:  SupportChat.settings.emailBody
                    });
                }
            });
        }
        catch(e){
            throw new Meteor.Error( 500, e.message );
        }
        return true;
    }
});