var mongoose = require('mongoose');
var Campaign = mongoose.model('Campaign');
var Character = mongoose.model('Character');
var User = mongoose.model('User');
var helper = require('../helper');

module.exports = {
  
    add: function(req,res) {
      res.render('campaign/new.jade', { campaign: new Campaign() });
    },

    create: [
      helper.restrict,
      function(req,res) {
      var campaign = new Campaign();
      var property;
      var userId = req.context.user.id;

      for(property in req.body.campaign) {
        campaign[property] = req.body.campaign[property];
      }

debugger;
      campaign.masterId = userId.toString();

      campaign.save(function(e,data){
        User.findById(userId, function(err, user) {
          user.campaigns.push( data );
          user.save();
        });
        res.redirect('/campaigns/' + data.id);
      });
    }],

    'get /campaigns/join': [
      helper.restrict,
      function(req,res) {
        Campaign.find({}, function(error, docs) {
          res.render('campaign/index', { campaigns: docs } );
        });
      }
    ],

    'get /campaigns/join/:id' : [
      helper.restrict,
      function(req,res) {
        Campaign.findById(req.params.id, function(e,campaign) {
          if(!campaign) {
            res.render(404);            
          } else {
            var userId = req.context.user.id;
            campaign.users.push(userId);
            campaign.save();

            User.findById(userId, function(err, user) {
              if(!user.campaigns.some(function(candidate){ return candidate.id === campaign.id; })){
                user.campaigns.push( campaign );
                user.save();
              }
            });
            res.redirect('home');
          }
        });
      }
    ],

  show: function(req,res) {
      Campaign.findById(req.params.id, function(e,campaign) {
          if(!campaign) {
            res.render(404);            
          } else {
            res.render('campaign/show', { campaign: campaign });
          }
      });
    },

};