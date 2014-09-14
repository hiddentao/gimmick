angular.module('gimmick')

  .controller('LogCtrl', function($scope, $rootScope) {
    $scope.items = [1, 2, 3];

    $scope.$on('newRow', function(rowItem) {
      $scope.items.push(rowItem);
    });
  });