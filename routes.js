
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('Ideaboard');
});

Router.route('/suggestions/:_id', function () {
  this.render('suggestionPage', {data: {_id: this.params._id}});
});
