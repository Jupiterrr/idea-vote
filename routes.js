
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('IndexPage');
});

Router.route('/suggestions/:_id', function () {
  this.render('IdeaShowPage', {data: {_id: this.params._id}});
});
