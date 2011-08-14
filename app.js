/**
 * Module dependencies.
 */

var express = require('express');
var auth = require('everyauth');
var PostProvider = require('./PostProvider').PostProvider;
//staff.mongohq.com:10018/app745452
var posts = new PostProvider('app745452','staff.mongohq.com', 10018);
console.log('MONGOHQ_URL ' + process.env['MONGOHQ_URL']); 

var app = module.exports = express.createServer();

// auth stuff
var fb = {
  appId : '12373185169',
  appSecret: 'b990335e26ff08a408bb7ebff709f584'
};

auth.debug = true;

auth.everymodule.findUserById( function(id,callback){
  debugger;
  callback(null, usersById[id]);
});  

auth.facebook
  .appId(fb.appId)
  .appSecret(fb.appSecret)
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
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(auth.middleware());
});

app.configure('development', function(){
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  var a = req.session.auth;
  if(a){
    console.log(a.facebook.user.id);
  }
    res.render('index.jade', { locals: {
        title: 'tabula'
    }
    });
});

app.post('/post/new', function(req, res){
    var post = PostProvider.processPost(req.body.post); 

    posts.save(post, function( error, docs) {
        if(error) {
          console.log( 'error while saving' );
        } else {
          res.json(post);
        }        
    });
});

app.post('/post/clear', function(req, res){
  posts.remove();
});

app.get('/stream', function(req, res){
  posts.findAll( function(error,docs){ res.json(docs); });
});

auth.helpExpress(app);
var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);