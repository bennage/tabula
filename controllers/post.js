var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var helper = require('../helper');

var pageSize = 5;

module.exports = {

    index: [
      helper.restrict,
      helper.context,
      function(req, res){
        
        if(!req.context.campaign) {
          
          res.json({
                  count: 0,
                  pageSize: 0,
                  page: 0,
                  results: []
                }); 
          return;
        }

        var id = req.context.campaign.id;
        var page = req.params.page || 1;
        var conditions = {campaignId:id};
        var skip = (page -1) * pageSize;
        
        Post.count(conditions, function(error, count) {
          Post.find(conditions)
            .desc('when')
            .skip(skip)
            .limit(pageSize)
            .exec(function(error,docs){ 
                if(error) {
                  console.dir(error);
                }
                res.json({
                  count: count,
                  pageSize: pageSize,
                  page: page,
                  results: docs
                }); 
              });
        })
      }
    ],

    create: [
      helper.restrict,
      helper.context,
      function(req, res) {
          var context = req.context;

          if(!(context.campaign && context.character)) {
            // send not authorized
            res.send(403);
            return;
          }

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