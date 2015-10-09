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
    var category = React.findDOMNode(this.refs.categoryInput).value;

    var x = Meteor.call("post", title, description, category, function(err, res) {
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

  renderDropdown: function() {
    var options = [<option value="0" key="_">--- Kategorie (optional) ---</option>];
    Object.keys(window.CATEGORIES).forEach(function(k) {
      options.push(<option value={k} key={k}>{window.CATEGORIES[k]}</option>);
    });
    return (<select ref="categoryInput" className="category-selector">{options}</select>);
  },

  render: function() {
    return this.props.authenticated ? this.renderAuthenticated() : this.renderUnauthenticated();
  },

  renderUnauthenticated: function() {
    classes = "input-section";
    return (
      <div className={classes}>
        Melde dich an um Vorschläge einzureichen und abzustimmen.
      </div>
    );
  },

  renderAuthenticated: function() {
    classes = "input-section";
    if (this.state.active) classes += " active";
    return (
      <div className={classes}>
        <h2>Bitte gib deinen Vorschlag ein...</h2>
        <form onSubmit={this.handleSubmit} ref="form">
          <input onFocus={this.handleActivate} ref="titleInput" className="new-idea-input" placeholder="Gib deinen Vorschlag hier ein"/>
          <div className="fadein-area">
            {this.renderDropdown()}
            <textarea placeholder="Zusätzliche Beschreibung (optional)" ref="descriptionInput"/>
            <input type="submit" value="Senden" />&nbsp;
            <button type="reset" onClick={this.clear}>Abbrechen</button>
          </div>
        </form>
      </div>
    );
  }

});
