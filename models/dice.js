module.exports = {
	convertRolls: function(exp) {
		var re = /(\d*d\d+(\s*[+-]\s*(\d*d\d+|\d+))*)/ig;

		return exp.replace(re, function(m) {
			return '[[' + roll2(m) + ', ' + m + ']]';
		});
	}
};

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

	total = results.reduce(function(prev,current){ return prev + current; });
	var out = total + ' [';
	results.forEach(function(result,index){
		out += result;
		if(index !== results.length - 1) {
			out += ' + ';
		}
	});
	out += ']';
	return out;
}
