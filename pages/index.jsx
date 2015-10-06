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
    return {
      ideas: Ideas.find({}, {sort: {votes: -1}}).fetch(),
      authenticated: !!Meteor.userId()
    };
  },

  render: function() {
    const items = this.state.ideas.map((idea) => {
      return (<li key={idea._id}><IdeaPost idea={idea} /></li>);
    });
    return (
      <div>
        <IdeaForm authenticated={this.state.authenticated}/>
        <ul className="suggestion-list">{items}</ul>
      </div>
    );
  }
});
