var helper = require('../helper');

module.exports = {
    
    index: [
      helper.context,
      function(req, res){
        
        var locals = {};
        var context = req.context;

        if(context && context.user) {
          locals = {
            campaigns: context.user.campaigns,
            characters: context.user.characters,
            campaign: context.campaign,
            character: context.character
          };
        }

        res.render('index.jade', { 
          locals: locals
        });
      }
    ],

    'get /hello': [
    require('../helper').context,
    function(req,res) {
      res.send(507);
      res.end();
    }
    ]
};