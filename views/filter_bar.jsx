FilterBar = ReactMeteor.createClass({

  propTypes: {
    filter: React.PropTypes.object.isRequired
  },

  handleCategoryChange: function(e) {
    IdeasStore.setCategoryFilter(e.target.value);
  },

  renderMyFilter: function() {
    if (!Meteor.userId()) return null;
    var path = this.props.filter.myFeedback ? "?" : "?my_feedback"
    var className = "filter-link filter-link-myfeedback"
    if (this.props.filter.myFeedback) className += " active"
    return <a href={path} className={className}>Mein Feedback</a>
  },

  render: function() {
    var categoryKey = Number.isInteger(this.props.filter.categoryId) ? this.props.filter.categoryId.toString() : "";
    // console.log("categoryKey", typeof categoryKey, categoryKey)
    var counts = IdeasStore.getCategoryCounts()
    counts[""] = counts["all"];
    var options = FILTER_CATEGORIES.map(function(c) {
      return (<option value={c.id} key={c.id}>{c.title + " (" + counts[c.id] + ")"}</option>);
    });
    if (categoryKey != "" || this.props.filter.myFeedback) {
      var clearLink = <a href="?" className="filter-link" title="Filter zurücksetzen">✕</a>
    }
    // <a href="#" className="filter-link">Hot</a>
    // <a href="#" className="filter-link">Top</a>
    // <a href="#" className="filter-link">New</a>
    return (<div className="filterbar">
      <select onChange={this.handleCategoryChange} value={categoryKey}>
        {options}
      </select>
      {this.renderMyFilter()}
      {clearLink}
    </div>)
  }
});
