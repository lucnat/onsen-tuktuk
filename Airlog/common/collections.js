
Loggers = new Mongo.Collection('loggers');
Users = Meteor.users;
Projects = new Mongo.Collection('projects', {idGeneration: 'STRING'});

