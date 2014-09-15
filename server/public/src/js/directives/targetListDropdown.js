angular.module('gimmick')
  
  .directive('targetListDropdown', function() {
    return {
        restrict: 'E',
        templateUrl: 'directives/target-list-dropdown.html',
        link: function(scope, element) {
          $('.dropdown', element).dropdown();
        },
        controller: function($scope, $element, $rootScope, Target) {
          $rootScope.$on('targets updated', function(e, t) {
            $scope.targets = Target.getAll();
            $scope.$apply();

            setTimeout(function() {
              $('.dropdown', $element).dropdown();

              var ids = Object.keys($scope.targets);
              if (1 === ids.length) {
                $('.dropdown', $element).dropdown('set selected', ids[0]);
              }
            }, 100);
          });
        }
    };
  });