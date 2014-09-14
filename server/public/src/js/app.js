var app = angular.module('gimmick', [
  'ngRoute',
  'gimmick.templates',
]);

app.controller('HomeCtrl', function($scope) {
  $scope.data = 'test';
});

app.config(function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'home.html',
  });
});
