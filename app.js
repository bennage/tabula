
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
    posts.findAll( function(error,docs){
        res.render('index.jade', { 
            locals: {
                title: 'tabula',
                stream:docs
            }
        });
    });
});

app.get('/post/new', function(req, res) {
    res.render('post_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.post('/post/new', function(req, res){
    console.log('trying to save');
    posts.save({
        type: 'say',
        body: 'hello world'
    }, function( error, docs) {
        res.redirect('/');
    });
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
