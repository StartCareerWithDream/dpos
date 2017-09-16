/**
 * Created by jsama on 2017/6/9.
 * @desc  收银缴款-修改-控制器
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .directive('autoFocus', function($timeout) {
      return {
        restrict: 'AC',
        link: function(_scope, _element) {
          $timeout(function(){
            _element[0].focus();
          }, 0);
        }
      };
    })
    .controller('employeePayDeliveryMod.Controller', ["$scope", "webService", "hdTip", '$rootScope', '$filter', '$state', 'hdDialog','hdAuthPermissionService', function ($scope, webService, hdTip, $rootScope, $filter, $state, hdDialog,hdAuthPermissionService) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        item: {}
      };
      /***********************************************************************************************************
       **************************************2、内部方法——工具、设置类型*********************************************/
      function init() {
        webService.commonProvide('/{shop}/paydelivery/get', 'get', null, {
          id: $state.params.uuid
        }).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.item = resp.data.data;
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }

      /***********************************************************************************************************
       **************************************3、对外方法，ng-click\ng-change\等方法*********************************/
        //确认缴费
      $scope.pay = function () {
        webService.commonProvide('/{shop}/paydelivery/save', 'POST', $scope.dataManage.item).then(function (resp) {
          if (resp.data.success) {
            hdTip.tip("保存成功", "success");
            hdDialog.hide();
            $state.go('employeePayDeliveryDtl', {uuid: $scope.dataManage.item.id});
          } else {
            hdTip.tip(resp.data.message, "error");
          }
        });
      };

      //判断是否能缴款
      $scope.canPay = function (item) {
        var hasPermission = false;
        if (hdAuthPermissionService.hasPermission("缴款登记")) {
          if (item.cashierMobile != $rootScope.user.mobile) {
            hasPermission = true;
          }
        }

        if (hdAuthPermissionService.hasPermission("自行缴款")) {
          if (item.cashierMobile == $rootScope.user.mobile) {
            hasPermission = true;
          }
        }
        return hasPermission
      };

      /**************************************************启动*********************************************/
      init();
    }]);
})();