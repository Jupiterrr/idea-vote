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
