var horaa = require('horaa');
var assert = require('assert');

function mockQuery() { 
}

mockQuery.prototype.find = function(criteria) {
	this.criteria = criteria;
	return this;
};

mockQuery.prototype.skip = function(count) {
	this.skip = count;
	return this;
};

mockQuery.prototype.limit = function(count) {
	this.limit = count;
	return this;
};

mockQuery.prototype.desc = function(property) {
	this.desc = property;
	return this;
};

mockQuery.prototype.count = function(criteria, callback) {
	var howMany = this.howMany || 0; 
	callback(null, howMany);
};

mockQuery.prototype.exec = function(fn) {
	fn(null,[]);
};

//do the hijacking
var mongoose = horaa('mongoose');
mongoose.hijack('model', function(type) {
	return new mockQuery();
});

var controller = require('../controllers/post');
var indexAction = controller.index[1];

module.exports = {
	
	'the index returns an empty page when no campaign is in the context': function(){
		var req = { context: {}};
		indexAction( req,
			{ 
				json: function(data){
					assert.equal(0,data.count);
					assert.equal(0,data.page);
					assert.equal(0,data.results.length);
				}
			});
	},

	'the index returns ...': function(){
		var campaignId = 999;
		var req = {
				context: {
					campaign: { id: campaignId }
				},
				params: {}
			};

		indexAction(req,
			{ 
				json: function(data){
					assert.equal(0,data.count,'broken' +  typeof(data.count));
					assert.equal(1,data.page);
					assert.equal(0,data.results.length);
				}
			});
	},
};