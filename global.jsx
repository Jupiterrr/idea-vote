/**
 * Port of the leaderboard example to use React for rendering.
 *
 * This directive is necessary to enable preprocessing of JSX tags:
 * @jsx React.DOM
 */

var cx = React.addons.classSet;
// var hostUrl = "localhost:3000"
// Meteor.absoluteUrl.defaultOptions.rootUrl = "http://localhost.kithub.de:3000"

ADMINS = ["10204716619573865", "10204920049459485"]

CATEGORIES = {
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

CATEGORIES_V2 = Object.keys(CATEGORIES).map(function (k) { return {id: k.toString(), title: CATEGORIES[k]} });
FILTER_CATEGORIES = CATEGORIES_V2.slice();
FILTER_CATEGORIES.unshift({id: "", title: "- Alle Kategorien"});

isAdmin = function() {
  var user = Meteor.user();
  return user && ADMINS.indexOf(user.services.facebook.id) >= 0;
}

Ideas = new Meteor.Collection("ideas", {
  transform: function(doc) {
    var owner = Meteor.users.findOne(doc.owner);
    if (owner && owner.services) {
      doc.ownerObj = {
        name: owner.profile.name,
        fbLink: owner.services.facebook.link,
        profilePicture: "http://graph.facebook.com/"+owner.services.facebook.id+"/picture?type=square"
      }
    } else {
      doc.ownerObj = null;
    }
    doc.categoryStr = CATEGORIES[doc.category];
    return doc;
  }
});

if (Meteor.isClient) {
  window.CATEGORIES = CATEGORIES;
  // Accounts.ui.config({
  //   passwordSignupFields: "USERNAME_ONLY"
  // });
  window.postUrl = function (id) {
    return "suggestions/"+id
  }

  window.postAbsoluteUrl = function (id) {
    return Meteor.absoluteUrl()+postUrl(id);
  }


  function afterFbLoad(cb) {
    if (typeof FB != "undefined") {
      cb(FB)
    } else {
      window.fbAsyncInit = function() {
        cb(FB)
      };
    }
  }

  Router.onAfterAction(function() {
    setTimeout(function() {
      afterFbLoad(function() {
        FB.XFBML.parse();
        console.log("FB.XFBML.parse()")
      })
    }, 0)
  });

  Accounts.ui.config({
    requestPermissions: {
       facebook: [],
    }
  });

  // var authenticated = !!Meteor.userId();
  // setInterval(function(){
  //   var temp = !!Meteor.userId();
  //   if (authenticated != temp) {
  //     authenticated = !authenticated;
  //     $(document).trigger("loginChange");
  //   }
  // }, 200);

  // Template.ApplicationLayout.rendered = function() {
  //   $(document).on("loginChange", replaceText);
  // };
}
