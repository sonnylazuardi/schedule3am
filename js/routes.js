"use strict";

angular.module('myApp.routes', ['ngRoute'])

   // configure views; the authRequired parameter is used for specifying pages
   // which should only be available while logged in
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });

      $routeProvider.when('/schedule', {
         templateUrl: 'partials/schedule.html',
         authRequired: true,
         controller: 'ScheduleCtrl'
      });
      
      $routeProvider.otherwise({redirectTo: '/schedule'});
   }]);