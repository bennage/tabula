/**
 * Module dependencies.
 */

var express = require('express');
var everyauth = require('everyauth');
var PostProvider = require('./PostProvider').PostProvider;

var posts = new PostProvider('localhost', 27017);

var app = module.exports = express.createServer();

// everyauth stuff
var fb = {
  appId : '12373185169',
  appSecret: 'b990335e26ff08a408bb7ebff709f584'
};

everyauth.debug = true;

everyauth.everymodule.findUserById( function(id,callback){
  debugger;
  callback(null, usersById[id]);
});  

everyauth.facebook
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
  app.use(everyauth.middleware());
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
    res.render('index.jade', { locals: {
        title: 'tabula',
        session: res.session
    }
    });
});

var types = {
  say: function() {},
  think: function() {},
  move: function() {},
};

function processPost(data) {
  var re = /\b([a-z]+)\b/i;
  var m = re.exec(data);
  var type = m[0];
  
  console.log(type); 

  if(typeof types[type] !== 'undefined') {
    data = data.replace(re,'');
    data = types[type](data) || data;
  } else {
    type = 'narrate';
  }

  return {
    type: type,
    body: data,
    when: new Date()
  };
}

app.post('/post/new', function(req, res){
    var post = processPost(req.body.post); 

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

everyauth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);