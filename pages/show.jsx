var IdeaShowPage = ReactMeteor.createClass({

  templateName: "IdeaShowPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  getMeteorState: function() {
    var that = this;
    return {
      idea: Ideas.findOne({_id: that.props._id})
    };
  },

  componentDidMount: function() {
    console.log("mount", typeof FB != "undefined")
    afterFbLoad(function(fb) {
      setTimeout(function () {
        console.log("load", fb)
        FB.XFBML.parse();
      }, 100);
    })
  },

  handleDelete: function(e) {
    e.preventDefault();
    Meteor.call("delete", this.state.idea._id, function(err) {
      if (!err) Router.go("/");
    });
  },

  render: function() {
    if (!this.state.idea) return (<div></div>);
    var owner = Meteor.userId() == this.state.idea.owner;
    if (owner) var deleteLink = (<a className="back-link" href="javascript:;" onClick={this.handleDelete}>✕ Delete</a>);
    return (
      <div>
        <a href="/" className="back-link">← Suggestions</a>
        &nbsp;<span className="separator">·</span>&nbsp;
        {deleteLink}
        <IdeaPost idea={this.state.idea} />
        <div className="fb-comments" data-href={postAbsoluteUrl(this.state.idea._id)} data-numposts="10"></div>
      </div>
    );
  }
});
