/**
 * Module dependencies.
 */
var express = require('express');
var everyauth = require('everyauth');
var mongoose = require('mongoose');
var models = require('./models/schema');

var config = require('./config');

var connectionString = process.env['MONGOHQ_URL'] ||'mongodb://localhost/tabula';
mongoose.connect(connectionString);

var app = module.exports = express.createServer();

everyauth.debug = true;

// everyauth.everymodule.findUserById( function(id,callback){
//   debugger;
//   callback(null, usersById[id]);
// });  

everyauth.facebook
  .appId(config.fb.appId)
  .appSecret(config.fb.appSecret)
  .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata){
      var id = fbUserMetadata.id;
      var promise = this.Promise();
      User.findOne({ facebookId: id}, function(err, result) {
        var user;
        if(!result) {
          user = new User();
          user.facebookId = id;
          user.name = fbUserMetadata.name;
          user.save();
        } else {
          user = result.doc;
        }
        promise.fulfill(user);
      });
      return promise;
  })
  .redirectPath('http://whatsbetween.us:3000');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.favicon());
  app.use(express.cookieParser());  
  app.use(express.session({secret:'bennage'}));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  app.use(everyauth.middleware());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function restrict(req, res, next) {
  var auth = req.session.auth;  
  if (auth && auth.loggedIn) {
    next();
  } else {
    //todo: handle json
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// load up routes
// require('./boot')(app, mongoose);
//
var Post = mongoose.model('Post');
var User = mongoose.model('User');
var Character = mongoose.model('Character');

app.get('/', function(req, res){
  
  var locals = {};
  var render = function() {
      res.render('index.jade', { 
        locals: locals
      });
    };

  var auth = req.session.auth;  
  if (auth && auth.loggedIn) { 
    var id = auth.facebook.user.id;

    User.findOne({ facebookId: id}, function(err, user) {
      if(user) {
        if(user.campaigns) {
          locals.campaigns = user.campaigns;
        }
        if(user.characters) {
          locals.characters = user.characters;
        }
      }
      render();

    });
  } else {
    render();    
  }
});

app.get('/campaign/new', restrict, function(req,res) {
  res.render('campaign/new.jade');
});

app.get('/character/new', restrict, function(req,res) {
  res.render('character/new.jade', { character: new Character() });
});

app.post('/character/new', function(req, res){

  var character = new Character();
  for(var p in req.body.character) {
    var v = req.body.character[p];
    character[p] = v;
  }

  character.save(function(e,data){
    if(e) {
    // todo:    
    } else {

      User.findOne({ facebookId: req.session.auth.facebook.user.id}, function(err, user) {
        user.characters.push( {id: data.id, name: data.name} );
        user.save();
      });


      res.redirect('/');
    }
  });

  

    
    
});

app.post('/post/new', function(req, res){
    var post = new Post();
    post.parse(req.body.post);

    post.save(function(e,data){
      if(e) {
      // todo:    
      } else {
        res.json(data);
      }
    });
});

app.post('/post/clear', function(req, res){
  Post.collection.remove({}, function(e){
    console.dir(e);
  });
});

app.get('/stream', function(req, res){
  Post.find({}, function(error,docs){ 
    res.json(docs.reverse()); 
  });
});

// mixin view helpers for everyauth
everyauth.helpExpress(app);

// start listening
var port = process.env.PORT || 3000;
app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);