'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
.controller('LoginCtrl', ['$scope', 'syncData', 'loginService', '$location', function($scope, syncData, loginService, $location) {
   $scope.messages = syncData('messages', 10);
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
   syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');
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
   function touchHandler(event) {
      var touch = event.changedTouches[0];

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent({
         touchstart: "mousedown",
         touchmove: "mousemove",
         touchend: "mouseup"
      }[event.type], true, true, window, 1,
      touch.screenX, touch.screenY,
      touch.clientX, touch.clientY, false,
      false, false, false, 0, null);

      touch.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
   }
   
   document.addEventListener("touchstart", touchHandler, true);
   document.addEventListener("touchmove", touchHandler, true);
   document.addEventListener("touchend", touchHandler, true);
   document.addEventListener("touchcancel", touchHandler, true);

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
   $scope.newMessage = null;
   $scope.messages = syncData('messages', 10);
   $scope.addMessage = function() {
      if( $scope.newMessage ) {
         $scope.messages.$add({text: $scope.newMessage, fbid: $scope.user.fbid});
         $scope.newMessage = null;
      }
   };
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
