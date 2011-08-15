// var Post = mongoose.model('Post');

// app.post('/post/new', function(req, res){
//     var post = new Post();
//     post.parse(req.body.post);

//     post.save(function(e,data){
//       if(e) {
//     	// todo:  	
//       } else {
// 	      res.json(post);
//       }
//     });
// });

// app.post('/post/clear', function(req, res){
//   Post.collection.remove({}, function(e){
//   	console.dir(e);
//   });
// });

// app.get('/stream', function(req, res){
//   Post.find({}, function(error,docs){ 
// 	  res.json(docs.reverse()); 
// 	});
// });