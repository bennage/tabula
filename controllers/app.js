var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    
    index: function(req, res){
      
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
            locals.campaigns = user.campaigns;
            locals.characters = user.characters;
          }
          render();

        });
      } else {
        render();    
      }
    }
};