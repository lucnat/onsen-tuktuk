angular.module('airlog',['angular-meteor', 'ui.router']);


addProject = function(name){
	Meteor.call('addProject', name, function(error, result){
		console.log('Project added with id: ' + result);
	});
};

 