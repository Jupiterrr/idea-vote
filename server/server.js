function pickCategory() {
  var keys = Object.keys(CATEGORIES)
  return keys[Math.floor(Math.random()*keys.length)]
}

Meteor.startup(function () {
  if (Ideas.find().count() === 0) {
    var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    names.forEach(function(title) {
      Ideas.insert({
        createdAt: new Date(),
        title: title,
        description: "test",
        votes: [],
        owner: "#",
        category: pickCategory()
      })
    })
  }
});

Meteor.publish("ideas", function() {
  return [
    Ideas.find(),
    Meteor.users.find({}, {fields: {
      'profile': 1,
      'services.facebook.link': 1,
      'services.facebook.id': 1
    }})
  ];
});

Meteor.publish("userData", function() {
  return Meteor.users.find({}, {fields: {
    'profile': 1,
    'services.facebook.link': 1,
    'services.facebook.id': 1
  }})
});

Meteor.users.deny({
  update: function() {
    return true;
  }
});

var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
if (Meteor.settings &&
    Meteor.settings.facebook &&
    Meteor.settings.facebook.appId &&
    Meteor.settings.facebook.secret) {

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.facebook.appId,
    secret: Meteor.settings.facebook.secret
  });

  // Accounts.addAutopublishFields({
  //   // publish all fields including access token, which can legitimately
  //   // be used from the client (if transmitted over ssl or on
  //   // localhost). https://developers.facebook.com/docs/concepts/login/access-tokens-and-types/,
  //   // "Sharing of Access Tokens"
  //   forLoggedInUser: ['services.facebook'],
  //   forOtherUsers: [
  //     // https://www.facebook.com/help/167709519956542
  //     'services.facebook.id', 'services.facebook.username', 'services.facebook.gender'
  //   ]
  // });
}

appDump.allow = function() { return ADMINS.indexOf(this.user.services.facebook.id) > -1 }
