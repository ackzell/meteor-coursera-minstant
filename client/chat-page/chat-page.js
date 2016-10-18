Template.chat_page.rendered = function () {
    this.$('[data-toggle="dropdown"]').dropdown();
    this.$('[data-toggle="tooltip"]').tooltip();
    this.$('[data-toggle="popover"]').popover({html: true});
};
Template.chat_page.helpers({
    messages: function() {
        var chat = Chats.findOne({
            _id: Session.get("chatId")
        });
        if (chat && chat.messages) {
            chat.messages.map((message) => {
                var user = Meteor.users.findOne({
                    _id: message.who
                });
                message.text = message.text.replace(/(?:\r\n|\r|\n)/g, '<br />');
                message.username = user.profile.username;
                message.avatar = user.profile.avatar;
                message.when = moment(message.when).format("h:mm a");
            });

            return chat.messages;
        }
    },
    other_user: function() {
        return ""
    },
});

Template.chat_message.helpers({
    isMyUser: function(userId) {
        if (userId == Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    }
});


Template.chat_page.events({
    // this event fires when the user sends a message on the chat page
    'submit .js-send-chat': function(event) {
        // stop the form from triggering a page reload
        event.preventDefault();

        if (event.target.chat.value === '') {
            return;
        }
        // see if we can find a chat object in the database
        // to which we'll add the message
        var chat = Chats.findOne({
            _id: Session.get("chatId")
        });
        if (chat) { // ok - we have a chat to use
            var msgs = chat.messages; // pull the messages property
            if (!msgs) { // no messages yet, create a new array
                msgs = [];
            }
            // is a good idea to insert data straight from the form
            // (i.e. the user) into the database?? certainly not.
            // push adds the message to the end of the array
            msgs.push({
                text: event.target.chat.value,
                when: new Date(),
                who: Meteor.userId()
            });
            // reset the form
            event.target.chat.value = '';
            // put the messages array onto the chat object
            chat.messages = msgs;
            // update the chat object in the database.
            Meteor.call('addMessage', chat, function() {
                var h = $('body').height() + 200;
                $('body').height(h);
                $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
            });
        }
    }
});
