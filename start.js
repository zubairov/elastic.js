var Engine = require('./lib/elastic').Engine;

var env = {}

var engine = new Engine(env);
engine.start(process.argv[2] || 'flow1', function(err) {
	// Called when error occured or with null if all ok
});
