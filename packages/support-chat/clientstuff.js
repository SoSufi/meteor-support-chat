Session.setDefault("MySupportChatChannel", null);
Session.setDefault("MySupportChatName", "");
Session.setDefault("MySupportAdminChatName", null);


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

var activeChats = {};

Template.registerHelper("getString", function(str){
    return strings[str];
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

    hasChat: function(){
        return Session.get("MySupportChatChannel");
    },
    channelInfo: function(){
        return SupportChatChannels.findOne({_id: Session.get("MySupportChatChannel")});
    }
});

Template.supportChatClient.events({
    "click #requestSupportButton": function(e,t){
        var name = t.find("#requestSupportName").value;
        var topic = t.find("#requestSupportTopic").value;
        if(name.length < 2){
            alert(strings['err_enterYourName']);
            return
        }
        Session.set("MySupportChatName", name);
        var data = {clientHandle: name, clientId: Meteor.userId(), topic: topic, created: new Date()};
        Meteor.call("createSupportRequest", data, function(e,r){
            Session.set("MySupportChatChannel", r);
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
        if(Session.get("MySupportChatChannel") == null){
            return;
        }
        var msg = t.find("#supportChatMessage").value;
        var data = {channel: Session.get("MySupportChatChannel"), from: Session.get("MySupportChatName"), timestamp: new Date(), message: msg};
        SupportChatMessages.insert(data);
    },
    "click #closeSupportButton": function(e,t){

        var data = {channel: Session.get("MySupportChatChannel"), timestamp: new Date(), exiting: true, message: strings['exitMessage_client']};
        SupportChatMessages.insert(data);
        Meteor.call("closeSupportRequest",Session.get("MySupportChatChannel"), "client");
        Session.set("MySupportChatChannel", null);
    },
    "DOMNodeInserted [data-action='supportChatList'] ": function(e,t){

        e.target.scrollTop = e.target.scrollHeight;
    }
});


/******************** Admin *********************/

Template.supportChatAdmin.onCreated(function(){

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
        SupportChatMessages.insert({channel: this._id, timestamp: new Date(), message: Session.get("MySupportAdminChatName") + " " + strings['entranceMessage_supporter']});
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

        var msg = t.find("#supportChatMessage").value;
        var data = {channel: t.data.channel, from: Session.get("MySupportAdminChatName"), timestamp: new Date(), message: msg};
        SupportChatMessages.insert(data);
    },
    "click #closeSupportButton": function(e,t){

        var data = {channel: t.data.channel, timestamp: new Date(), exiting: true, message: strings['exitMessage_supporter']};
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
    }
});