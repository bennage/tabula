var assert =require('assert');

var Post = require('../models/Post');

module.exports = {
    'Post can process "say" actions': function(){
        var post = new Post();
        post.parse('say What did you say?')

        assert.eql('say', post.type);
        assert.eql('What did you say?', post.body);
    },

    'Post can process "move" actions': function(){
        var post = new Post();
        post.parse('move to L4')

        assert.eql('move', post.type);
        assert.eql('to L4', post.body);
    },

    'Post can process "think" actions': function(){
        var post = new Post();
        post.parse('think happy thoughts!');

        assert.eql('think', post.type);
        assert.eql('happy thoughts!', post.body);
    },

    'Post can process "narrate" actions': function(){
        var post = new Post();
        post.parse('Magic Horse goes for a walk.')

        assert.eql('narrate', post.type);
        assert.eql('Magic Horse goes for a walk.', post.body);
    },

    'trims the body when processing an action': function(){
        var post = new Post();
        post.parse('say this has an extra space ')

        assert.eql('say', post.type);
        assert.eql('this has an extra space', post.body);
    },

    'A new post time is set to now.': function(){
        var post = new Post();
        var now = new Date();
        var delta = post.when - now;

        assert.eql(0, delta);
    }
}