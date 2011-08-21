var express = require('express');

var app = module.exports = express.createServer();

require('./bootstrapper').boot(app);

var port = process.env.PORT || 3000;
app.listen(port);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);