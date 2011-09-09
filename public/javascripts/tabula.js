(function(){
	var showOoc = true;
	var actions = {
		
		post: function() {
			
			var ta = $('#post');

			if(ta.val().trim() === '') return;
			
			$.ajax({
				data: { post: ta.val() },
				contentType: 'application/x-www-form-urlencoded',
				url: '/posts/add',
				type: 'post',
				success: renderStream
			});			
			ta.val('');
		},

		clear: function() {
			$.ajax({
				url: '/posts/clear',
				type: 'post'
			});
			$('#stream').empty();

		},

		toggleOoc: function() {
			if(showOoc) {
				$('.ooc').hide('fast');
			} else {
				$('.ooc').show('fast');
			}
			showOoc = !showOoc;
		}
	};

	function getStream(page) {
		page = page || 1;
		$.ajax({
			url: '/posts/' + page,
			success: renderPage
		});
	}

	function getScene() {
		$.ajax({
			url: '/scenes/current',
			success: renderScene
		});
	}

	function renderScene(res) {
		if(typeof(res) === 'string'){
			return;
		}
		$.tmpl('scene-template', res ).prependTo( '#scene' );

		imagePreview();
	}

	function renderPage(res) {
		var area = $('#pagination');
		area.empty();
		$('#stream').empty();

		res.total = Math.ceil(res.count / res.pageSize);
		$('#pagination-template').template('pagination-template');
		$.tmpl('pagination-template',res).prependTo('#pagination');

		renderStream(res.results);
		updateNaviation(Number(res.page), Number(res.total));
	}

	function updateNaviation(current, total) {
		
		var next = $('#pagination .next');
		var prev = $('#pagination .prev');

		if(current > 1) {
			prev.click(function() {
				getStream(current - 1);
			});
			prev.removeAttr('disabled');
		} else {
			prev.attr('disabled','');
		}

		if(current < total && total > 1) {
			next.click(function () {
				getStream(current + 1);
			})
			next.removeAttr('disabled');
		} else {
			next.attr('disabled','');
		}
	}

	function renderStream(stream) {
		stream = (typeof stream.length === 'undefined') ? [stream] : stream;
		$.tmpl('post-template', stream ).prependTo( '#stream' );
		//todo: we could optimize this call
		$('.when').prettyDate();
	}

	function imagePreview(){	
		$("#context a.image").lightBox({containerResizeSpeed:100});
	};

	$(document).ready(function() {

		// preload templates
		$('#post-template').template('post-template');
		$('#roll-template').template('roll-template');
		$('#scene-template').template('scene-template');


		// wire flash messages for hiding
		$('#messages').click(function(){
			$(this).hide('slow');
		});

		// bind buttons
		$('button[data-action]').click(function(){
			var action = $(this).data('action');
			if(actions[action]) { actions[action](); }
		});

		// show roll results on hover
		$('.post').live('hover', function(){
			var data = $.tmplItem(this).data;
			$('#roll').empty();
			if(data.rolls && data.rolls.length) {
				$.tmpl('roll-template', data.rolls).prependTo( '#roll' );
			}
		});

		// get the current posts
		getStream();
		getScene();
	});

}());