var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var helper = require('../helper');

module.exports = {

    index: [
      helper.restrict,
      helper.context,
      function(req, res){
        Post.find({campaignId:req.context.campaign.id}, function(error,docs){ 
          res.json(docs.reverse()); 
        });
      }
    ],

    create: [
      helper.restrict,
      helper.context,
      function(req, res) {
          var context = req.context;

          var post = new Post();
          post.parse(req.body.post);

          post.campaignId = context.campaign.id;
          post.characterId = context.character.id;
          post.characterName = context.character.name;
          post.authorId = context.user.id;

          post.save(function(e,data) {
              res.json(data);
          });
      }
    ],

    '/posts/clear': [
      helper.restrict,
      function(req, res){
      Post.collection.remove({}, function(e){
          console.dir(e);
        });
      }
    ]
};