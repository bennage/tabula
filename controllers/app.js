var helper = require('../helper');

module.exports = {
    
    index: [
      helper.context,
      function(req, res){
        res.render('index');
      }
    ],
};