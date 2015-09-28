Accounts.onCreateUser(function(options, user) {
	user.profile = {
		'projects': []
	}
 	return user;
});
