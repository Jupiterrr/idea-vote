IdeaPost = ReactMeteor.createClass({

  propTypes: {
    full: React.PropTypes.bool
  },

  render: function() {
    var idea = this.props.idea;
    if (this.props.full) var description = <p>{idea.description}</p>;
    return (
      <div className="idea-item">
        <div className="cell"><VoteBtn idea={idea} /></div>
        <div className="body">
          <a href={"/suggestions/" + idea._id}><h2>{idea.title}</h2></a>
          <div className="meta">
            <a href={"/suggestions/" + idea._id + "#comments"}>
              <span className="fb-comments-count" data-href={postAbsoluteUrl(idea._id)}>0</span>
              &nbsp;Kommentare
            </a>
            <span className="separator">·</span>
            <span>{idea.categoryStr}</span>
          </div>
          {description}
        </div>
      </div>
    );
  }
});
