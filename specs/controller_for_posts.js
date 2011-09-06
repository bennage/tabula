var horaa = require('horaa');
var assert = require('assert');
var mockQuery = require('./mockModel');

var mongoose = horaa('mongoose');
mongoose.hijack('model', function(type) {
	return new mockQuery();
});

var controller = require('../controllers/post');
var req; // the default requeset object

var indexAction = controller.index[1];

module.exports = {
	
	setup: function(done) {
		req = { 
			context: {},
			params: {}
		};

		mockQuery.reset();
		done();
	},

	'when no campaign is in the context, the index returns an empty page': function(){
		indexAction( req,
			{ 
				json: function(data){
					assert.equal(0,data.count);
					assert.equal(0,data.page);
					assert.equal(0,data.results.length);
				}
			});
	},

	'when a campaign is in the context, the index returns pagination info': function(){
		req.context.campaign = { id: 999 };

		mockQuery.setCount(90);
		mockQuery.setResult(new Array(10));

		indexAction(req,
			{ 
				json: function(data){
					assert.equal(90,data.count);
					assert.equal(1,data.page);
					assert.equal(10,data.pageSize);
					assert.equal(10,data.results.length);
				}
			});
	},

	'when a campaign is in the context, the index returns the total number of posts': function(){
		var postCount = 99;
		req.context.campaign = { id: 999 };

		mockQuery.setCount(postCount);
		// mockQuery.setResult(new Array(10));

		indexAction(req,
			{ 
				json: function(data){
					assert.equal(postCount, data.count);
				}
			});
	}

	// 'when a campaign is in the context, the index returns pagination info': function(){
	// 	req.context.campaign = { id: 999 };
	// 	req.params.page = 1;

	// 	mockQuery.setCount(90);
	// 	mockQuery.setResult(new Array(10));

	// 	indexAction(req,
	// 		{ 
	// 			json: function(data){
	// 				assert.equal(90,data.count);
	// 				assert.equal(1,data.page);
	// 				assert.equal(10,data.pageSize);
	// 				assert.equal(10,data.results.length);
	// 			}
	// 		});
	// },
};