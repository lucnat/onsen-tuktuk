var dataRootPath = "/Users/lucanaterop/Documents/Airlog/sensordata/";

var fs = Npm.require('fs');
var project = 'project1';	// will be saved in user profile

Meteor.methods({
	'sync': function(project, userId){
		detectLoggers(project);
		Users.update({_id: userId}, {$set: {profile: {'project': project} }});
	},
	'checkIfProjectExists': function(key){
		if(Projects.find({'_id': key})){
			return true;
		} else {
			return false;
		}
	},
	'getProject': function(key){
		var project = Projects.findOne({'_id': key});
		return project;
	}
});

function detectLoggers(project){
	// Detects new loggers. Does not do anything with them
	var loggerFolders = fs.readdirSync(dataRootPath+project);
	loggerFolders.forEach(function(folder){
		if(!Loggers.findOne({'project': project, 'loggername': folder})){
			console.log('new logger detected: ' + folder);
			Loggers.insert({
				'project': project, 
				'loggername': folder,
				'header': [],
				'files': [],
				'rawData': [],
				'data': []
			});


			detectHeader(project,folder);
			detectData(project,folder);
		}
	});
} 

function detectHeader(project, loggerName){
	// watch out for .DS_Store!!

	var files = fs.readdirSync(dataRootPath+project+'/'+loggerName);

	var headerFound = false;
	for(var i=0; i<files.length; i++){
		if(files[i][0] != '.'){
			// then it is a valid file, so no .DS_Store or any crap
			headerFound = true;
			var content = fs.readFileSync(dataRootPath+project+'/'+loggerName+'/'+files[i], 'utf-8');
			var header = content.split('\n')[0].split(',');
			header.pop();	// remove ghost element at end
			Loggers.update({'project': project, 'loggername': loggerName},{$set: {'header': header}});	
			console.log('header found for '+ loggerName);
			break;
		}
	}
	if(!headerFound) console.log('No header found yet for '+ loggerName);
}
 
function detectData(project,loggerName){
	var fsfiles = fs.readdirSync(dataRootPath + project + '/' + loggerName);
	fsfiles.forEach(function(file){
		if(!Loggers.findOne({'project': project, 'loggername': loggerName, files: file}) && file[0] != '.'){
			// it isn't already there, and it doesnt start with a ".", so let's add it
			console.log('Found new file for ' + loggerName + ': ' + file);
			Loggers.update({'project': project, 'loggername': loggerName}, {$push: {files: file}});
			var rawData = fs.readFileSync(dataRootPath+project+'/'+loggerName+'/'+file, 'utf-8').toString();
			var splitIntoRows = rawData.split('\n');
			for(var i=1; i<splitIntoRows.length-1; i++){
				var splitIntoElements = splitIntoRows[i].split(',');
				splitIntoElements.pop(); // remove ghost element at end

				var datetime = splitIntoElements[0];
				var date 	= datetime.split(' ')[0];
				var time 	= datetime.split(' ')[1];
				var year 	= date.split('\\')[0];
				var month 	= date.split('\\')[1];
				var day 	= date.split('\\')[2];
				var hour 	= 	time.split(':')[0];
				var minute 	= 	time.split(':')[1];
				var second 	= 	time.split(':')[2];

				splitIntoElements[0] = new Date(year, month, day, hour, minute, second);
				Loggers.update({'project': project, 'loggername': loggerName}, {$push: {data: splitIntoElements}});

			}
		}
	});
}
