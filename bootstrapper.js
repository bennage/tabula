var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var models = require('./models/schema');

var connectionString = process.env['MONGOHQ_URL'] ||'mongodb://localhost/tabula';
mongoose.connect(connectionString);

exports.boot = function(app){
  bootApplication(app);
  bootControllers(app);
};

// App settings and middleware

function bootApplication(app) {

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
    app.use(require('./auth').configure(app));
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
        app.get(prefix + '/add', fn);
        break;
      case 'create':
        app.post(prefix + '/add', fn);
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
        var route = action.split(' ');
        var verb = 'post';
        if(route.length === 2) {
          verb = route[0];
          action = route[1];
        }

        console.log('custom ' + verb + ': ' + action);
console.log(Array.isArray(fn));
        if(!Array.isArray(fn)){
          fn = [fn];
        }
console.log(Array.isArray(fn));
console.log(fn.length);
        fn.splice(0,0,action);
        var args = fn;
console.dir(args);
console.log(args.length);
        app[verb].apply(app, args);
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