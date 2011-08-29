var mongoose = require('mongoose'),
    dice = require('./dice'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// define schema
var Post = new Schema({
    body: String,
    type: {type: String, index: true },
    when: Date,
    rolls: {},
    characterId: ObjectId,
    characterName: {type: String, index: true },
    authorId: ObjectId,
    campaignId: ObjectId
});

// shared logic for post instances
var types = {
  say: function() {},
  think: function() {},
  move: function() {},
  ooc: function() {},
  minor: function() {},
  standard: function() {},
  roll: function(post) {
    var roll = dice.convertRolls(post);
    return {
      body: roll.body,
      rolls: roll.results 
      };
    }
};

// define methods
Post.method({
  parse: function (incoming) {
    var re = /\b([a-z]+)\b/i;
    var m = re.exec(incoming);
    var type = m ? m[0] : 'narrate';
    var data;

    if(typeof types[type] !== 'undefined') {
      incoming = incoming.replace(re,'');
      //todo: make this conversion more clear
      data = types[type](incoming) || {
        body: incoming.body || incoming,
        rolls: incoming.rolls || {}
      };
    } else {
      type = 'narrate';
      var roll = dice.convertRolls(incoming);
      data = {
        body: roll.body,
        rolls: roll.results 
      };
    }

    this.type = type;
    this.body = data.body.trim();
    this.rolls = data.rolls;
  }
});

Post.path('when')
    .default(function(){
       return new Date();
     });

module.exports = mongoose.model('Post', Post);