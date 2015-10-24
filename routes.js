
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  console.log("hit")
  this.render('IndexPage', {data: {}});
});

Router.route('/suggestions/:_id', function () {
  this.render('IdeaShowPage', {data: {_id: this.params._id}});
});

Router.route('/suggestions/:_id/edit', function () {
  this.render('IdeaEditPage', {data: {_id: this.params._id}});
});

suggestionUrl = function(idea) {
  return "/suggestions/"+idea._id;
}

Router.route('/admin', {
  onBefore: function() { if (isAdmin()) this.next(); },
  action: function () {
    this.render('AdminPage', {data: {}});
  }
});


suggestionEditUrl = function(idea) {
  return suggestionUrl(idea) + "/edit"
}
