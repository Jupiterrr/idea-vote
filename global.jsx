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



function afterFbLoad(cb) {
  if (typeof FB != "undefined") {
    cb(FB)
  } else {
    window.fbAsyncInit = function() {
      cb(FB)
    };
  }
}

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
