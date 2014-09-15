angular.module('gimmick')
  
  .directive('targetListDropdown', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/target-list-dropdown.html',
        link: function(scope, element) {
          $('.dropdown', element).dropdown();
        },
        controller: function($scope, $rootScope) {
          $scope.targets = {};

          $rootScope.$on('new target', function(e, t) {
            console.log(t);
            $scope.targets[t.id] = t;
          });
        }
    };
  });