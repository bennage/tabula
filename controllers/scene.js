var mongoose = require('mongoose');
var Scene = mongoose.model('Scene');
var helper = require('../helper');

module.exports = {

    show: [
        helper.restrict,
	    function(req,res) {
	        Scene.findById(req.params.id, function(e,scene) {
	          if(!scene) {
	            res.render(404);            
	          } else {
	            res.json(scene);
	          }
	      });
	    }
    ]
};