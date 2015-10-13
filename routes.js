
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
