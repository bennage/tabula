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
		},

		roll: function() {
			var ta = $('#post');
			var result = convertRolls(ta.val());
			ta.val('');
			$('#stream').prepend('<div>' + result + '</div>');
		}
	};

	function getStream(page) {
		page = page || 1;
		$.ajax({
			url: '/posts/' + page,
			success: renderPage
		});
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
		$('#post-template').template('post-template');
		$.tmpl('post-template', stream ).prependTo( '#stream' );

		$('.when').each(function(){
			var d = new Date(this.innerText);
			this.innerText = friendlyDate(d);
		});

	}

	function friendlyDate(date) {
		return '1 minute ago';
	}
	
	$(document).ready(function() {

		$('button[data-action]').click(function(){
			var action = $(this).data('action');
			if(actions[action]) { actions[action](); }
		});


		getStream();
	});

}());