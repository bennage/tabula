var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
    context: function(req,res,next) {

        var session,
            auth,
            id;

        if(req.context && req.context.user) { return next(); }

        session = req.session;
        req.context = {
        };
        
        if (!session) { return next();}

        auth = session.auth;  
  
        if (!(auth && auth.loggedIn)) { return next(); } 
            
        id = auth.facebook.user.id;

        User.findOne({ facebookId: id}, function(err, user) {

          if(user) {
            req.context.user = user;

            if(!req.context.campaign && user.campaigns.length > 0) {
                req.context.campaign = user.campaigns[0];
            }

            if(!req.context.character && user.characters.length > 0) {
                req.context.character = user.characters[0];
            }
          }

          next();
        });
    }
};