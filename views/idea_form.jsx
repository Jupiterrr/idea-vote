IdeaForm = ReactMeteor.createClass({

  getInitialState: function() {
    return {
      active: false
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
    classes = "input-section";
    if (this.state.active) classes += " active";
    return (
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
    );
  }
});
