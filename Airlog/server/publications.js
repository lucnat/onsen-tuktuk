Meteor.publish('projects', function(userProjects){
	try{
		return Projects.find({'_id': {$in: userProjects}}); 
	}
	catch(e){
		return;
	}
});

Meteor.publish('loggers', function(userId){
	var user = Users.findOne({'_id': userId});
	try{
		if(user.profile){
			var projectIds = user.profile.projects;
			var projectNames = [];
			projectIds.forEach(function(e){
				projectNames.push(Projects.findOne({'_id': e}).name);
			});
			return Loggers.find({'project': {$in: projectNames}});
		}
	} catch(e) {};
});
