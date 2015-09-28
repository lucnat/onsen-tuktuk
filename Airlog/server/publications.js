Meteor.publish('projects', function(projects){
	try{
		return Projects.find();
	}
	catch(e){
		return;
	}
});

Meteor.publish('loggers', function(userId){
	var user = Users.findOne({'_id': userId});
	console.log(user);
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
