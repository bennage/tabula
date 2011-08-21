var fs = require('fs');
var express = require('express');

var everyauth = require('everyauth');
var mongoose = require('mongoose');
var models = require('./models/schema');

var config = require('./config');

var connectionString = process.env['MONGOHQ_URL'] ||'mongodb://localhost/tabula';
mongoose.connect(connectionString);

exports.boot = function(app){
  bootApplication(app);
  bootControllers(app);
};

// App settings and middleware

function configureAuth(app) {
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

  // mixin view helpers for everyauth
  everyauth.helpExpress(app);
}

function bootApplication(app) {

  configureAuth(app);
  
  app.configure('development', function(){
    app.use(express.logger('tiny'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  });

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

  app.configure('production', function(){
    app.use(express.errorHandler()); 
  });

  // // Example 500 page
  // app.use(function(err, req, res, next){
  //   res.render('500');
  // });

  // // Example 404 page via simple Connect middleware
  // app.use(function(req, res){
  //   res.render('404');
  // });

  // Some dynamic view helpers
  // app.dynamicHelpers({
  //   request: function(req){
  //     return req;
  //   },

  //   hasMessages: function(req){
  //     if (!req.session) return false;
  //     return Object.keys(req.session.flash || {}).length;
  //   },

  //   messages: function(req){
  //     return function(){
  //       var msgs = req.flash();
  //       return Object.keys(msgs).reduce(function(arr, type){
  //         return arr.concat(msgs[type]);
  //       }, []);
  //     }
  //   }
  // });
}

// Bootstrap controllers

function bootControllers(app) {
  fs.readdir(__dirname + '/controllers', function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      console.log('loading controller: ' + file);
      bootController(app, file);
    });
  });
}

// Example (simplistic) controller support

function bootController(app, file) {
  var name = file.replace('.js', '')
    , actions = require('./controllers/' + name)
    , plural = name + 's' // realistically we would use an inflection lib
    , prefix = '/' + plural; 

  // Special case for "app"
  if (name == 'app') prefix = '/';

  Object.keys(actions).map(function(action){
    //todo: examine the 'magic' here
    // var fn = controllerAction(name, plural, action, actions[action]);
    var fn = actions[action];
    switch(action) {
      case 'index':
        app.get(prefix, fn);
        break;
      case 'show':
        app.get(prefix + '/:id.:format?', fn);
        break;
      case 'add':
        app.get(prefix + '/:id/add', fn);
        break;
      case 'create':
        app.post(prefix + '/:id', fn);
        break;
      case 'edit':
        app.get(prefix + '/:id/edit', fn);
        break;
      case 'update':
        app.put(prefix + '/:id', fn);
        break;
      case 'destroy':
        app.del(prefix + '/:id', fn);
        break;
      default:
        console.log('custom ' + action);
        app.get(action, fn);
        break;
    }
  });
}

// Proxy res.render() to add some magic

function controllerAction(name, plural, action, fn) {
  return function(req, res, next){
    var render = res.render
      , format = req.params.format
      , path = __dirname + '/views/' + name + '/' + action + '.html';
    res.render = function(obj, options, fn){
      res.render = render;
      // Template path
      if (typeof obj === 'string') {
        return res.render(obj, options, fn);
      }

      // Format support
      if (action == 'show' && format) {
        if (format === 'json') {
          return res.send(obj);
        } else {
          throw new Error('unsupported format "' + format + '"');
        }
      }

      // Render template
      res.render = render;
      options = options || {};
      // Expose obj as the "users" or "user" local
      if (action == 'index') {
        options[plural] = obj;
      } else {
        options[name] = obj;
      }
      return res.render(path, options, fn);
    };
    fn.apply(this, arguments);
  };
}

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

// var User = mongoose.model('User');
// var Character = mongoose.model('Character');

// app.get('/campaign/new', restrict, function(req,res) {
//   res.render('campaign/new.jade');
// });

// app.get('/character/new', restrict, function(req,res) {
//   res.render('character/new.jade', { character: new Character() });
// });

// app.post('/character/new', function(req, res){

//   var character = new Character();
//   for(var p in req.body.character) {
//     var v = req.body.character[p];
//     character[p] = v;
//   }

//   character.save(function(e,data){
//     if(e) {
//     // todo:    
//     } else {

//       User.findOne({ facebookId: req.session.auth.facebook.user.id}, function(err, user) {
//         user.characters.push( {id: data.id, name: data.name} );
//         user.save();
//       });

//       res.redirect('/');
//     }
//   });
// });