var vows = require('vows'),
    assert = require('assert'),
    fetchJSON = require('../lib/elastic/util').fetchJSON;
    util = require('../lib/elastic/util');

// Test for fetchJSON    
vows.describe('Testing fetchJSON').addBatch({
    'Fetching available resource': {
        topic: function() {
        	fetchJSON("http://elastic.io/pipe.json", this.callback);
        },
        'should be ok': function(err, data) {
        	assert.isNull(err);
        	assert.isTrue(data.pipe.id.length > 0);
        }
	},
    'Fetching 404 resource': {
        topic: function() {
        	fetchJSON("http://www.google.com/nonExistingResource", this.callback);
        },
        'should be ok': function(err, data) {
        	assert.isNotNull(err);
        	assert.include (err, '404');
        	assert.isUndefined(data);
        }
	},
	'Fetching 301 resource': {
        topic: function() {
        	fetchJSON("http://google.com/nonExistingResource", this.callback);
        },
        'should be ok': function(err, data) {
        	assert.isNotNull(err);
        	assert.include (err, '404');
        	assert.isUndefined(data);
        }
	}
}).export(module);

// Test for XML to JSON parsing
vows.describe('Testing XML conversion to JSON').addBatch({
	'Eeach nested element or attribute is represented as a name/value property of the object' : {
		topic: function() {
			var parser = util.parser();
			parser.on('json', this.callback);
			parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();
		},
		'expectations match': function(data, arg1) {
			assert.deepEqual(data, { 'xml' : {
					"$t":	"Hello, !",
					'who' : { 'name': 'world', "$t": "world" }
				}
			});
		}
	},
	'Namespaces are also supported': {
		topic: function() {
			var parser = util.parser();
			parser.on('json', this.callback);
			parser.write('<n1:test xmlns:n1="namespace1">content</n1:test>').close();
		},
		'namespaces validated ok': function(data, arg1) {
			assert.deepEqual({ 'n1$test' : {
					"$t":	"content",
					'xmlns$n1' : "namespace1"
				}
			}, data);
		}
	},
	'Repititive elements are transformed into arrays': {
		topic: function() {
			var parser = util.parser();
			parser.on('json', this.callback);
			parser.write('<root><msg>Hello</msg><msg>World</msg></root>').close();
		},
		'match expectations': function(data, arg1) {
			assert.deepEqual(data, { 'root' : {
					"msg": [
						{'$t': 'Hello'},
						{'$t': 'World'}
					]
				}
			});
		}
	}
}).export(module);