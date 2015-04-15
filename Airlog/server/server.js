var JSFTP = Npm.require('jsftp');

var rootDirectory = 'ftp.naterop.net/html/omniadata/sensordata';
var i = rootDirectory.indexOf('/');
var server = rootDirectory.substring(0,i);
var directory = rootDirectory.substring(i);

var Ftp = new JSFTP({
  host: server,
  port: 21, 		// defaults to 21
  user: "web57", 	// defaults to "anonymous"
  pass: "blacky-1" 	// defaults to "@anonymous"
});

var loggers = [];

var calls = 0;
Ftp.ls(directory, function(err, res) {
  res.forEach(function(file) {
    loggers.push(file.name);
    calls++;
    if(calls == 4) removeSystemFiles();
  });
});

function removeSystemFiles(){
	//needs to be called when files are DEFINITELY loaded
	for(var i=0; i<loggers.length; i++){
		if(loggers[i][0] =='.') loggers.splice(i, 1)
	}
	
	console.log('removed system files. Folders on server are:');
	console.log(loggers);

	insertMissingIntoDB();
}

function insertMissingIntoDB(){
	// maps logger names to db
	var dbloggers = LoggerNames.find().fetch();
	loggers.forEach(function(logger){
		console.log('done');
		if(dbloggers.indexOf(logger) == -1) LoggerNames.insert(logger);
	});
}