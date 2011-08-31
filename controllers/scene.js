// var mongoose = require('mongoose');
// var Scene = mongoose.model('Scene');
// var helper = require('../helper');

// module.exports = {

//     add: function(req,res) {
//       res.render('scene/new.jade', { scene: new Scene() });
//     },

//     create: [
//       helper.restrict,
//       function(req,res) {
//         var scene = new Scene();
//         var property;

//         for(property in req.body.scene) {
//           scene[property] = req.body.scene[property];
//         }

//         scene.campaignId = req.context.campaign;

//         scene.save(function(e,data){
//             res.redirect('/');
//           });
//         });
//       }
//     ]
// };