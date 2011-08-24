var assert = require('assert');
var mongoose = require('mongoose');
var schema = require('../models/schema');
var controller = require('../controllers/post');

module.exports = {
	
	teardown: function(done){
       mongoose.disconnect();
       done();
    },

    'the index returns a set of posts': function(){
		//todo: how can I mock out mongoose? or Post?   
		assert.ok(true);     
    },
}