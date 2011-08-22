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

  app.redirect('login','/');

  // // Example 500 page
  // app.use(function(err, req, res, next){
  //   res.render('500');
  // });

  // // Example 404 page via simple Connect middleware
  // app.use(function(req, res){
  //   res.render('404');
  // });

  // Some dynamic view helpers
  app.dynamicHelpers({
    request: function(req){
      return req;
    },

    hasMessages: function(req){
      if (!req.session) return false;
      return Object.keys(req.session.flash || {}).length > 0;
    },

    messages: function(req){
        var flashes = req.flash();
        var agg = Object.keys(flashes).reduce(function(accum, type){
            var flattened = flashes[type].map(function(item){
              return { type: type, content: item };
            });
          return accum.concat(flattened);
        }, []);
        return agg;
    }
  });
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
        // if there is a space, the first part is the verb,
        // followed by the route
        // otherwise it's just the route
        var parts = action.split(' ');
        var verb = 'post';
        var route = action;
        if(parts.length === 2) {
          verb = parts[0];
          route = parts[1];
        }

        interpretAction(app, verb, route, fn);
        break;
    }
  });
}

function interpretAction(app, verb, route, functions) {
  console.log('custom ' + verb + ': ' + route);

  // ensure that we have an array of functions 
  // (to allow for middleware)
  if(!Array.isArray(functions)){
    functions = [functions];
  }
  
  // prepend the route
  functions.splice(0,0,route);

  app[verb].apply(app, functions);
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