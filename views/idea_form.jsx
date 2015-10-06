IdeaForm = ReactMeteor.createClass({

  propTypes: {
    authenticated: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    return {
      active: false
    };
  },

  componentDidMount: function() {
    var that = this;
    $(React.findDOMNode(this.refs.form)).on('keyup.unique_name', function(e) {
      if (e.keyCode == 27) that.clear()
    })
  },

  componentWillUnmount: function() {
    $(React.findDOMNode(this.refs.form)).off(".form-escape");
  },

  handleSubmit: function(e) {
    var title = React.findDOMNode(this.refs.titleInput).value;
    var description = React.findDOMNode(this.refs.descriptionInput).value;
    var x = Meteor.call("post", title, description, function(err, res) {
      if (!err) Router.go("/"+postUrl(res));
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
    $(":focus").blur();
    if (e) e.preventDefault();
  },

  render: function() {
    // return (<div>omg</div>)
    return this.props.authenticated ? this.renderAuthenticated() : this.renderUnauthenticated();
  },

  renderUnauthenticated: function() {
    classes = "input-section";
    return (
      <div className={classes}>
        Login to submit suggestions.
      </div>
    );
  },

  renderAuthenticated: function() {
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
