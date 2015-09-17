Meteor.methods({
  post: function(title, description) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    //Players.update(userId, { $inc: { score: +points } });
    return Ideas.insert({
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      title: title,
      description: description,
      votes: [],
      owner: Meteor.userId()
    });
  },
  vote: function(ideaId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Ideas.update(ideaId, { $addToSet: {votes: Meteor.userId()} });
  },
  unvote: function(ideaId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Ideas.update(ideaId, { $pull: {votes: Meteor.userId()} });
  },
  delete: function(ideaId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var idea = Ideas.findOne(ideaId);
    if (idea.owner != Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Ideas.remove(ideaId);
  }
});
