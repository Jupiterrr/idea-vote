var _ideas = [];
var _filteredIdeas = []
var _filter = {
  categoryId: null,
  myFeedback: false
};
var _counts = {};

IdeasStore = {
  initialize: function() {
    _filter = this._getFilterFromUrl();
    this._resetCounts();
  },
  fetch: function() {
    var query = {};
    // if (_filter.categoryId !== null) query.category = _filter.categoryId.toString();
    _ideas = Ideas.find(query, {}).fetch();
    console.log("ideas fetched", _ideas, JSON.stringify(query));

    this._resetCounts();
    _ideas.forEach(function(idea) {
      _counts[idea.category]++;
    });
    _counts["all"] = _ideas.length;
    // console.log("counts", _counts)

    _filteredIdeas = _ideas;
    if (_filter.myFeedback) {
      var hasVoted = function(idea, userID) { return idea.votes.indexOf(userID) >= 0; }
      var isOwner = function(idea, userID) { return idea.owner == userID; }

      const u = Meteor.userId();
      _filteredIdeas = _filteredIdeas.filter(function(i) { return hasVoted(i, u) || isOwner(i, u) });
    }
    if (_filter.categoryId !== null) {
      _filteredIdeas = _filteredIdeas.filter(function(e) { return e.category == _filter.categoryId.toString(); });
    }

    $(IdeasStore).trigger("update");
    return _filteredIdeas;
  },
  setCategoryFilter: function(id) {
    _filter.categoryId = id;
    if (id !== null) _filter.myFeedback = false;
    this.setUrl();
    this.fetch();
  },
  setUrl: function() {
    // this alone doesn't rerender page
    if (_filter.categoryId !== null) {
      Router.go("/?category="+_filter.categoryId);
    } else {
      Router.go("/");
    }
  },
  getIdeas: function() { return _filteredIdeas; },
  getFilter: function() { return _filter; },
  getCategoryCounts: function() { return _counts;},

  _getFilterFromUrl: function() {
    const queryParams = Router.current().params.query;
    const _category = Number.parseInt(queryParams.category);
    const category = isNaN(_category) ? null : _category;
    const myFeedback = 'my_feedback' in queryParams
    return {
      categoryId: category,
      myFeedback: myFeedback
    };
  },

  _resetCounts: function() {
    CATEGORIES_V2.forEach(function(c) { _counts[c.id] = 0 })
    _counts["all"] = 0;
  }
}
