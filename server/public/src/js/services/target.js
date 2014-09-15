angular.module('gimmick')

  .factory('Target', function($rootScope) {
    
    var Target = function() {
      this._displayItems = [];
    };


    Target.prototype.getDisplayItems = function() {
      return this._displayItems;
    };


    Target.prototype.setMeta = function(meta) {
      this.id = meta.id;
      this.details = meta.details;
      this.description = this.id + ' - ' + this.details.platform + ' + ' + this.details.product + '[' + this.details.appCodeName + ']';

      $rootScope.$broadcast('targets updated', this);
    };


    Target.prototype.addEvents = function(events) {
      this._displayItems.push(events);
    };


    var targets = {};

    return {
      get: function(targetId) {
        if (!targets[targetId]) {
          targets[targetId] = new Target();
        }
        return targets[targetId];
      },
      getAll: function() {
        return targets;
      }
    };
  });
