var everyauth = require('everyauth');
var config = require('./config');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.configure = function(app) {

    everyauth.debug = true;

    var facebook = everyauth.facebook.appId(config.fb.appId).appSecret(config.fb.appSecret);
    var google = everyauth.google.appId(config.google.id).appSecret(config.google.secret).scope('https://www.google.com/m8/feeds/');
    //todo: not sure what the scope should really be for google ...

    function findOrCreate(service, id, name, promise) {

        var loginId = service + '::' + id;

        User.findOne({
            loginId: loginId
        }, function(err, result) {
            var user;
            if (!result) {
                user = new User();
                user.loginId = loginId;
                user.name = name;
                user.save();
            } else {
                user = result.doc;
            }
            promise.fulfill(user);
        });
        return promise;
    }

    facebook.findOrCreateUser(function(session, accessToken, extra, meta) {
        return findOrCreate('facebook', meta.id, meta.name, this.Promise());
    }).redirectPath('/');

    google.findOrCreateUser(function(sessoion, accessToken, extra, meta) {
        // meta.refreshToken = extra.refresh_token;
        // meta.expiresIn = extra.expires_in;
        return findOrCreate('google', meta.id, meta.id, this.Promise());
    }).redirectPath('/');

    // mixin view helpers for everyauth
    everyauth.helpExpress(app);

    return everyauth.middleware();
};