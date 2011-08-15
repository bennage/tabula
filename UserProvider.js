var mongo = require('mongodb'),
    Db = mongo.Db,
    Server = mongo.Server,
    BSON = mongo.BSON,
    ObjectID = mongo.ObjectId;


var UserProvider = function(dbname, host, port) {
  var db = new Db(dbname, new Server(host, port, {auto_reconnect: true}, {}));
  db.open(function(){ 
    console.log('db opened'); 
    db.authenticate('tabula', 'rollAd6', function(err, p_client) { 
      console.log('authenticated db');
    }); 
  });
  this.db = db;
};


UserProvider.prototype.getCollection = function(callback) {
    this.db.collection('users', function(error, collection) {
        if(error) { 
          callback(error); 
        }
        else { 
          callback(null, collection);
        }
    });
};

UserProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
        if(error) { 
          callback(error); 
        }
        else {
            collection.find().toArray(function(error, results) {
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

UserProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) {
        callback(error);
      }
      else {
        collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
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

UserProvider.prototype.save = function(users, callback) {

    this.getCollection(function(error, collection) {

      if( error ) {
        callback(error);
      } else {
        
        if( typeof users.length === "undefined") {
          users = [users];
        }
          
        users.forEach(function(user){
          user.created_at = new Date();
        });

        collection.insert(users, function() {
          callback(null, users);
        });
      }
    });

};

UserProvider.prototype.remove = function() {
  this.getCollection(function(error, collection) {
    collection.remove({});
  });
};
 
exports.UserProvider = UserProvider;