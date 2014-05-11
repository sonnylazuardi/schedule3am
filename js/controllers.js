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

   $scope.password = '';
   $scope.cekPass = function() {
      return $scope.password == 'jonson';
   }

   $scope.getTanggalMinggu = function(month, year) {
      var date;
      var result = [];
      for (var i = 1; i <= 31; i++) {
         date = new Date(year+'-'+month+'-'+i);
         if (date.getDay() == 0) {
            result.push(i);
         }
      }
      return result;
   }

   $scope.bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
   ];
   $scope.now = new Date();
   $scope.year = $scope.now.getFullYear();
   $scope.month = $scope.now.getMonth() + 1;
   $scope.data = [];
   var ctr = 0;
   $scope.getTanggalMinggu($scope.month, $scope.year).forEach(function(item) {
      for(var i = 1; i <= 3; i++) {
         syncData(['schedule', $scope.year+'-'+$scope.month+'-'+item, i]).$bind($scope, 'data['+ctr+']');
         ctr++;
      }
   });
}])
.controller('ScheduleCtrl', ['$scope', 'syncData', 'loginService', 'firebaseRef', function($scope, syncData, loginService, firebaseRef) {
   $scope.getTanggalMinggu = function(month, year) {
      var date;
      var result = [];
      for (var i = 1; i <= 31; i++) {
         date = new Date(year+'-'+month+'-'+i);
         if (date.getDay() == 0) {
            result.push(i);
         }
      }
      return result;
   }
   // $scope.droppings = {
   //    accept: function(event) {
   //       console.log(event);
   //    }
   // };
   $scope.delete = function(tglId, id) {
      $scope.data[tglId].$remove(id);
   }
   $scope.dropCallback = function(event, ui, name) {
      var tgl = angular.element(event.target).data('tanggal');
      var ibdh = angular.element(event.target).data('ibdh');
      var name = ui.draggable.data('name');
      var fbid = ui.draggable.data('fbid');
      // $scope.data[idData].$add({name: name, fbid: fbid});
      var ref = firebaseRef(['schedule', $scope.year+'-'+$scope.month+'-'+tgl, ibdh]);
      ref.once('value', function(snap) {
         var found = false;
         snap.forEach(function (child) {
            var data = child.val();
            if (data.fbid == fbid) {
               found = true;
            }
         });
         if (!found) {
            ref.push({name: name, fbid: fbid});      
         }
      });
   };
   $scope.logout = function() {
      loginService.logout();
   }
   $scope.bulan = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
   ];
   $scope.now = new Date();
   $scope.year = $scope.now.getFullYear();
   $scope.month = $scope.now.getMonth() + 1;
   $scope.data = [];
   var ctr = 0;
   syncData('users').$bind($scope, 'users');
   $scope.getTanggalMinggu($scope.month, $scope.year).forEach(function(item) {
      for(var i = 1; i <= 3; i++) {
         syncData(['schedule', $scope.year+'-'+$scope.month+'-'+item, i]).$bind($scope, 'data['+ctr+']');
         ctr++;
      }
   });
}]);;
