var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

function restrict(req, res, next) {
  var auth = req.session.auth;  
  if (auth && auth.loggedIn) {
    next();
  } else {
    //todo: handle json
    req.flash('error','Access denied');
    req.session.error = 'Access denied!';
    res.redirect('login');
  }
}

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
      restrict,
      function(req,res) {
        console.log('2');
        res.render(500);
      }
    ]

};