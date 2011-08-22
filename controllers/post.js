var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = {

    index: function(req, res){
      Post.find({}, function(error,docs){ 
        res.json(docs.reverse()); 
      });
    },

    create: function(req, res) {
        var campaignId = req.params.campaignId;
        var characterId = req.params.characterId;

        var post = new Post();
        post.parse(req.body.post);

        post.campaignId = campaignId;
        post.characterId = characterId;

        post.save(function(e,data) {
            res.json(data);
        });
    },

    '/posts/clear': function(req, res){
      Post.collection.remove({}, function(e){
        console.dir(e);
      });
    },

    'get /posts/sample': [
      function(req,res, next) {
        console.log('1');
        next();
      },
      function(req,res) {
        console.log('2');
        res.render(500);
      }
    ]

};