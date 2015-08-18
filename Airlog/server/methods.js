Meteor.methods({
	syncLoggers: function() {
		Ftp.ls(directory, function(err, res) {
			res.forEach(function(file) {
				if(! Loggers.findOne({name: file.name})){
					Loggers.insert({ name: file.name, last: new Date(), data: []});
				}
			});
		});
	}
});