Tracker.autorun(function(){
	if(Meteor.user()){
		Meteor.subscribe('projects', Meteor.user().profile.projects);
	}
});

Tracker.autorun(function(){
	if(Meteor.user()){
		Meteor.subscribe('loggers', Meteor.userId());
	}
});

Tracker.autorun(function(){
	if(Meteor.user()){
		try{
			console.log('syncing all your projects....');
			var projects = Projects.find().fetch();
			projects.forEach(function(project){
				Meteor.call('sync', project.name);
			});
			console.log('done');
		}
		catch(e) {};
	}
});




addProject = function(name){
	Meteor.call('addProject', name, function(error, result){
		console.log('Project added with id: ' + result);
	});
};