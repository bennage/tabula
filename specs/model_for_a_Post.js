var assert = require('assert');
var Post = require('../models/Post');

module.exports = {
    'Post can process "say" actions': function(){
        var post = new Post();
        post.parse('say What did you say?')

        assert.equal('say', post.type);
        assert.equal('What did you say?', post.body);
    },

    'Post can process "move" actions': function(){
        var post = new Post();
        post.parse('move to L4')

        assert.equal('move', post.type);
        assert.equal('to L4', post.body);
    },

    'Post can process "think" actions': function(){
        var post = new Post();
        post.parse('think happy thoughts!');

        assert.equal('think', post.type);
        assert.equal('happy thoughts!', post.body);
    },

    'Post can process "narrate" actions': function(){
        var post = new Post();
        post.parse('Magic Horse goes for a walk.')

        assert.equal('narrate', post.type);
        assert.equal('Magic Horse goes for a walk.', post.body);
    },

    'trims the body when processing an action': function(){
        var post = new Post();
        post.parse('say this has an extra space ')

        assert.equal('say', post.type);
        assert.equal('this has an extra space', post.body);
    },

    'A new post time is set to now.': function(){
        var post = new Post();
        var now = new Date();
        var delta = post.when - now;

        assert.equal(0, delta);
    }
}