/**
 * Created by jsama on 2017/6/9.
 * @desc  收银缴款-列表-控制器
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('employeePayDeliveryList.Controller', ["$scope", "webService", "hdTip", '$rootScope', '$filter', '$state', 'hdDialog', 'hdPrint', 'hdAuthPermissionService', function ($scope, webService, hdTip, $rootScope, $filter, $state, hdDialog, PrintMgr, hdAuthPermissionService) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "query": {
            "filters": [
              {
                "property": "cashier:%=%",//收银员姓名
                "value": ""
              },
              {
                "property": "osrange:[,]",//长短款
                "value": ["", ""]
              },
              {
                "property": "date:[,]",//日期
                "value": ["", ""]
              },
              {
                "property": "state:=",//状态，可选值（待签字， 待处理， 已处理， 已作废）
                "value": ""
              },
              {
                "property": "workShift:=",//班次,可选值（早班， 中班， 晚班）
                "value": ""
              }
            ],
            "sorters": [
              {
                "property": "generateDate",//生成日期
                "direction": "desc"
              }, {
                "property": "number",//缴款单号
                "direction": ""
              },
              {
                "property": "waitToPayAmount",//待缴款
                "direction": ""
              },
              {
                "property": "realPayAmount",//实缴款
                "direction": ""
              },
              {
                "property": "overShort",//长短款
                "direction": ""
              }
            ],
            "start": 0,
            "limit": 0
          }//查询条件
        },
        "response": {
          "statusItems": [{text: "待签字", value: "待签字"}, {text: "待处理", value: "待处理"}, {text: "已处理", value: "已处理"}],//状态列表
          "classItems": [],//班次列表
          "items": []//列表对象
        },
        dateType: "sevenDay"
      };

      var shopConfig =window.top.lionApi.getLionSession('shopConfig');
      if(shopConfig&&shopConfig.workShifts&&shopConfig.workShifts.lines){
        $scope.dataManage.response.classItems= shopConfig.workShifts.lines;
      }

      var defaultQuery = angular.copy($scope.dataManage.request.query);

      /*分页*/
      $scope.pageCount = 1;//总页数，从服务中获得
      $scope.page = 2;
      $scope.currentPage = 1;//当前页
      $scope.pageSize = 10;
      $scope.total = 0;

      /***********************************************************************************************************
       **************************************3、内部方法——工具、设置类型*********************************************/
      /**
       * 初始化
       */
      function init() {
        $scope.reset();
        $("th i")[0].click();//按生成时间排序
      }

      function getItems() {
        //获取列表
        var query = {
          start: ($scope.currentPage - 1) * $scope.pageSize,
          limit: $scope.pageSize,
          filters: angular.copy($scope.dataManage.request.query.filters),
          sorters: []
        };
        if (query.filters[2].value[0]) {
          query.filters[2].value[0] = query.filters[2].value[0] + " 00:00:00";
        }
        if (query.filters[2].value[1]) {
          query.filters[2].value[1] = query.filters[2].value[1] + " 00:00:00";
        }

        if(!hdAuthPermissionService.hasPermission("缴款登记")){
          query.filters[0].value=$rootScope.user.name;
        }

        for (var i = 0; i < $scope.dataManage.request.query.sorters.length; i++) {
          if ($scope.dataManage.request.query.sorters[i].direction != "") {
            query.sorters.push($scope.dataManage.request.query.sorters[i]);
          }
        }
        webService.commonProvide('/{shop}/paydelivery/query', 'POST', query).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.items = resp.data.data;
            $scope.total = resp.data.total;
            if (resp.data.total) {
              $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
            } else {
              $scope.pageCount = 1;
            }
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /*排序的实现*/
      $("th i").click(function () {
        var $this = $(this);
        $('th i').each(function (index) {
          if ($this.context != $(this).context) {
            $(this).removeClass("icon-jiangxu").removeClass("icon-shengxu").addClass("icon-morenpaixu");
            $scope.dataManage.request.query.sorters[index].direction = "";
          } else {
            $this.removeClass("icon-morenpaixu");
            if ($this.hasClass("icon-jiangxu")) {
              $this.removeClass("icon-jiangxu").addClass("icon-shengxu");
              $scope.dataManage.request.query.sorters[index].direction = "asc";
            } else {
              $this.removeClass("icon-shengxu").addClass("icon-jiangxu");
              $scope.dataManage.request.query.sorters[index].direction = "desc";
            }
          }
        });
        getItems();
      });

      /**
       * 查询事件
       * @constructor
       */
      $scope.search = function () {
        $scope.currentPage = 1;
        $scope.total = 0;
        getItems();
      };
      /**
       * 重置事件
       * @constructor
       */
      $scope.reset = function () {
        $scope.dataManage.request.query = angular.copy(defaultQuery);
        $scope.dataManage.dateType = "sevenDay";
        $scope.changeDate("sevenDay");
      };

      //tab的点击事件
      $scope.changeDate = function (newValue) {
        if (newValue == "sevenDay") {
          $scope.dataManage.request.query.filters[2].value[0] = hdUtils.date.getOtherDate(6);
          $scope.dataManage.request.query.filters[2].value[1] = "";
        } else if (newValue == "sixMonth") {
          $scope.dataManage.request.query.filters[2].value[0] = hdUtils.date.getMonthStartDate(5);
          $scope.dataManage.request.query.filters[2].value[1] = "";
        } else if (newValue == "threeMonth") {
          $scope.dataManage.request.query.filters[2].value[0] = hdUtils.date.getMonthStartDate(2);
          $scope.dataManage.request.query.filters[2].value[1] = "";
        }
      };

      //时间改变
      $scope.$watch("dataManage.request.query.filters[2].value[0]+dataManage.request.query.filters[2].value[1]",function(){
        if ($scope.dataManage.request.query.filters[2].value[0] == hdUtils.date.getOtherDate(6)&&$scope.dataManage.request.query.filters[2].value[1] =="") {
          $scope.dataManage.dateType = "sevenDay";
        } else if ($scope.dataManage.request.query.filters[2].value[0] == hdUtils.date.getMonthStartDate(5)&&$scope.dataManage.request.query.filters[2].value[1] =="") {
          $scope.dataManage.dateType = "sixMonth";
        } else if ($scope.dataManage.request.query.filters[2].value[0] == hdUtils.date.getMonthStartDate(2)&&$scope.dataManage.request.query.filters[2].value[1] =="") {
          $scope.dataManage.dateType = "threeMonth";
        } else {
          $scope.dataManage.dateType = "";
        }
      });

      //删除
      $scope.delete = function (item) {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "确定要删除这张收银缴款单吗?",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/delete', 'POST', null, {
              id: item.id,
              version: item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("删除成功", "success");
                hdDialog.hide();
                getItems();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //处理
      $scope.handle = function (item) {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "请确认是否完成长短款处理？",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/handle', 'POST', null, {
              id: item.id,
              version: item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("处理成功", "success");
                hdDialog.hide();
                getItems();
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
          dialogMsg: "确定要作废这张收银缴款单吗?",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/invalid', 'POST', null, {
              id: item.id,
              version: item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("作废成功", "success");
                hdDialog.hide();
                getItems();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      //签字
      $scope.sign = function (item) {
        hdDialog.show(null, {
          dialogTitle: "提示",
          dialogMsg: "请确认是否已经打印并双方签字了吗？",
          submitCallback: function () {
            webService.commonProvide('/{shop}/paydelivery/sign', 'POST', null, {
              id: item.id,
              version: item.version
            }).then(function (resp) {
              if (resp.data.success) {
                hdTip.tip("签字成功", "success");
                hdDialog.hide();
                getItems();
              } else {
                hdTip.tip(resp.data.message, "error");
              }
            });
          }
        });
      };

      $scope.print = function (item) {
        webService.commonProvide('/{shop}/paydelivery/get', 'get', null, {
          id: item.id
        }).then(function (resp) {
          if (resp.data.success) {
            doPrintSale(resp.data.data);
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      };

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
        //PrintMgr.print(tpl, order, -1);
      }

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
      /**************************************************分页事件start*********************************************/
      /**
       * 点击第一页或者最后一页调取服务
       * @param index 第一页还是最后一页
       */
      $scope.pageGo = function (index) {
        if (index == 1) { //如果点击的是页数1
          //此处调取服务
          getItems();
        } else if (index == $scope.pageCount) {
          //此处调取服务
          getItems();
        } else {
          //此处调取服务
          getItems();
        }
      };
      /**
       * 点击下一页
       */
      $scope.pageTo = function () {
        $scope.currentPage += 1;//当前页加1
        if ($scope.currentPage > 5 && $scope.currentPage < $scope.pageCount) {//如果下一页到第六页并且小于总页数
          if (($scope.page + 3) >= $scope.currentPage) {//点击下一页是否要更新页码
          } else {
            $scope.page = $scope.currentPage - 3;
          }
        }
        //此处调取服务
        getItems();
      };
      /**
       * 点击上一页
       */
      $scope.pageFrom = function () {
        $scope.currentPage -= 1;//当前页减1
        if ($scope.currentPage < $scope.pageCount - 4 && $scope.currentPage > 1) {
          if ($scope.page <= $scope.currentPage) {
          } else {
            $scope.page = $scope.currentPage;
          }
        }
        //此处调取服务
        getItems();
      };
      $scope.toThePage = function (page) {
        $scope.currentPage = parseInt(page);
        if (parseInt(page) >= $scope.pageCount - 4) {
          $scope.page = $scope.pageCount - 4;
        } else if (parseInt(page) <= 5) {
          $scope.page = 2;
        } else {
          $scope.page = parseInt(page)
        }
      };
      /**************************************************分页事件end*********************************************/

      /**************************************************启动*********************************************/
      init();

    }]);
})();
