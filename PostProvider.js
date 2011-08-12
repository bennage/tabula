var mongo = require('mongodb'),
    Db = mongo.Db,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectId;

var PostProvider = function(host,port) {
    this.db = new Db('tabula', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){ console.log('db opened'); });
};

PostProvider.prototype.getCollection = function(callback) {
    this.db.collection('posts', function(error, posts_collection) {
        if(error) { 
          callback(error); 
        }
        else { 
          callback(null, posts_collection);
        }
    });
};

PostProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, posts_collection) {
        if(error) { 
          callback(error); 
        }
        else {
            posts_collection.find().sort({when:1}).toArray(function(error, results) {
                if(error) {
                 callback(error);
                }
                else { 
                  callback(null, results); 
                }
            });
        }
    });
};

PostProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, post_collection) {
      if( error ) {
        callback(error);
      }
      else {
        post_collection.findOne({_id: post_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) {
            callback(error);  
          } 
          else {
            callback(null, result);
          }
        });
      }
    });
};

PostProvider.prototype.save = function(posts, callback) {

    this.getCollection(function(error, post_collection) {

      if( error ) {
        callback(error);
      } else {
        
        if( typeof posts.length === "undefined") {
          posts = [posts];
        }
          
        posts.forEach(function(post){
          post.created_at = new Date();
        });

        post_collection.insert(posts, function() {
          callback(null, posts);
        });
      }
    });

};

PostProvider.prototype.remove = function() {
  this.getCollection(function(error, post_collection) {
    post_collection.remove({});
  });
};
 
exports.PostProvider = PostProvider;