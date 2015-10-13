Meteor.methods({
  post: function(title, description, category) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    if (!title || title.toString().length < 3) {
      throw new Meteor.Error("validation-failed", "Der Titel ist zu kurz.");
    }
    if (!(category && category in CATEGORIES)) {
      throw new Meteor.Error("validation-failed", "Kategorie existiert nicht.");
    }
    //Players.update(userId, { $inc: { score: +points } });
    return Ideas.insert({
      createdBy: Meteor.userId(),
      createdAt: new Date(),
      title: title,
      description: description,
      votes: [Meteor.userId()],
      owner: Meteor.userId(),
      category: category
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
