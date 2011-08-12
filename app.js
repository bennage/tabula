
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

var types = {
  say: function() {},
  think: function() {},
  move: function() {},
  roll: roll,
  d: roll
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

function roll(dice)
{
    dice = dice.replace(/- */,'+ -');
    dice = dice.replace(/D/,'d');

    var re = / *\+ */;
    var items = dice.split(re);
    var res = [];
    var type = [];

    items.forEach(function(item) {
        var match = item.match(/^[ \t]*(-)?(\d+)?(?:(d)(\d+))?[ \t]*$/);
        if (match) {
            var sign = match[1]?-1:1;
            var num = parseInt(match[2] || "1", 10);
            var max = parseInt(match[4] || "0", 10);
            if (match[3]) {
                for ( j=1; j<=num; j++) {
                    res[res.length] = sign * Math.ceil(max*Math.random());
                    type[type.length] = max;
                }
            }
            else {
                res[res.length] = sign * num;
                type[type.length] = 0;
            }
        } 
        else {
          return null;
        }
    });

    if (res.length === 0) {
      return null;
    }
    return res + ' ' + type;
}


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);