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

var CharacterSummary = new Schema({
  name: String,
  characterId: ObjectId
});

var User = new Schema({
  name: String,
  loginId: {type: String, index: true },
  campaigns: [CharacterSummary],
  characters: [Character]
});

var Campaign = new Schema({
    name: String,
    masterId: ObjectId,
    users: [ObjectId],
    characters: [ObjectId]
});

var Scene = new Schema({
  name: String,
  description: String,
  began: Date,
  ended: Date,
  imageUrl: String,
  campaignId: ObjectId
});

Scene.path('began')
    .default(function(){
       return new Date();
     });

mongoose.model('User', User);
mongoose.model('Campaign', Campaign);
mongoose.model('Character', Character);
mongoose.model('Scene', Scene);