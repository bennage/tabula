var mongoose = require('mongoose');
var User = mongoose.model('User');

var c = module.exports = function(app) {

	app.get('/', function(req, res){
	  
	  var locals = {};
	  var render = function() {
	      res.render('index.jade', { 
	        locals: locals
	      });
	    };

	  var auth = req.session.auth;  
	  if (auth && auth.loggedIn) { 
	    var id = auth.facebook.user.id;

	    User.findOne({ facebookId: id}, function(err, user) {
	      if(user) {
	        if(user.campaigns) {
	          locals.campaigns = user.campaigns;
	        }
	        if(user.characters) {
	          locals.characters = user.characters;
	        }
	      }
	      render();

	    });
	  } else {
	    render();    
	  }
	});
}