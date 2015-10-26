
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', {
  waitOn: function() {
    return [Meteor.subscribe("userData"), Meteor.subscribe("ideas")];
  },
  action: function () {
    this.render('IndexPage', {data: {}});
  }
});

Router.route('/suggestions/:_id', {
  waitOn: function() {
    return [Meteor.subscribe("userData"), Meteor.subscribe("ideas")];
  },
  action: function () {
    this.render('IdeaShowPage', {data: {_id: this.params._id}});
  }
});

Router.route('/suggestions/:_id/edit', function () {
  this.render('IdeaEditPage', {data: {_id: this.params._id}});
});

suggestionUrl = function(idea) {
  return "/suggestions/"+idea._id;
}

Router.route('/admin', {
  waitOn: function() {
    return Meteor.subscribe("userData");
  },
  before: function() {
    if (isAdmin()) this.next();
  },
  action: function () {
    this.render('AdminPage', {data: {}});
  }
});


suggestionEditUrl = function(idea) {
  return suggestionUrl(idea) + "/edit"
}

// console.log("...", Meteor.settings.facebook.appId, Meteor.settings.facebook.secret, !!(Meteor.settings &&
//       Meteor.settings.facebook &&
//       Meteor.settings.facebook.appId &&
//       Meteor.settings.facebook.secret))
