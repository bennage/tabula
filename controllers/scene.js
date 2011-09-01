var mongoose = require('mongoose');
var Scene = mongoose.model('Scene');
var helper = require('../helper');

module.exports = {

    'get /scenes/current': [
        helper.restrict,
        function(req,res) {
            
            var campaignId = req.context.campaign.id;
            Scene.find({campaignId:campaignId})
            .desc('began')
            .limit(1)
            .exec(function(e,scenes) {
              if(!scenes) {
                res.render(404);
              } else {
                res.json(scenes[0]);
              }
          });
        }
    ]
};