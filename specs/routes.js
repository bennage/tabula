// var app = require('../app');
// var assert = require('assert');

// module.exports = {

// // these cause the test runner to hang
// // however, Ctrl+C continues
// // I think that somehow the runner needs to tell the app to quit
    
//     'GET /post/new returns 404': function() {
// 		assert.response(app, {
// 		  url: '/post/new', 
// 		  method: 'GET'
// 		}, { status: 404 });
// 	},

// 	'GET /stream returns stuff': function() {
// 		assert.response(app, {
// 		  url: '/stream', 
// 		  method: 'GET'
// 		}, { status: 404 });

// 	}
// };