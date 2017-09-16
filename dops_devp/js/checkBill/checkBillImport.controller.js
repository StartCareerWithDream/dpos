(function () {
  'use strict';
  angular.module('dposApp')
    .controller('checkBillImport.Controller', function ($scope, $rootScope, webService, $stateParams, $state, hdTip, hdDialog) {
      $scope.test = function () {
        hdDialog.show('errorDialog');
      }
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.tab1 = "all";
      $scope.confirmType = "";
      $scope.importId = "";

      $scope.changeTypeImportPara = {
        "importId": "",
        "checkId": ""
      }
      $scope.upImportPara = {
        "checkId": "",
        "setFileName": localStorage.getItem('setFileName')
      }

      $scope.dataManage = {
        "request": {
          "query": {//一般查询条件
            "filters": [
              {
                "property": "state:=",
                "value": $scope.confirmType
              }
            ],
            "sorters": [
              {
                "property": "",
                "direction": ""
              }
            ],
            "start": 0,
            "limit": 0
          },//查询条件
          "params": localStorage.currentUuid//其他参数
        },
        "response": {
          "shopDtl": {},//明细对象
          "shopList": []//列表对象
        },
      };
      /*分页*/
      $scope.pageCount = 1;//总页数，从服务中获得
      $scope.page = 2;
      $scope.currentPage = 1;//当前页
      $scope.pageSize = 10;
      $scope.dataManage.request.query.filters[0].value = "";
      $scope.total = 0;
      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

      //非切换状态跳转
      function checkConfirmedNumber() {
        $scope.upImportPara.checkId = localStorage.setId;

        $scope.dataManage.request.query.start = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.dataManage.request.query.limit = $scope.pageSize;
        webService.commonProvide('/{shop}/checkBill/import/preview', 'POST',
          $scope.dataManage.request.query
          , $scope.upImportPara).then(function (resp) {
            if (resp.data.success) {
              $scope.tableData = resp.data.data;
              $scope.normal = resp.data.summary.normalCount;
              $scope.undefinedCount = resp.data.summary.undefinedCount;
              $scope.totalCount = $scope.normal + $scope.undefinedCount;

              //dsj dpos-4728 云平台商品数
              $scope.platformCount = resp.data.summary.platformCount;

              $scope.total = resp.data.total;
              if($scope.normal == 0){
                $scope.disabledImport = true;
                $scope.showDisabledTitleInfo = "可识别数为零，无法进行导入";
              }else{
                $scope.disabledImport = false;
                $scope.showDisabledTitleInfo = "可以进行导入";
              }
              if(resp.data.total){
                $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
              }else{
                $scope.pageCount = 1;
              }
            } else {
              hdTip.tip(resp.data.message[0], 'error');
            }
          });
      }

      //切换状态跳转
      function checkTypeConfirmedNumber() {
        $scope.upImportPara.checkId = localStorage.setId;

        webService.commonProvide('/{shop}/checkBill/import/preview', 'POST',
          $scope.dataManage.request.query
          , $scope.upImportPara).then(function (resp) {
            if (resp.data.success) {
              $scope.tableData = resp.data.data;
              $scope.normal = resp.data.summary.normalCount;
              $scope.undefinedCount = resp.data.summary.undefinedCount;
              $scope.totalCount = $scope.normal + $scope.undefinedCount;

              //dsj dpos-4728 云平台商品数
              $scope.platformCount = resp.data.summary.platformCount;

              if($scope.normal == 0){
                $scope.disabledImport = true;
                $scope.showDisabledTitleInfo = "可识别数为零，无法进行导入";
              }else{
                $scope.disabledImport = false;
                $scope.showDisabledTitleInfo = "可以进行导入";
              }

              $scope.total = resp.data.total;
              if(resp.data.total){
                $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
              }else{
                $scope.pageCount = 1;
              }
            } else {
              hdTip.tip(resp.data.message[0], 'error');
            }
          });
      }


      /***********************************************************************************************************
       **************************************3、内部方法——工具、设置类型*********************************************/
      /**
       * 初始化
       */
      function init() {
        initWidget();//控件初始化+值初始化
        initDataManage();//数据管理值初始化
        initView();//页面初始化
      }

      /**
       * 数据管理值初始化
       */
      function initDataManage() {

      }

      /**
       * 页面初始化
       */
      function initView() {
        $scope.importPara = {
          "checkId": ""
        }
        checkConfirmedNumber();
      }

      /**
       * 控件初始化
       */
      function initWidget() {

      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /**
       *关闭dialog
       * @constructor
       */
      $scope.closecleanStock = function () {
        hdDialog.hide('cleanStock');
      }
      $scope.closestartImport = function () {
        hdDialog.hide('startImport');
      }
      $scope.closeerrorDialog = function () {
        hdDialog.hide('errorDialog');
      }
      $scope.closesuccessDialog = function () {
        hdDialog.hide('successDialog');
      }
      /**
       *link事件
       * @constructor
       */
      $scope.linkFunc = function () {

      }

      /*
       * 切换识别商品种类
       **/
      $scope.pickConfirmType = function (type) {
        if (type == "all") {
          $scope.dataManage.request.query.filters[0].value = "";
        } else if (type == "normal") {
          $scope.dataManage.request.query.filters[0].value = "normal";
        } else if (type == "undefined") {
          $scope.dataManage.request.query.filters[0].value = "undefined";
        }
        $scope.currentPage = 1
        $scope.importPara = {
          "checkId": ""
        }
        $scope.dataManage.request.query.start = 0;
        $scope.dataManage.request.query.limit = 10;
        // $scope.dataManage.request.query.start = ($scope.currentPage - 1) * $scope.pageSize;
        // $scope.dataManage.request.query.limit = $scope.pageSize;
        $scope.importPara.checkId = localStorage.setId;
        checkTypeConfirmedNumber();
      }


      /**选择事件
       *
       * @constructor
       */
      $scope.selFunc = function () {

      }

      /*
       * 打开清除摸态框
       * */
      $scope.openCleanStock = function () {
        hdDialog.show('cleanStock');
      }

      /*
       * 打开导入摸态框
       * */
      $scope.startImport = function () {
        hdDialog.show('startImport');
      }

      /*
       * 开始导入摸态框
       * */
      $scope.importFile = function () {
        hdDialog.hide('startImport');
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        $scope.importPara.importId = uuid;
        $scope.importPara.checkId = localStorage.setId;
        webService.commonProvide('/{shop}/checkBill/import', 'GET', '', $scope.importPara).then(function (resp) {
          if (resp.data.success) {
            hdDialog.show('successDialog');
            $scope.dtlId = resp.data.data;
            $rootScope.upLoadFileList = [];
          } else {
            hdDialog.show('errorDialog');
          }
        });
      }

      /*
       * 点击再次导入
       * */
      $scope.startImportAgain = function () {
        hdDialog.hide('errorDialog');
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        $scope.importPara.currentUuid = uuid;
        $scope.importPara.checkId = localStorage.setId;
        $scope.dataManage.request.query.start = ($scope.currentPage - 1) * $scope.pageSize;
        $scope.dataManage.request.query.limit = $scope.pageSize;


        webService.commonProvide('/{shop}/checkBill/import', 'GET', '', $scope.importPara).then(function (resp) {
          if (resp.data.success) {
            if(resp.data.total){
              $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
            }else{
              $scope.pageCount = 1;
            }
            hdDialog.show('successDialog');
            $rootScope.upLoadFileList = [];
          } else {
            hdDialog.show('errorDialog');
          }
        });
      }

      /*
       * 清空库存
       * */
      $scope.cleanAllStock = function () {
        hdDialog.hide('cleanStock');
        $scope.cImportPara = {
          "checkId": ""
        }

        $scope.cImportPara.checkId = localStorage.setId;
        //清空库存
        webService.commonProvide('/{shop}/checkBill/import/clearInv', 'GET', '', $scope.cImportPara).then(function (resp) {
          if (resp.data.success) {
            hdTip.tip("清除成功", "success");
            $scope.tableData = resp.data.data;
            checkConfirmedNumber();
          } else {
            hdTip.tip("清除失败", "error");
          }
        });
      }

      $scope.trunTocheckBillDtl = function () {
        console.log($scope.dtlId);
        $state.go('checkBillDtl',{"id":$scope.dtlId});
      }

      /**************************************************分页事件start*********************************************/
      /**
       * 点击第一页或者最后一页调取服务
       * @param index 第一页还是最后一页
       */
      $scope.pageGo = function (index) {
        if (index == 1) { //如果点击的是页数1
          //此处调取服务
          init();
        } else if (index == $scope.pageCount) {
          //此处调取服务
          init();
        } else {
          //此处调取服务
          init();
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
        init();
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
        init();
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

      // dsj DPOS-4728 导入云平台商品
      $scope.platSkuImport = function() {
        $state.go('platSkuImport')
      }
      /**************************************************分页事件end*********************************************/


      /***********************************************************************************************************
       **************************************5、广播**************************************************************/
      /**
       * 发送到**的广播
       */
      $scope.$broadcast('**', '**');
      /**
       * 发送到**的广播
       */
      $scope.$emit('**', '**');
      /**
       * 接收来自**的广播
       */
      $scope.$on('**', function (event, data) {

      })

    });

})();

