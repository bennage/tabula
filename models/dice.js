module.exports = {
	// take some content, identify roll expression and evaluate them
	convertRolls: function(exp) {
		var re = /(\d*d\d+(\s*[+-]\s*(\d*d\d+|\d+))*)/ig;

		var results = [];
		var dice = [];

		var full = exp.replace(re, function(m) {
			var result = roll(m);
			results.push(result);
			return  '{' + result.total + '}';
		});

		var matches = exp.match(re) || [];
		
		for(var i = 0; i < matches.length; i++) {
			dice.push(matches[i].replace(/\s/g,''));
		}	

		return {
			dice: dice,
			results: results,
			body: full,
			toString : function() {
				return full;
			}
		};
	}
};

function roll(dice)
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

	total = results.reduce(function(prev,current){ return prev + current; });
	
	return {
		total: total,
		types: type,
		outcomes: results
	};
}
