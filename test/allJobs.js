var vows = require('vows'),
    assert = require('assert'),
    Engine = require('../lib/elastic').Engine,
    fs = require('fs'),
    path = require('path');

// Common vow to check that flow
// execution is completed without errors
var noError = function(err) {
	if (err) {
		fail(err);
	}
}

// Function that takes context name and seraches a JSON file
// with given name. Then validates it
var validateJSON = function() {
	var context = {
        topic: function () {
			var file = this.context.name;
			var resourceName = path.join(__dirname + '/../flows/' + file);
			fs.readFile(resourceName, 'utf-8', this.callback);
        }
    };
	context['should be a valid JSON'] = function(err, data) {
		assert.isNull(err);
		JSON.parse(data);
	};
    return context;
}

var listFiles = function(files) {
	var result = {};
	files.forEach(function(file) {
		result[file] = validateJSON();
	});
	return result;
}

fs.readdir('flows', function(err, files) {
	console.log(err);
	if (err) throw err;
	vows.describe('Tesing flows JSON validity').addBatch({
		'Iterate over all files in ../lib/elastic/flows': listFiles(files)
	}).export(module);
});

vows.describe('Testing engine jobs').addBatch({
    'Instantiating engine': {
        topic: new (Engine),
        'should respond to start': function(engine) {
        	assert.isFunction(engine.start);
        },
       	'starting flow1': {
       		topic: function(engine) { return engine.start('flow1', this.callback); },
       		'should produce no errors': noError
       	},
       	'starting twitter': {
       		topic: function(engine) { return engine.start('twitter', this.callback); },
       		'should produce no errors': noError
       	}
    }
}).export(module);