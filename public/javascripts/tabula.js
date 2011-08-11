(function(){

	var actions = {
		
		post: function() {
			
			var ta = $('#post');

			$.ajax({
				data: { post: ta.val() },
				contentType: 'application/x-www-form-urlencoded',
				url: '/post/new',
				type: 'post',
				success: function(result){
					// alert(result);
				}
			});			
		},
		clear: function() {
			$.ajax({
				url: '/post/clear',
				type: 'post'
			});

		}
	};

	function getStream() {
		$.ajax({
			url: '/stream',
			success: renderStream
		});
	}

	function renderStream(stream) {
		$('#post-template').template('post-template');
		$.tmpl('post-template', stream ).appendTo( "#stream" );
	}
	
	$(document).ready(function() {

		$('button[data-action]').click(function(){
			var action = $(this).data('action');
			if(actions[action]) { actions[action](); }
		});

		getStream();
	});

}());