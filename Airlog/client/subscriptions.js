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