var fs = require('fs');

var storage = {};

storage.save = function(id, value, callback){
	fs.writeFile("./storage/"+id+".json", JSON.stringify(value), function(err){
		callback();
	});
};

storage.get = function(id, callback){
	var file = "./storage/"+id+".json";
	fs.exists(file, function(exists){
		if(exists){
			fs.readFile(file, function(err, data){
				console.log(err);
				callback(JSON.parse(data));
			});
		}
	});
};

module.exports = storage;
