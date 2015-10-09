var FilterBar = ReactMeteor.createClass({

  handleCategoryChange: function(e) {
    Router.go("/?category="+e.target.value)
  },

  render: function() {
    var options = [<option key="_" value="">--- Kategorie ---</option>];
    Object.keys(CATEGORIES).forEach(function(k) {
      options.push(<option value={k} key={k}>{CATEGORIES[k]}</option>);
    });
    console.log("render", this.props)
    // <a href="#" className="filter-link">Hot</a>
    // <a href="#" className="filter-link">Top</a>
    // <a href="#" className="filter-link">New</a>
    return (<div className="filterbar">
      <select onChange={this.handleCategoryChange}>
        {options}
      </select>
      <a href="?my_feedback" className="filter-link">My feedback</a>
    </div>)
  }
});

IndexPage = ReactMeteor.createClass({
  // Specifying a templateName property allows the component to be
  // interpolated into a Blaze template just like any other template:
  // {{> Leaderboard x=1 y=2}}. This corresponds to the JSX expression
  // <Leaderboard x={1} y={2} />.
  templateName: "IndexPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  getMeteorState: function() {
    var query = {};
    var category = Number.parseInt(this.props.query.category);
    if (!isNaN(category)) query.category = category;
    var ideas = Ideas.find(query, {sort: {votes: -1}}).fetch()
    if('my_feedback' in this.props.query) {
      // query.votes = {$elemMatch: {$eq: Meteor.userId()}};
      ideas = ideas.filter(function(e) { return e.votes.indexOf(Meteor.userId()) >= 0; });
    }
    console.log("query", this.props.query, query)
    return {
      ideas: ideas,
      authenticated: !!Meteor.userId()
    };
  },

  render: function() {
    var items = this.state.ideas.map((idea) => {
      return (<li key={idea._id}><IdeaPost idea={idea} /></li>);
    });
    if (items.length === 0) {
      items.push(<li key="_">Keine Einträge</li>)
    }
    return (
      <div>
        <IdeaForm authenticated={this.state.authenticated}/>
        <FilterBar />
        <ul className="suggestion-list">{items}</ul>
      </div>
    );
  }
});
