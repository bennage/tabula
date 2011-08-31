var jade = require('jade');

module.exports.initialize = function(app) {

  app.dynamicHelpers({
    request: function(req){
      return req;
    },

    isMaster: function(req){
      return (req.context && req.context.isMaster);
    },

    user: function(req) {
      return (req.context && req.context.user)
        ? req.context.user
        : null;
    },

    currentCharacter: function(req) {
      return (req.context && req.context.character)
        ? req.context.character
        : null;
    },

    currentCampaign: function(req) {
      return (req.context && req.context.campaign)
        ? req.context.campaign
        : null;
    },

    hasMessages: function(req){
      if (!req.session) { return false; }
      return Object.keys(req.session.flash || {}).length > 0;
    },

    messages: function(req){
        var flashes = req.flash();
        var agg = Object.keys(flashes).reduce(function(accum, type){
            var flattened = flashes[type].map(function(item){
              return { type: type, content: item };
            });
          return accum.concat(flattened);
        }, []);
        return agg;
    }
  });
};