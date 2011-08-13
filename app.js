
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
  // debugger;
  callback(null, usersById[id]);
});  

everyauth.facebook
  .appId(fb.appId)
  .appSecret(fb.appSecret)
  .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata){
      // debugger;
      return {};
  })
  .redirectPath('/');

everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
//    .loginLocals({
//      title: 'Login'
//    })
//    .loginLocals(function (req, res) {
//      return {
//        title: 'Login'
//      }
//    })
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
      if (errors.length) return errors;
      var user = usersByLogin[login];
      if (!user) return ['Login failed'];
      if (user.password !== password) return ['Login failed'];
      return user;
    })

    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
      var login = newUserAttrs[this.loginKey()];
      return usersByLogin[login] = addUser(newUserAttrs);
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(everyauth.middleware());
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

// everyauth.helpExpress(app);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);