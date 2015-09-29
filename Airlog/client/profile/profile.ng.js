angular.module('airlog').controller('ProfileController', function($scope, $meteor){
	
	$scope.projects = $meteor.collection(Projects).subscribe('projects');
	$scope.users 	= $meteor.collection(Users, false).subscribe('users');
	
	$scope.subscribe = function(){
		// lets check if the key is long enough first
		if($scope.subscribedProject && $scope.subscribedProject.key.length >= 4){

			// so the key lenght is long enough, let's check wether the project exists in the database.
			Meteor.call('checkIfProjectExists', $scope.subscribedProject.key, function(error,result){
				console.log(result);
				if(result == true){
					// means the project actually exists on the server. Let's add it to the profile. 
					// check if the project exists. 
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
				else {
					alert('Project not found.');
				}
			});
		} else {
			alert('key length too short.');
		}
	}

	$scope.subscribeRemote = function(){
		alert($scope.remoteProject.server + " | " + $scope.remoteProject.username + " | " + $scope.remoteProject.password + " | " + $scope.remoteProject.path);
	}
});

