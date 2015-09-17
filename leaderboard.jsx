/**
 * Port of the leaderboard example to use React for rendering.
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */

var cx = React.addons.classSet;
var hostUrl = "localhost:3000"
const CATEGORIES = {
  0: "Allgemein",
  1: "Architektur",
  2: "Bauingenieur-, Geo- und Umweltwissenschaften",
  3: "Chemie und Biowissenschaften",
  4: "Chemieingenieurwesen und Verfahrenstechnik",
  5: "Elektrotechnik und Informationstechnik",
  6: "Geistes- und Sozialwissenschaften",
  7: "Informatik",
  8: "Maschinenbau",
  9: "Mathematik",
  10: "Physik",
  11: "Wirtschaftswissenschaften"
};
Ideas = new Meteor.Collection("ideas");


var FilterBar = ReactMeteor.createClass({

  render: function() {
    var options = [<option>--- Alle ---</option>];
    // Object.keys(CATEGORIES).map(function(k) {
    //   return (<option value={k}>{CATEGORIES[k]}</option>);
    // });
    return (<div className="filterbar">
      <a href="#" className="filter-link">Hot</a>
      <a href="#" className="filter-link">Top</a>
      <a href="#" className="filter-link">New</a>
      <select>
        {options}
      </select>
      <a href="#" className="filter-link">My feedback</a>
    </div>)
  }
});

var VoteBadge2 = ReactMeteor.createClass({

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
      <div className="vote">{unvote ? "unvote" : "vote"}</div>
    </div>)
  }
});

var IdeaPost = ReactMeteor.createClass({
  render: function() {
    var idea = this.props.idea;
    return (
      <div className="idea-item">
        <div className="cell"><VoteBadge2 idea={idea} /></div>
        <div className="body">
          <a href={"/suggestions/" + idea._id}><h2>{idea.title}</h2></a>
          <div className="meta">
            <a href={"/suggestions/" + idea._id + "#comments"}>
              <span className="fb-comments-count" data-href={postAbsoluteUrl(idea._id)}>0</span>
              &nbsp;comments
            </a>
            <span className="separator">·</span>
            <span>Operating System</span>
          </div>
        </div>
      </div>);
      // <span className="separator">·</span>
      // <a href="#">Flag idea as inappropriate…</a>
  }
});

var Ideaboard = ReactMeteor.createClass({
  // Specifying a templateName property allows the component to be
  // interpolated into a Blaze template just like any other template:
  // {{> Leaderboard x=1 y=2}}. This corresponds to the JSX expression
  // <Leaderboard x={1} y={2} />.
  templateName: "Ideaboard",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  getState: function() {
    return {
      active: false
    };
  },

  getMeteorState: function() {
    return {
      ideas: Ideas.find({}, {sort: {votes: -1}}).fetch()
    };
  },

  handleSubmit: function(e) {
    var title = React.findDOMNode(this.refs.titleInput).value;
    var description = React.findDOMNode(this.refs.descriptionInput).value;
    var x = Meteor.call("post", title, description, function(err, res) {
      if (!err) Router.go(postUrl(res));
    });
    console.log("post", x);
    window.x = x;
    e.preventDefault();
  },

  handleActivate: function() {
    this.setState({active: true});
  },

  clear: function(e) {
    this.setState({active: false});
    React.findDOMNode(this.refs.form).reset();
    e.preventDefault();
  },

  render: function() {
    const items = this.state.ideas.map((idea) => {
      return (<li key={idea._id}><IdeaPost idea={idea} /></li>);
    });

    classes = "input-section"
    if (this.state.active) classes += " active"
    return (
      <div>
        <div className={classes}>
          <h2>Please enter your suggestion...</h2>
          <form onSubmit={this.handleSubmit} ref="form">
            <input onFocus={this.handleActivate} ref="titleInput" className="new-idea-input" placeholder="Enter your idea here"/>
            <div className="fadein-area">
              <textarea placeholder="Additional description (optional)" ref="descriptionInput"/>
              <input type="submit" value="Submit" />&nbsp;
              <button type="reset" value="Reset" onClick={this.clear}>Cancel</button>
            </div>
          </form>
        </div>
        <ul className="suggestion-list">{items}</ul>
      </div>
    );
  }
});

function afterFbLoad(cb) {
  if (typeof FB != "undefined") {
    cb(FB)
  } else {
    window.fbAsyncInit = function() {
      cb(FB)
    };
  }
}

var suggestionPage = ReactMeteor.createClass({
  // Specifying a templateName property allows the component to be
  // interpolated into a Blaze template just like any other template:
  // {{> Leaderboard x=1 y=2}}. This corresponds to the JSX expression
  // <Leaderboard x={1} y={2} />.
  templateName: "suggestionPage",

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




if (Meteor.isClient) {
  // Accounts.ui.config({
  //   passwordSignupFields: "USERNAME_ONLY"
  // });
  window.postUrl = function (id) {
    return "suggestions/"+id
  }

  window.postAbsoluteUrl = function (id) {
    return Meteor.absoluteUrl()+postUrl(id);
  }
}
