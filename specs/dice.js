var assert = require('assert');
var dice = require('../models/dice');

module.exports = {
	
	'roll d20': function() {
		var roll = dice.convertRolls('d20');

		assert.equal('d20', roll.dice[0]);
		assert.equal(1, roll.dice.length);
		assert.equal(1, roll.results.length);
	},
	
	'captures adding a modifier': function() {
		var roll = dice.convertRolls('d20+1');

		assert.equal('d20+1', roll.dice[0]);
	},

	'captures subtracting a modifier': function() {
		var roll = dice.convertRolls('d20-1');

		assert.equal('d20-1', roll.dice[0]);
	},

	'removes whitespace from roll expression': function() {
		var roll = dice.convertRolls('d20 + 1');

		assert.equal('d20+1', roll.dice[0]);
	},

	'captures multiples of a die type': function() {
		var roll = dice.convertRolls('4d8');

		assert.equal('4d8', roll.dice[0]);
	},

	'captures expression with multiple die types': function() {
		var roll = dice.convertRolls('4d8 + 2d6');

		assert.equal('4d8+2d6', roll.dice[0]);
	},

	'captures expression with multiple die types and modifier': function() {
		var roll = dice.convertRolls('4d8 + 2d6 + 5');

		assert.equal('4d8+2d6+5', roll.dice[0]);
	},

	'extracts multiple expressions from content': function() {
		var roll = dice.convertRolls('d20 and 2d8');

		assert.equal('d20', roll.dice[0]);
		assert.equal('2d8', roll.dice[1]);
	}
};