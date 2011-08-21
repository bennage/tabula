// var mongoose = require('mongoose');
// var User = mongoose.model('User');
// var Post = mongoose.model('Post');

// app.post('/post/new', function(req, res){
//     var post = new Post();
//     post.parse(req.body.post);

//     post.save(function(e,data){
//     // debugger;
//       if(e) {
//       // todo:    
//       } else {
//         res.json(data);
//       }
//     });
// });

// app.post('/post/clear', function(req, res){
//   Post.collection.remove({}, function(e){
//     console.dir(e);
//   });
// });

// app.get('/stream', function(req, res){
//   console.log('/stream');
//   res.end();
//   // Post.find({}, function(error,docs){ 
//   // // debugger;
//   //   res.json(docs.reverse()); 
//   // });
// });
