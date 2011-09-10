var everyauth = require('everyauth');
var config = require('./config');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.configure = function(app) {

    everyauth.debug = true;

    // everyauth.everymodule.findUserById( function(id,callback){
    //   debugger;
    //   callback(null, usersById[id]);
    // });  
    everyauth.facebook.appId(config.fb.appId).appSecret(config.fb.appSecret).findOrCreateUser(function(session, accessToken, accessTokenExtra, fbUserMetadata) {
        var id = fbUserMetadata.id;
        var promise = this.Promise();
        User.findOne({
            facebookId: id
        }, function(err, result) {
            var user;
            if (!result) {
                user = new User();
                user.facebookId = id;
                user.name = fbUserMetadata.name;
                user.save();
            } else {
                user = result.doc;
            }
            promise.fulfill(user);
        });
        return promise;
    }).redirectPath('/');

    everyauth.openid.findOrCreateUser(function(session, userMetadata) {
        var id = userMetadata.claimedIdentifier;
        var promise = this.Promise();
        User.findOne({
            openId: id
        }, function(err, result) {
            var user;
            debugger;
            if (!result) {
                user = new User();
                user.openId = id;
                user.name = userMetadata.name;
                user.save();
            } else {
                user = result.doc;
            }
            promise.fulfill(user);
        });
        return promise;

        return usersByOpenId[userMetadata.claimedIdentifier] || (usersByOpenId[userMetadata.claimedIdentifier] = addUser('openid', userMetadata));
    }).redirectPath('/');

    // mixin view helpers for everyauth
    everyauth.helpExpress(app);

    return everyauth.middleware();
};