  angular.module('airlog').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
 
      $locationProvider.html5Mode(true);
 
      $stateProvider
        .state('loggers', {
          url:          '/loggers',
          templateUrl:  'client/loggers/views/loggersList.ng.html',
          controller:   'LoggersListController'
        })
        .state('loggerDetails', {
          url:           '/loggers/:loggerId',
          templateUrl:   'client/loggers/views/loggerDetails.ng.html',
          controller:    'LoggerDetailsController'
        })
        .state('profile', {
          url:            '/profile',
          templateUrl:    'client/profile/profile.ng.html',
          controller:     'ProfileController'
        })
        .state('about', {
          url: '/about',
          templateUrl: 'client/about/about.ng.html'
        });
 
      $urlRouterProvider.otherwise("/loggers");
    }]);
