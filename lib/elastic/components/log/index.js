exports.process = function(data, conf, next){
	console.log("Log" + JSON.stringify(data));
	next(null, data);
};