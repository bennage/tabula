var app = require('../app');
var assert = require('assert');

module.exports = {
    'GET /post/new returns 404': function(beforeExit) {
		assert.response(app, {
		  url: '/post/new', 
		  method: 'GET'
		}, { status: 404 });
	}
};