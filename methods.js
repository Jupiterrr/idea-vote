
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
  update: function(ideaId, data) {
    var idea = Ideas.findOne(ideaId);
    if (! canEditIdea(idea)) throw new Meteor.Error("not-authorized");
    var whitelistedData = _.pick(data, 'title', 'description', 'category');
    Ideas.update(ideaId, {$set: whitelistedData});
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
    var idea = Ideas.findOne(ideaId);
    if (! canDeleteIdea(idea)) throw new Meteor.Error("not-authorized");
    Ideas.remove(ideaId);
  }
});

canDeleteIdea = function(idea) {
  var user = Meteor.userId();
  if (!user) return false;

  var isOwner = function() { return idea.owner == user }
  return isAdmin() || (isOwner() && ideaAgeInMin(idea) <= 60)
}

canEditIdea = function(idea) {
  var user = Meteor.userId();
  if (!user) return false;

  var isOwner = function() { return idea.owner == user }
  return isAdmin() || isOwner();
}

// age in minutes
function ideaAgeInMin(idea) {
  return Math.floor((Date.now() - idea.createdAt) / (1000 * 60))
}
