(function(){
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
		roll: function() {
			var ta = $('#post');
			var result = roll(ta.val());
			ta.val('');
			$('#stream').prepend('<div>' + result + '</div>');
		}
	};

function roll(exp) {
	var re = /(\d*d\d+(\s*[+-]\s*(\d*d\d+|\d+?))*)/ig;
	var matches = exp.match(re);
	var out = '';
	
	for(var i = 0; i < matches.length; i++) {
		out += i + ': ' +  matches[i] + '\n';
	}	

	alert(out);
}

function roll2(dice)
{
	dice = dice.replace(/- */,'+ -');
	dice = dice.replace(/D/,'d');

	var re = / *\+ */;
	var items = dice.split(re),
		results = [],
		type = [],
		total;

	items.forEach(function(item) {
		var match = item.match(/^[ \t]*(-)?(\d+)?(?:(d)(\d+))?[ \t]*$/),
			sign,
			num,
			max,
			i;

		if (!match) { return; }

		sign = match[1] ? -1 : 1;
		num = parseInt(match[2] || "1", 10);
		max = parseInt(match[4] || "0", 10);
		
		if (match[3]) {
			for (i = 0; i < num; i++) {
				results.push( sign * Math.ceil(max*Math.random()) );
				type.push(max);
			}
		}
		else {
			results.push(sign * num);
			type.push(0);
		}
	});

	if (results.length === 0) {
	  return dice;
	}

	total = results.reduce(function(prev,current){ return prev + current});
	var out = total + ' [';
	results.forEach(function(result,index){
		out += result;
		if(index != results.length - 1) {
			out += ' + ';
		}
	});
	out += ']';
	return out;
}

	function getStream() {
		$.ajax({
			url: '/posts',
			success: renderStream
		});
	}

	function renderStream(stream) {
		stream = (typeof stream.length === 'undefined') ? [stream] : stream;
		$('#post-template').template('post-template');
		$.tmpl('post-template', stream ).prependTo( "#stream" );

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