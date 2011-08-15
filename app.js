/**
 * Module dependencies.
 */
var express = require('express');
var auth = require('everyauth');
var mongoose = require('mongoose');
var models = require('./models/schema');

var Post = mongoose.model('Post');

var config = require('./config');

var connectionString = process.env['MONGOHQ_URL'] ||'mongodb://localhost/tabula';
mongoose.connect(connectionString);

var app = module.exports = express.createServer();

auth.debug = true;

auth.everymodule.findUserById( function(id,callback){
  debugger;
  callback(null, usersById[id]);
});  

auth.facebook
  .appId(config.fb.appId)
  .appSecret(config.fb.appSecret)
  .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata){
      debugger;
      return {};
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
  app.use(auth.middleware());
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
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

// Routes
app.post('/post/new', function(req, res){
    var post = new Post();
    post.parse(req.body.post);

    post.save(function(e){
      console.dir(e);
    });

    res.json(post);
});

app.post('/post/clear', function(req, res){
  Post.collection.remove({});
});

app.get('/stream', function(req, res){
  Post.find({}, function(error,docs){ res.json(docs.reverse()); });
});

// load up routes
require('./boot')(app);

// mixin view helpers for auth
auth.helpExpress(app);

// start listening
var port = process.env.PORT || 3000;
app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);