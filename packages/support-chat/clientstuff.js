Session.setDefault("MySupportChatChannel", null);
Session.setDefault("MySupportChatName", "");
Session.setDefault("MySupportChatHasPinged", false);





var activeChats = {};

var clientSendMessage = function(t){
    if(Session.get("MySupportChatChannel") == null){
        return;
    }
    var msg = t.find("#supportChatMessage").value;
    var data = {channel: Session.get("MySupportChatChannel"), from: Session.get("MySupportChatName"), timestamp: new Date(), message: msg};
    t.find("#supportChatMessage").value = "";
    SupportChatMessages.insert(data);
};

var adminSendMessage = function(t, channel){
    var msg = t.find("#supportChatMessage").value;
    var data = {channel: t.data.channel, from: Session.get("MySupportAdminChatName"), timestamp: new Date(), message: msg};
    t.find("#supportChatMessage").value = "";
    SupportChatMessages.insert(data);
};

Template.registerHelper("getString", function(str){
    return SupportChat.settings.strings[str];
});

Template.registerHelper("formattedTimestamp", function(t){
    return moment().diff(moment(t),"days") > 0  ? moment(t).fromNow() : moment(t).format("HH:mm:ss");
});

Template.supportChatClient.onCreated(function(){

    this.autorun(function(){

            Meteor.subscribe("mySupportChatChannel", Session.get("MySupportChatChannel"));
            Meteor.subscribe("supportChatMessages", Session.get("MySupportChatChannel"));
            Meteor.subscribe("supporters");

    });

});

Template.supportChatClient.helpers({
    supportersOnline: function(){
        return typeof Meteor.users.findOne({"roles": "chatSupporter", "status.online": true}) != "undefined";
    },
    hasPinged: function(){
        return Session.get("MySupportChatHasPinged");
    },
    hasChat: function(){
        return Session.get("MySupportChatChannel");
    },
    channelInfo: function(){
        return SupportChatChannels.findOne({_id: Session.get("MySupportChatChannel")});
    },
    config: function(){
        return SupportChat.settings;
    }
});

Template.supportChatClient.events({
    "click #requestSupportButton": function(e,t){
        var name = t.find("#requestSupportName").value;
        var topic = t.find("#requestSupportTopic").value;
        if(name.length < 2){
            alert(SupportChat.settings.strings['err_enterYourName']);
            return
        }
        Session.set("MySupportChatName", name);
        var data = {clientHandle: name, clientId: Meteor.userId(), topic: topic, created: new Date()};
        Meteor.call("createSupportRequest", data, function(e,r){
            Session.set("MySupportChatChannel", r);
        });
    },
    "click [data-action='ping/Supporter'] ":function(){
        Meteor.call("pingSupporters", function(e,t){
            if(t){
                Session.set("MySupportChatHasPinged", true);
            }
            else if(e){
                alert(e.message);
            }
        });
    }

});



Template.supportChatClientMessages.onCreated(function(){
   // this.subscribe("mySupportChatMessages", Session.get("MySupportChatName"));

});


Template.supportChatClientMessages.helpers({
    hasSupporter: function(){
        var s = SupportChatChannels.findOne({_id: Session.get("MySupportChatChannel")});
        return s && s.supporterHandle;
    },

    messages: function(){
        return SupportChatMessages.find({channel: Session.get("MySupportChatChannel")}, {sort: {timestamp: 1}});
    },
    listClass: function(){
        return this.isSupporter ? "clientMessage" : "supporterMessage";
    }

});

Template.supportChatClientMessages.events({
    "click #sendSupportChatMessageButton": function(e,t){
        clientSendMessage(t);
        /*
        if(Session.get("MySupportChatChannel") == null){
            return;
        }
        var msg = t.find("#supportChatMessage").value;
        var data = {channel: Session.get("MySupportChatChannel"), from: Session.get("MySupportChatName"), timestamp: new Date(), message: msg};
        t.find("#supportChatMessage").value = "";
        SupportChatMessages.insert(data);
        */

    },
    "click #closeSupportButton": function(e,t){

        var data = {channel: Session.get("MySupportChatChannel"), timestamp: new Date(), exiting: true, message: SupportChat.settings.strings['exitMessage_client']};
        SupportChatMessages.insert(data);
        Meteor.call("closeSupportRequest",Session.get("MySupportChatChannel"), "client");
        Session.set("MySupportChatChannel", null);
    },
    "DOMNodeInserted [data-action='supportChatList'] ": function(e,t){

        e.target.scrollTop = e.target.scrollHeight;
    },
    "keypress #supportChatMessage": function(e,t){
        e.charCode == 13 ? clientSendMessage(t) : null;

    }
});


/******************** Admin *********************/

Template.supportChatAdmin.onCreated(function(){
    Session.setDefault("MySupportAdminChatName", null);
    this.autorun(function(){
        Meteor.subscribe("supporterChatChannels");
    });
});

Template.supportChatAdmin.onRendered(function(){
    if(Session.get("MySupportChatName") === "" && Meteor.user()){
        Session.set("MySupportChatName", Meteor.user().profile.name);
    }
});

Template.supportChatAdmin.helpers({
    isSupporter: function(){
        return Roles.userIsInRole(Meteor.userId(), ["chatSupporter", "admin"]);
    },
    hasHandle: function(){
        return  Session.get("MySupportAdminChatName");
    },
    openChannels: function(){
        return SupportChatChannels.find({endTime: null},{sort: {startTime: 1}});
    },
    closedChannels: function(){
        return SupportChatChannels.find({isClosed: true},{sort: {startTime: 1}});
    },
    hasSupporter: function(){
        return this.supporterId != null;
    },
    isActive: function(){
        return this.endTime == null && this.supporterId != null;
    },
    hasOpenWindow: function(){
        return activeChats[this._id];
    }

});

Template.supportChatAdmin.events({
    "click [data-action='supportChat/setHandle']": function(e,t){

        Session.set("MySupportAdminChatName", t.find("#adminSupportHandle").value );

    },
    "click [data-action='supportChat/select']": function(e,t){
        var data = {supporterHandle: Session.get("MySupportAdminChatName"), startTime: new Date(), supporterId: Meteor.userId()};
        SupportChatChannels.update({_id: this._id}, {$set: data});
        SupportChatMessages.insert({channel: this._id, timestamp: new Date(), message: Session.get("MySupportAdminChatName") + " " + SupportChat.settings.strings['entranceMessage_supporter']});
        // open it in #supportCatContainer
        var rb = Blaze.renderWithData(Template.supportChatAdminChatWindow, {channel: this._id, isSupporter: true}, $("#supportCatContainer")[0]);
        activeChats[this._id] = rb;
    },
    "click [data-action='supportChat/delete'] ": function(e,t){


        Meteor.call("deleteChat", this._id);

    }
});

Template.supportChatAdminChatWindow.onCreated(function(){
    Meteor.subscribe("supportChatMessages", this.data.channel);
});

Template.supportChatAdminChatWindow.helpers({
    channelInfo: function(){
        return SupportChatChannels.findOne({_id: this.channel});
    },
    messages: function(){
        return SupportChatMessages.find({channel: this.channel}, {sort: {timestamp: 1}});
    },
    listClass: function(){
        return this.isSupporter ? "clientMessage" : "supporterMessage";
    }
});
Template.supportChatAdminChatWindow.events({
    "click #sendSupportChatMessageButton": function(e,t){
        adminSendMessage(t);
        /*
        var msg = t.find("#supportChatMessage").value;
        var data = {channel: t.data.channel, from: Session.get("MySupportAdminChatName"), timestamp: new Date(), message: msg};
        t.find("#supportChatMessage").value = "";
        SupportChatMessages.insert(data);
        */
    },
    "click #closeSupportButton": function(e,t){

        var data = {channel: t.data.channel, timestamp: new Date(), exiting: true, message: SupportChat.settings.strings['exitMessage_supporter']};
        var btn = t.find("#closeSupportButton");

        btn.innerHTML =  "Closing...";
        btn.setAttribute("disabled", true);
        SupportChatMessages.insert(data);
        Meteor.call("closeSupportRequest", t.data.channel, "supporter");
        //close this window after 4 seconds
        Blaze.remove(activeChats[t.data.channel]);
        delete activeChats[t.data.channel];
        Meteor.setTimeout(function(){
            //Blaze.remove(t.view);
        }, 2000);


    },
    "DOMNodeInserted [data-action='supportChatList'] ": function(e,t){
        e.target.scrollTop = e.target.scrollHeight;
    },
    "keypress #supportChatMessage": function(e,t){
        e.charCode == 13 ? adminSendMessage(t) : null;

    }

});