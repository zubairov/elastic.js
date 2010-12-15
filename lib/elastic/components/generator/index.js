exports.process = function(data, conf, next){
	var newObject = {
		"username" : "zubairov",
		"email" : "renat.zubairov@gmail.com",
		"age" : 30,
		"birthdate": "04-04-1980"
	}
	for(var i = 0; i<10; i++) {
		next(null, newObject);
	}
};