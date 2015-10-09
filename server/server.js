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
  return Ideas.find();
});
