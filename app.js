
/**
 * Module dependencies.
 */

var express = require('express');
var PostProvider = require('./PostProvider').PostProvider;

var posts = new PostProvider('localhost', 27017);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index.jade', { locals: {
        title: 'tabula'
    }
    });
});

app.get('/post/new', function(req, res) {
    res.render('post_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

var types = {
  say: function() {},
  think: function() {},
  move: function() {}
};

function processPost(data) {
  var re = /\b([a-z]+)\b/i;
  var m = re.exec(data);
  var type = m[0];
  
  console.log(type); 

  if(typeof types[type] !== 'undefined') {
    data = 'removed ' + data;
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
          res.redirect('/');
        }        
    });
});

app.post('/post/clear', function(req, res){
  posts.remove();
});

app.get('/stream', function(req, res){
  posts.findAll( function(error,docs){ res.json(docs); });
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);