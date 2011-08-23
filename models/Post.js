var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var types = {
  say: function() {},
  think: function() {},
  move: function() {},
  ooc: function() {},
  minor: function() {},
  standard: function() {}
};

var Post = new Schema({
    body: String,
    type: {type: String, index: true },
    when: Date,
    characterId: ObjectId,
    characterName: {type: String, index: true },
    authorId: ObjectId,
    campaignId: ObjectId
});

Post.method({
  parse: function (data) {
    var re = /\b([a-z]+)\b/i;
    var m = re.exec(data);
    var type = m[0];
    
    if(typeof types[type] !== 'undefined') {
      data = data.replace(re,'');
      data = types[type](data) || data;
    } else {
      type = 'narrate';
    }

    this.type = type;
    this.body = data.trim();
  }
});

Post.path('when')
    .default(function(){
       return new Date();
     });

module.exports = mongoose.model('Post', Post);