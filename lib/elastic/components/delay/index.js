var i = 1;

exports.process = function(data, conf, next){
	var delay = conf.delay || 100
	setTimeout(function() {
		next(null, data);
	}, delay * i++);
};
