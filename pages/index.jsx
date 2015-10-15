
IndexPage = ReactMeteor.createClass({
  templateName: "IndexPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  componentDidMount: function() {
    // console.log("componentDidMount")
    var that = this;
    $(document).on("query-change", function() {
      that.setState(that.getMeteorState())
    })
  },

  getMeteorState: function() {
    // console.log("getMeteorState")
    IdeasStore.initialize();
    IdeasStore.fetch();

    return {
      ideas: IdeasStore.getIdeas(),
      authenticated: !!Meteor.userId(),
      filter: IdeasStore.getFilter()
    };
  },

  render: function() {
    // console.log("render list")
    if (this.state.ideas.length) {
      var items = this.state.ideas.map((idea) => {
        return (<li key={idea._id}><IdeaPost idea={idea} /></li>);
      });
    } else {
      var items = [<li key="_">Keine Einträge</li>]
    }
    return (
      <div className="index-page">
        <IdeaForm authenticated={this.state.authenticated}/>
        <FilterBar filter={this.state.filter}/>
        <ul className="suggestion-list">{items}</ul>
      </div>
    );
  }
});
