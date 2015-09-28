angular.module('airlog').controller('ProfileController', function($scope, $meteor){
	
	$scope.projects = $meteor.collection(Projects).subscribe('projects');
	$scope.users 	= $meteor.collection(Users, false).subscribe('users');
	
	$scope.subscribe = function(){
		if(Meteor.call('checkIfProjectsExist', $scope.subscribedProject.key)){
			// check if the project exists. In this case it does, so let's add it to user profile
			checkIfProfileExists();
			var profile = Meteor.user().profile;

			// now we push it if it doesn't already exist
			var exists = false;
			for(var i=0; i<profile.projects.length; i++){
				if(profile.projects[i] === $scope.subscribedProject.key){
					exists = true;
					alert('You already added that one!');
				}
			}

			if(!exists) {
				profile.projects.push($scope.subscribedProject.key);
				Users.update({'_id': Meteor.user()._id}, {$set: {profile: profile}});
				alert('Success. Project found.');
				$scope.subscribedProject.key = '';
			}
		}
		else{
			alert('Project not found.');
		}
	}
});


function checkIfProfileExists(){
	// checks if the profile field exists and if not, it will add it
	if(Meteor.user()){
		if(!Meteor.user().profile){
			Users.update({'_id': Meteor.user()._id}, {$set: {profile: {projects: []}}})
		}
	}
}