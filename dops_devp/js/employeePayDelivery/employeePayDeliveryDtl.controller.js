/**
 * Created by jsama on 2017/6/9.
 * @desc  收银缴款-详情-控制器
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('employeePayDeliveryDtl.Controller', ["$scope", "webService", "hdTip", '$rootScope', '$filter', '$state', 'hdDialog','hdAuthPermissionService','hdPrint', function ($scope, webService, hdTip, $rootScope, $filter, $state, hdDialog,hdAuthPermissionService,PrintMgr) {
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

      function doPrintSale(order) {
        var shop = window.top.lionApi.getLionSession("shop");
        var tpl = 'lodop.PRINT_INIT(\"' + "销售单_" + order.number + "_" + Date.now() + '\");';
        var height = 15;
        var hpos = 10;
        tpl += PrintMgr.addTextElement(hpos, 0, '100%', height, '欢迎光临' + shop.name,
          'center');
        tpl += PrintMgr.addTextElement(hpos += height , 0, '100%', height, '缴款单号:' + order.number);
        tpl += PrintMgr.addTextElement(hpos += height, 0, '65%', height, '生成日期:' + order.generateDate.split(" ")[0]);
        tpl += PrintMgr.addTextElement(hpos, '65%', '35%', height, '班次:' +  (order.workShift?order.workShift:'-'));
        tpl += PrintMgr.addTextElement(hpos += height, 0, '65%%', height, '缴款店员:' + (order.cashier?order.cashier:'-'));
        tpl += PrintMgr.addTextElement(hpos, '65%', '35%', height, '收款人:' + (order.creator.name?order.creator.name:'-'));
        tpl += hdUtils.string.format('lodop.ADD_PRINT_LINE({0},{1},{2},{3},{4});', hpos += (height + 7), 0, hpos, '"100%"', 3);
        tpl += PrintMgr.addTextElement(hpos += 8, 0, '25%', height, '支付方式');
        tpl += PrintMgr.addTextElement(hpos, '25%', '25%', height, '待缴款');
        tpl += PrintMgr.addTextElement(hpos, '50%', '25%', height, '实缴款');
        tpl += PrintMgr.addTextElement(hpos, '75%', '25%', height, '长短款');
        for (var i = 0; i < order.paymentRecords.length; i++) {
          tpl += PrintMgr.addTextElement(hpos += height, 0, '25%', height,order.paymentRecords[i].paymentMethod);
          tpl += PrintMgr.addTextElement(hpos, '25%', '25%', height,  order.paymentRecords[i].amount);
          tpl += PrintMgr.addTextElement(hpos, '50%', '25%', height, order.paymentRecords[i].realPayAmount);
          tpl += PrintMgr.addTextElement(hpos, '75%', '25%', height, order.paymentRecords[i].overShort);
        }
        tpl += PrintMgr.addTextElement(hpos += height, 0, '25%', height,"合计");
        tpl += PrintMgr.addTextElement(hpos, '25%', '25%', height,  order.waitToPayAmount);
        tpl += PrintMgr.addTextElement(hpos, '50%', '25%', height, order.realPayAmount);
        tpl += PrintMgr.addTextElement(hpos, '75%', '25%', height, order.overShort);

        tpl += 'lodop.SET_PRINT_STYLEA(0, "Stretch", 2);';
        tpl += 'lodop.SET_PRINT_PAGESIZE(3, "100%", "10mm", order.shopName +"订单信息");';


        PrintMgr.preview(tpl, order, -1);
      }

      /***********************************************************************************************************
       **************************************3、对外方法，ng-click\ng-change\等方法*********************************/
      //删除
      $scope.delete = function () {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "确定要删除这张收银缴款单吗?",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/delete', 'POST', null, {
              id: $scope.dataManage.item.id,
              version: $scope.dataManage.item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("删除成功", "success");
                hdDialog.hide();
                $state.go('employeePayDeliveryList');
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //处理
      $scope.handle = function () {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "请确认是否完成长短款处理？",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/handle', 'POST', null, {
              id: $scope.dataManage.item.id,
              version: $scope.dataManage.item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("处理成功", "success");
                hdDialog.hide();
                init();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //作废
      $scope.invalid = function (item) {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "确定要作废这张收银缴款单吗? ",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/invalid', 'POST', null, {
              id: $scope.dataManage.item.id,
              version: $scope.dataManage.item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("作废成功", "success");
                hdDialog.hide();
                init();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //签字
      $scope.sign = function () {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "请确认是否已经打印并双方签字了吗？",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/sign', 'POST', null, {
              id: $scope.dataManage.item.id,
              version: $scope.dataManage.item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("签字成功", "success");
                hdDialog.hide();
                init();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //返回
      $scope.back =function(){
        $state.go('employeePayDeliveryList');
      };
      //打印
      $scope.print =function(){
        doPrintSale($scope.dataManage.item);
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