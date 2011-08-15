var config = require('./config');
var mongo = require('mongodb'),
    Db = mongo.Db,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectId;

var Repository = function() {
  var dbname = config.dbname;
  var host = config.host;
  var port = config.port;
  var username = config.username;
  var password = config.password;

  var db = new Db(dbname, new Server(host, port, {auto_reconnect: true}, {}));
  db.open(function(){ 
    console.log('db opened'); 
    db.authenticate(username, password, function(err, p_client) { 
      console.log('authenticated db');
    }); 
  });
  this.db = db;
};

['posts','users'].forEach(function(collection) {
  Repository.prototype[collection] = function(callback) {
      this.db.collection(collection, function(error, posts_collection) {
          if(error) { 
            callback(error); 
          }
          else { 
            callback(null, posts_collection);
          }
      });
  };
});

Repository.prototype.getCollection = function(callback) {
    this.db.collection('posts', function(error, posts_collection) {
        if(error) { 
          callback(error); 
        }
        else { 
          callback(null, posts_collection);
        }
    });
};

Repository.prototype.findAll = function(callback) {
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

Repository.prototype.findById = function(id, callback) {
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

Repository.prototype.save = function(posts, callback) {

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

Repository.prototype.remove = function() {
  this.getCollection(function(error, post_collection) {
    post_collection.remove({});
  });
};
 
module.exports = exports.Repository = Repository;