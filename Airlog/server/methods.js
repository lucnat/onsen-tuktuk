var dataRootPath = "/Users/Luca/Documents/GitHub/Airlog/sensordata/";

var fs = Npm.require('fs');
var username = 'user1';
 
Meteor.methods({
	'syncUserLoggers': function(userID){

		// maps all logger names from filesystem to db
		var user = Users.findOne({_id: userID});
		if(!user.profile){
			Users.update({_id:Meteor.user()._id}, { $set: {profile: { loggers: [] }} });
		}
		if(!user.profile.loggers){
			Users.update({_id:Meteor.user()._id}, { $set: {profile: { loggers: [] }} });
		}
		user.profile.username = 'user1'; // GOTTA FIX THAT

		files = fs.readdirSync(dataRootPath + user.profile.username);
		insertMissingLoggers(userID, files);
		/*fs.readdir(dataRootPath + 'user1', function(error, files){
			insertMissingLoggers(userID, files);
		});*/
	},
	'syncUserLoggerData': function(userID){
		var user = Users.findOne({_id: userID});  
		var loggers = user.profile.loggers;
		loggers.forEach(function(logger){
				var fsfiles = fs.readdirSync(dataRootPath + username + '/' + logger);
				fsfiles.forEach(function(file){
					if(!Loggers.findOne({'userID': userID, 'loggername': logger, files: file}) && file[0] != '.'){
						// it isn't already there, and it doesnt start with a ".", so let's add it
						console.log('Found new file for ' + logger + ': ' + file);
						Loggers.update({'userID': userID, 'loggername': logger}, {$push: {files: file}});
						var rawData = fs.readFileSync(dataRootPath+username+'/'+logger+'/'+file, 'utf-8').toString();
						var splitIntoRows = rawData.split('\n');
						for(var i=1; i<splitIntoRows.length-1; i++){
							var splitIntoElements = splitIntoRows[i].split(',');

							var datetime = splitIntoElements[0];
							var date 	= datetime.split(' ')[0];
							var time 	= datetime.split(' ')[1];
							var year 	= date.split('\\')[0];
							var month 	= date.split('\\')[1];
							var day 	= date.split('\\')[2];
							var hour 	= 	time.split(':')[0];
							var minute 	= 	time.split(':')[1];
							var second 	= 	time.split(':')[2];

							var YESTHEDATE = new Date(year, month, day, hour, minute, second);
							Loggers.update({'userID': userID, 'loggername': logger}, {$push: {data: splitIntoElements}});

						}
					}
				});
		})
	}
});

function insertMissingLoggers(userID, fsLoggers){
	var dbLoggers = Users.findOne({_id: userID}).profile.loggers;
	mapArrayAToB(fsLoggers, dbLoggers);
	Users.update({_id:Meteor.user()._id}, { $set: {profile: { loggers: dbLoggers }} });
	dbLoggers.forEach(function(element){
		if(!Loggers.findOne({userID: userID, 'loggername': element})){
			Loggers.insert({
				userID: userID, 
				'loggername': element,
				'files': [],
				'rawData': [],
				'data': []
			});
		}
	});
}

function mapArrayAToB(A,B){
	// maps A to B and returns the amount of elements that were mapped. 
	var amountOfElementsMapped = 0;
	A.forEach(function(element){
		var found = false;
		for(var i=0; i<B.length; i++){
			if(element == B[i]) found = true;
		}
		if(!found) {
			B.push(element);
			amountOfElementsMapped = amountOfElementsMapped + 1;
			console.log('found new: ' + element);
		}
	});
	return amountOfElementsMapped;
}