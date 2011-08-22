var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');
var Character = mongoose.model('Character');
var User = mongoose.model('User');

module.exports = {
	
	add: function(req,res) {
	  res.render('campaign/new.jade', { campaign: new Campaign() });
	},

    create: function(req,res) {
      var campaign = new Campaign();
      var property;

      debugger;
      for(property in req.body.campaign) {
        campaign[property] = req.body.campaign[property];
      }

      campaign.save(function(e,data){
        var facebookId = req.session.auth.facebook.user.id;
        User.findOne({ facebookId: facebookId}, function(err, user) {
          user.campaigns.push( data );
          user.save();
        });
        res.redirect('/campaigns/' + data.id);
      });
    },

    show: function(req,res) {
      Campaign.findById(req.params.id, function(e,campaign) {
          if(!campaign) {
            res.render(404);            
          } else {
            res.render('campaign/show', { campaign: campaign });
          }
      });
    }

}