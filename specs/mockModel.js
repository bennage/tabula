// used for mocking Mongoose models
//todo: this needs to create a new mock the first time something is invoked
function mockQuery() { 
}

mockQuery.setCount = function(howMany) {
	mockQuery.prototype.howMany = howMany;	
};

mockQuery.setResult = function(result) {
	mockQuery.prototype.result = result;	
};

mockQuery.prototype.find = function(criteria) {
	this.criteria = criteria;
	return this;
};

mockQuery.prototype.skip = function(count) {
	this.skip = count;
	return this;
};

mockQuery.prototype.limit = function(count) {
	this.limit = count;
	return this;
};

mockQuery.prototype.desc = function(property) {
	this.desc = property;
	return this;
};

mockQuery.prototype.count = function(criteria, callback) {
	var howMany = this.howMany || 0; 
	callback(null, howMany);
};

mockQuery.prototype.exec = function(fn) {
	fn(null, this.result || []);
};

mockQuery.reset = function(args) {
	var property;
	for(property in mockQuery.prototype) {
		if(typeof(mockQuery.prototype[property]) !== 'function') {
			console.log('deleting ' + property);
			delete mockQuery.prototype[property]; 			
		}
	}
};

module.exports = mockQuery;