IdeaPost = ReactMeteor.createClass({

  propTypes: {
    full: React.PropTypes.bool
  },

  render: function() {
    var idea = this.props.idea;
    if (this.props.full) var description = <div className="description markdown" dangerouslySetInnerHTML={{__html: marked(idea.description, {sanitize: true})}} />;
    if (idea.ownerObj) var ownerLink = (
      <span>
        <span className="separator">·</span>
        <img className="profile-picture" src={idea.ownerObj.profilePicture} width="16" height="16" />
        &nbsp;{idea.ownerObj.name}
      </span>
    )
    if (isAdmin()) {
      var voters = idea.voters.map(function(user) {
        var profile = user.profile;
        return <img className="profile-picture" src={profile.picture} title={profile.name} key={user._id} width="16" height="16" />
      })
    }

    return (
      <div className="idea-item">
        <div className="cell">
          <VoteBtn idea={idea} />
          <div className="voters">{voters}</div>
        </div>
        <div className="body">
          <a href={"/suggestions/" + idea._id} className="title"><h2>{idea.title}</h2></a>
          <div className="meta">
            <a href={"/suggestions/" + idea._id + "#comments"}>
              <span className="fb-comments-count" data-href={postAbsoluteUrl(idea._id)}>0</span>
              &nbsp;Kommentare
            </a>
            <span className="separator">·</span>
            <a href={"/?category="+idea.category}>{idea.categoryStr}</a>
            {ownerLink}
          </div>
          {description}
        </div>
      </div>
    );
  }
});
