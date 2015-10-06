VoteBtn = ReactMeteor.createClass({

  handleVote: function() {
    var that = this;
    if (!Meteor.userId()) {
      Meteor.loginWithFacebook(function(err) {
        if (err) return alert("Login failed");
        Meteor.call("vote", that.props.idea._id);
      });
    } else {
      Meteor.call("vote", this.props.idea._id);
    }
  },

  handleUnvote: function() {
    Meteor.call("unvote", this.props.idea._id);
  },

  render: function() {
    if (Meteor.userId()) {
      var unvote = this.props.idea.votes.indexOf(Meteor.userId()) > -1
    } else {
      var unvote = false;
    }

    // if (Meteor.user()) {
    //
    // } else {
    //   var voteBtn = <button disabled>Vote</button>
    // }
    var classes = "vote-badge";
    classes += unvote ? " upvote" : " unvote";
    classes += unvote && " voted";

    return (<div className={classes} onClick={unvote ? this.handleUnvote : this.handleVote}>
      <div className="box">
        <span className="vote-count">{this.props.idea.votes.length}</span>
        <span className="plus">{unvote ? "-" : "+"}</span>
      </div>
      <div className="vote">{unvote ? "Unvote" : "Vote"}</div>
    </div>)
  }
});
