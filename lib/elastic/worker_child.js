var path = require('path'),
	underscore = require('underscore'),
	fs = require('fs');

postMessage = function(msg) {
	//console.log(msg);
}

/**
*	This function executes a flow by ID
**/ 
var startFlow = function(flowID) {
	var resourceName = path.join(__dirname, "../../flows/" + flowID + ".json");
	fs.readFile(resourceName, 'utf-8', function(err, data) {
			if (err) {
				throw new Error(err);
			}
			doc = JSON.parse(data);
			postMessage({ 'startedFlow' : doc._id } );
			_proceed(null, null, doc.steps.reverse());
			postMessage({ 'completedFlow' : doc._id } );
	});
}



/**
*	Private function to proced along the steps
**/
var _proceed = function(err, data, steps) {
	var step = steps.pop();
	if (step) {
		var func = require(path.join(__dirname, "/components/" + step.component)).process;
		var conf = step.configuration || {};
		postMessage({'startedStep' : step });
		func(data, conf, function(err, newData) {
			if (err) {
				postMessage({'error': err});
				throw new Error(err);
			}
			postMessage({'completedStep' : step });
			// We need to clone steps to pass a new copy of it
			// further
			var nextSteps = underscore.clone(steps);
			_proceed(err, newData, nextSteps);
		});
	}
}

if (!(process.argv[2])) {
	throw new Error("Please specify the flow ID as parameter");
}
var flowID = process.argv[2];
// Start the flow
startFlow(flowID);