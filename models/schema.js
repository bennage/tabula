var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

require('./Post');

var Character = new Schema({
  name: String,
  campaignId: ObjectId,
  profileUrl: String,
  iplay4eKey: String
});

var User = new Schema({
  name: {
    first: String,
    last : String
  },
  facebookId: String,
  campaigns: [ObjectId],
  characters: [ObjectId]
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