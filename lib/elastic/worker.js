var util = require('util'),
	events = require('events'),
	spawn = require('child_process').spawn;

/**
*	We are defining a new class here called Worker
**/
var Worker = function(env) {
	// It extends EventEmitter
	events.EventEmitter.call(this);
	var self = this;
	self.env = env;
}
// Inherit from EventEmitter
util.inherits(Worker, events.EventEmitter);

/**
*	A public function that starts a flow by ID
**/
Worker.prototype.startFlow = function(flowID) {
	var self = this;
	var script = require('path').join(__dirname, 'worker_child.js');
	var prc = process.execPath;
	var worker = spawn(prc, [ script, flowID ]);
	self.emit("startedFlow", flowID);
	worker.stdout.on('data', function (data) {
		console.log(data.toString('utf-8'));
	});
	
	worker.stderr.on('data', function (data) {
	  console.log(data.toString('utf-8'));
	});
	
	worker.on('exit', function (code) {
		if (code == 0) {
			self.emit('completedFlow', flowID);
		} else {
			self.emit('error', flowID);
		}
	});
}

// And now we export it according to CommonJS standard
exports.Worker = Worker;
