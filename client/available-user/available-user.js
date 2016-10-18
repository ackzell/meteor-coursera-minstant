Template.available_user.helpers({
  getUsername: function(userId) {
    user = Meteor.users.findOne({
      _id: userId
    });
    return user.profile.username;
  },
  isMyUser: function(userId) {
    if (userId == Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  }
});
