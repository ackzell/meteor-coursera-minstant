Meteor.methods({
    addMessage: function (chat) {

        if (!this.userId) { // we don't have a user
             throw new Meteor.Error('not-authorized');
        } else {
            return Chats.update(chat._id, chat);
        }

    },
    createChat: function (chat) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        } else {
            return Chats.insert(chat);
        }
    }

});
