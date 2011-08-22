var mongoose = require('mongoose');
var Character = mongoose.model('Character');
var User = mongoose.model('User');

module.exports = {

    add: function(req,res) {
      res.render('character/new.jade', { character: new Character() });
    },

    create: function(req,res) {
      var character = new Character();
      var property;

      for(property in req.body.character) {
        character[property] = req.body.character[property];
      }

      character.save(function(e,data){
        User.findById(req.session.user._id, function(err, user) {
          user.characters.push( data );
          user.save();
          res.redirect('/');
        });
      });
    },

    show: function(req,res) {
      Character.findById(req.params.id, function(e,character) {
          if(!character) {
            res.render(404);            
          } else {
            res.render('character/show', { character: character });
          }
      });
    }
};