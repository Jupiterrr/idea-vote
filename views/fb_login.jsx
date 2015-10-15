
FBLogin = ReactMeteor.createClass({
  templateName: "FBLogin",

  getMeteorState: function() {
    return {currentUser: Meteor.user()}
  },

  handleLoginClick: function() {
    var options = {};
    if (Accounts.ui._options.requestPermissions.facebook)
      options.requestPermissions = Accounts.ui._options.requestPermissions.facebook;
    if (Accounts.ui._options.requestOfflineToken.facebook)
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken.facebook;
    Meteor.loginWithFacebook(options);
  },

  handleLogoutClick: function() {
    Meteor.logout();
  },

  render: function() {
    return this.state.currentUser ? this.renderAuthenticated() : this.renderUnauthenticated();
  },

  renderAuthenticated: function() {
    var user = this.state.currentUser;
    return (<div>
      <span>{user.profile.name}</span>&nbsp;&nbsp;
      <div className="login-btn" onClick={this.handleLogoutClick}>Abmelden</div>
    </div>)
  },

  renderUnauthenticated: function() {
    return (<div className="login-btn" onClick={this.handleLoginClick}>
      <div className="fb-login-image"></div>
      <span className="text-besides-image">Mit Facebook anmelden</span>
    </div>)
  }

});
