var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Scene = new Schema({
  name: String,
  description: String,
  began: Date,
  ended: Date,
  imageUrl: String,
  campaignId: ObjectId
});