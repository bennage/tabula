var vm = require('vm'),
    fs = require('fs');

module.exports = function(app, mongoose){

  var dir = __dirname + '/routes';
  console.log('looking for routes in ' + dir);

  fs.readdirSync(dir).forEach(function(file) {
    console.log('   found ' + file);

    var str = fs.readFileSync(dir + '/' + file, 'utf8'),
        context = { app: app, mongoose: mongoose },
        key;
    // copy the global context (and extend it)
    for (key in global) {
      context[key] = global[key];
    }

    vm.runInNewContext(str, context, file);
  });
};