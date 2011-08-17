var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

require('./Post');

var Character = new Schema({
  name:  {type: String, index: true },
  campaignId: ObjectId,
  profileUrl: String,
  iplay4eKey: String,
  userId: ObjectId
});

var User = new Schema({
  name: String,
  facebookId: {type: String, index: true },
  campaigns: [{id:ObjectId, name:String}],
  characters: [{id:ObjectId, name:String}]
});

var Campaign = new Schema({
    title: String,
    master: ObjectId,
    users: [ObjectId],
    characters: [ObjectId]
});

mongoose.model('User', User);
mongoose.model('Campaign', Campaign);
mongoose.model('Character', Character);