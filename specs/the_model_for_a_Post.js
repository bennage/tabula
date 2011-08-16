var Post = require('../models/Post');

exports['Post can process "say" actions'] = function(test){
    test.expect(2);

    var post = new Post();
    post.parse('say What did you say?')
    test.equal('say', post.type);
    test.equal('What did you say?', post.body);
    test.done();
};

exports['Post can process "move" actions'] = function(test){
    test.expect(2);

    var post = new Post();
    post.parse('move to L4')
    test.equal('move', post.type);
    test.equal('to L4', post.body);
    test.done();
};


exports['Post can process "think" actions'] = function(test){
    test.expect(2);

    var post = new Post();
    post.parse('think happy thoughts!')
    test.equal('think', post.type);
    test.equal('happy thoughts!', post.body);
    test.done();
};

exports['Post can process "narrate" actions'] = function(test){
    test.expect(2);

    var post = new Post();
    post.parse('Magic Horse goes for a walk.')
    test.equal('narrate', post.type);
    test.equal('Magic Horse goes for a walk.', post.body);
    test.done();
};

exports['A new post time is set to now.'] = function(test){
    test.expect(1);

    var post = new Post();
    var now = new Date();
    var delta = post.when - now;
    test.equal(0, delta);
    test.done();
};

