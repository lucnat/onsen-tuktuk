// fixtures

if(Projects.find().count() === 0)
	Projects.insert({
		'name': 'project1'
		//'key': '1234',		We use id's atm
	});