angular.module('gimmick')
  
  .directive('targetListDropdown', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/target-list-dropdown.html',
      controller: function($scope, $element, $rootScope, $location, Target) {
        var onChanged = function(id) {
          location.path('/log/' + id);
        }

        var initDropdown = function() {
          $('.dropdown', $element).dropdown({
            onChange: onChanged
          });
        };

        // init dropdown
        initDropdown();

        // when new target added
        $rootScope.$on('targets updated', function(e, t) {
          $scope.targets = Target.getAll();
          $scope.$apply();

          initDropdown();

          var ids = Object.keys($scope.targets);
          if (1 === ids.length) {
            $('.dropdown', $element).dropdown('set selected', ids[0]);

            onChanged(ids[0]);
          }
        });
      }
    };
  });

