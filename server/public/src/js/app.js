angular.module('gimmick', [
  'ngRoute',
  'gimmick.templates',
])
  .config(function($routeProvider) {
    $routeProvider
     .when('/', {
      templateUrl: 'log.html',
    });
  })
  
  .run(function($rootScope, Target) {
    // listen for new data
    var socket = io();

    socket.on('connect', function(){
      socket.on('disconnect', function(){
        console.error('Server disconnected');
      });

      socket.on('new target', function(msg){
        Target.get(msg.id).setMeta(msg);
      });

      socket.on('events', function(msg) {
        Target.get(msg.id).addEvents(msg.events);
      });

    });

  });
