angular.module('gimmick')

  .factory('Target', function() {
    
    var Target = function(meta) {
      this._displayItems = [];
    };


    Target.prototype.getDisplayItems = function() {
      return this._displayItems;
    };


    Target.prototype.setMeta = function(meta) {
      this.id = meta.id;
      this.details = meta.details;
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
      }
    };
  });


