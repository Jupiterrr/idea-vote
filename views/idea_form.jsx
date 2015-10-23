IdeaForm = ReactMeteor.createClass({

  propTypes: {
    authenticated: React.PropTypes.bool.isRequired
  },

  getInitialState: function() {
    return {
      active: false,
      description: ""
    };
  },

  componentDidMount: function() {
    var that = this;
    $(React.findDOMNode(this.refs.form)).on('keyup.form-escape', function(e) {
      if (e.keyCode == 27) that.clear()
    })
    // $(document).on( "click.form-escape", ".vote-badge", function() {
    //   that.clear()
    // });
    $(".input-section textarea").autogrow({animate: false});
  },

  componentWillUnmount: function() {
    $(React.findDOMNode(this.refs.form)).off(".form-escape");
    // $(".vote-badge").off(".form-escape");;
  },

  handleSubmit: function(e) {
    var title = React.findDOMNode(this.refs.titleInput).value;
    var description = React.findDOMNode(this.refs.descriptionInput).value;
    var category = React.findDOMNode(this.refs.categoryInput).value;

    var x = Meteor.call("post", title, description, category, function(err, res) {
      if (err) {
        alert(err.reason);
      } else {
        Router.go("/"+postUrl(res));
      }
    });
    console.log("post", x);
    window.x = x;
    e.preventDefault();
  },

  handleActivate: function() {
    this.setState({active: true});
    // $(React.findDOMNode(this.refs.descriptionInput)).autogrow();
  },

  clear: function(e) {
    this.setState({active: false});
    React.findDOMNode(this.refs.form).reset();
    $(":focus").blur();
    if (e) e.preventDefault();
  },

  handleDescriptionChange: function() {
    var textarea = React.findDOMNode(this.refs.descriptionInput);
    this.setState({description: textarea.value});
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
    classes = "input-section unauthenticated";
    return (
      <div className={classes}>
        <a onClick={Meteor.loginWithFacebook} href="javascript:;">Melde dich an</a> um Vorschläge einzureichen und abzustimmen.
      </div>
    );
  },

  renderAuthenticated: function() {
    classes = "input-section";
    if (this.state.active) classes += " active";
    console.log("this.state.description", this.state.description)
    if (this.state.description.length > 0) {
      var preview = (<div className="preview-section">
        <h5>Vorschau:</h5>
        <div className="markdown preview"dangerouslySetInnerHTML={{__html: marked(this.state.description, {sanitize: true})}}/>
      </div>)
    }

    return (
      <div className={classes}>
        <h2>Bitte gib deinen Vorschlag ein...</h2>
        <form onSubmit={this.handleSubmit} ref="form">
          <input onFocus={this.handleActivate} ref="titleInput" className="new-idea-input" placeholder="Gib deinen Vorschlag hier ein"/>
          <div className="fadein-area">
            {this.renderDropdown()}
            <textarea placeholder="Zusätzliche Beschreibung (optional)" ref="descriptionInput" value={this.state.description} onChange={this.handleDescriptionChange}/>
            <small className="description-md-hint">Du kannst deinen Text mit <a href="https://guides.github.com/features/mastering-markdown/#syntax" target="_blank">Markdown</a> formatieren.</small>
            {preview}
            <input type="submit" value="Vorschlag abschicken" />&nbsp;
            <button type="reset" onClick={this.clear}>Abbrechen</button>
            <hr className="ideaform-seperator"/>
          </div>
        </form>
      </div>
    );
  }

});
