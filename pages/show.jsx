
IdeaShowPage = ReactMeteor.createClass({

  templateName: "IdeaShowPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  getMeteorState: function() {
    var that = this;
    var idea = Ideas.findOne({_id: that.props._id});
    window.idea = idea;
    if (!idea) return {};
    var userID = Meteor.userId();
    return {
      idea: idea,
      authenticated: !!userID
    };
  },

  handleDelete: function(e) {
    e.preventDefault();
    if (!confirm("Bist du sicher, dass du den Vorschlag löschen möchtest?")) return;
    Meteor.call("delete", this.state.idea._id, function(err) {
      if (!err) Router.go("/");
    });
  },

  render: function() {
    if (!this.state.idea) return (<div></div>);
    if ( canDeleteIdea(this.state.idea) ) {
      var deleteLink = (<span>
      &nbsp;<span className="separator">·</span>&nbsp;
      <a className="back-link" href="javascript:;" onClick={this.handleDelete}>✕ Löschen</a>
      </span>);
    };
    return (
      <div>
        <a href="/" className="back-link">← Vorschläge</a>
        {deleteLink}
        <IdeaPost idea={this.state.idea} full={true}/>
        <div className="fb-comments" data-href={postAbsoluteUrl(this.state.idea._id)} data-numposts="10" data-width="100%"></div>
      </div>
    );
  }
});
