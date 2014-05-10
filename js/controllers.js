'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LoginCtrl', ['$scope', 'syncData', 'loginService', '$location', function($scope, syncData, loginService, $location) {
   $scope.login = function(cb) {
      loginService.login(null, null, function(err, user) {
         $scope.err = err? err + '' : null;
         if (!err) {
            var sync = syncData(['users', $scope.auth.user.uid]);
            sync.$on('loaded', function() {
               console.log(sync);
               if (!sync.name) {
                  sync.name = user.name;
                  sync.fbid = user.id;
                  sync.$save();
               }
            });
            cb && cb(user);
         }
      });
   };

   $scope.createAccount = function() {
      $scope.err = null;
      if( assertValidLoginAttempt() ) {
         loginService.createAccount($scope.email, $scope.pass, function(err, user) {
            if( err ) {
               $scope.err = err? err + '' : null;
            }
            else {
               $scope.login(function() {
                  loginService.createProfile(user.uid, user.email);
                  $location.path('/schedule');
               });
            }
         });
      }
   };
}])
.controller('ScheduleCtrl', ['$scope', 'syncData', 'loginService', function($scope, syncData, loginService) {
   $scope.logout = function() {
      loginService.logout();
   };
}]);;