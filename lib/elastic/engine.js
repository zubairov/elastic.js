var Worker = require('./worker.js').Worker;
var path = require('path');
var sys = require('util');

/**
*	Declare a new class Engine that would be exported out of the module
**/
var Engine = exports = module.exports = function Engine(env){
    var self = this;
    this.config = {};
}

/**
*	Start function
**/
Engine.prototype.start = function(flowId, callback) {
	// This is our sample flow description
	console.log("Starting worker");
	try {
		var w = new Worker(this.env);
		w.on('startedFlow', function(flowID) {
			console.log('Started flow execution ' + flowID);
		});
		w.on('completedFlow', function(flowID) {
			console.log('Completed flow execution ' + flowID);
			callback(null);
		});
		w.startFlow(flowId);
	} catch (error) {
		callback(error);
	}
};


