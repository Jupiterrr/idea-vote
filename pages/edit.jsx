
IdeaEditPage = ReactMeteor.createClass({

  templateName: "IdeaEditPage",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("ideas");
  },

  getMeteorState: function() {
    if (this.state && this.state.idea) return this.state;
    var that = this;
    var idea = Ideas.findOne({_id: that.props._id});
    window.idea = idea;
    if (!idea) return {};
    var userID = Meteor.userId();
    return {
      idea: idea,
      authenticated: !!userID,
      description: idea.description
    };
  },

  componentDidMount: function() {
    $(".input-section textarea").autogrow({animate: false, onInitialize: true});
  },

  getFormState: function() {
    return {
      title: React.findDOMNode(this.refs.titleInput).value,
      description: React.findDOMNode(this.refs.descriptionInput).value,
      category: React.findDOMNode(this.refs.categoryInput).value
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var that = this;
    Meteor.call("update", this.state.idea._id, this.getFormState(), function(err) {
      if (!err) Router.go(suggestionUrl(that.state.idea));
    });
  },

  renderDropdown: function() {
    var options = [<option value="0" key="_">--- Kategorie (optional) ---</option>];
    Object.keys(window.CATEGORIES).forEach(function(k) {
      options.push(<option value={k} key={k}>{window.CATEGORIES[k]}</option>);
    });
    return (<select ref="categoryInput" className="category-selector" defaultValue={this.state.idea.category}>{options}</select>);
  },

  handleDescriptionChange: function() {
    var textarea = React.findDOMNode(this.refs.descriptionInput);
    this.setState({description: textarea.value});
    console.log("omg", this.state.description, textarea.value)
  },

  cancel: function(e) {
    e.preventDefault();
    Router.go(suggestionUrl(this.state.idea));
  },

  render: function() {
    if (!this.state.idea) return (<div></div>);
    if (this.state.description.length > 0) {
      var preview = (<div className="preview-section">
        <h5>Vorschau:</h5>
        <div className="markdown preview"dangerouslySetInnerHTML={{__html: marked(this.state.description, {sanitize: true})}}/>
      </div>)
    }
    return (
      <div className="input-section active">
        <a href={suggestionUrl(this.state.idea)} className="back-link">← Zurück</a>
        <form onSubmit={this.handleSubmit} ref="form">
          <input onFocus={this.handleActivate} ref="titleInput" className="new-idea-input" defaultValue={this.state.idea.title} placeholder="Gib deinen Vorschlag hier ein"/>
          <div className="fadein-area">
            {this.renderDropdown()}
            <textarea placeholder="Zusätzliche Beschreibung (optional)" ref="descriptionInput" value={this.state.description} onChange={this.handleDescriptionChange}/>
            <small className="description-md-hint">Du kannst deinen Text mit <a href="https://guides.github.com/features/mastering-markdown/#syntax" target="_blank">Markdown</a> formatieren.</small>
            {preview}
            <input type="submit" value="Änderung speichern" />&nbsp;
            <button type="reset" onClick={this.cancel}>Abbrechen</button>
            <hr className="ideaform-seperator"/>
          </div>
        </form>
      </div>
    );
  }
});
