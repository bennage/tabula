var horaa = require('horaa');
var assert = require('assert');

// var helper = horaa('../helper');
// helper.hijacking('restrict',function(){
// 	console.log('restrict');
// });

//do the hijacking
var mongoose = horaa('mongoose');
mongoose.hijack('model', function(type) {
    switch(type) {
	case 'User':
	break;
	case 'Post': 
	return {
		count: function(conditions, callback){
			callback(null,100);
		},
		find: function() {
			}
		};
		}
    }
    console.log(type);
});

var controller = require('../controllers/post');


module.exports = {
	
	teardown: function(done){
       // mongoose.disconnect();
       done();
    },

    'the index returns an empty page when no campaign is in the context': function(){
		controller.index[1](
			{ context: {}},
			{ json: function(data){
				assert.equal(0,data.count);
				assert.equal(0,data.page);
				assert.equal(0,data.results.length);
			}});
    },

    'the index returns ...': function(){
    	var campaignId = 999;



		controller.index[1](
			{ context: {
				campaign: { id: campaignId }
			}},
			{ json: function(data){
				assert.equal(0,data.count);
				assert.equal(0,data.page);
				assert.equal(0,data.results.length);
			}});
    },
}