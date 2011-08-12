(function(){

	var actions = {
		
		post: function() {
			
			var ta = $('#post');

			$.ajax({
				data: { post: ta.val() },
				contentType: 'application/x-www-form-urlencoded',
				url: '/post/new',
				type: 'post',
				success: renderStream
			});			
		},
		clear: function() {
			$.ajax({
				url: '/post/clear',
				type: 'post'
			});
			$('#stream').empty();

		}
	};

	function getStream() {
		$.ajax({
			url: '/stream',
			success: renderStream
		});
	}

	function renderStream(stream) {
		stream = (typeof stream.length === 'undefined') ? [stream] : stream;
		$('#post-template').template('post-template');
		$.tmpl('post-template', stream ).prependTo( "#stream" );
	}
	
	$(document).ready(function() {

		$('button[data-action]').click(function(){
			var action = $(this).data('action');
			if(actions[action]) { actions[action](); }
		});

		getStream();
	});

}());