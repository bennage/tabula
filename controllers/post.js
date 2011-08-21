var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

module.exports = {

    index: function(req, res){
      Post.find({}, function(error,docs){ 
      // debugger;
        res.json(docs.reverse()); 
      });
    },

    create: function(req, res) {
        var post = new Post();
        post.parse(req.body.post);
        post.save(function(e,data) {
            res.json(data);
        });
    },

    '/posts/clear': function(req, res){
      Post.collection.remove({}, function(e){
        console.dir(e);
      });
    }

};