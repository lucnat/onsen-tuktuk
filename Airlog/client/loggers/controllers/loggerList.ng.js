angular.module('airlog').controller('LoggersListController', function ($scope, $meteor) {
	$scope.loggers = $meteor.collection(Loggers).subscribe('loggers');
});
