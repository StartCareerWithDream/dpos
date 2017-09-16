(function () {
  'use strict';
  angular.module('dposApp')
    .controller('checkBillList.Controller', function ($scope, webService, hdTip, $state) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "query": {//一般查询条件
            "sorters": [
              {
                "property": "number",     //单号排序
                "direction": ""
              },
              {
                "property": "created",    //生成时间排序
                "direction": ""
              }
            ],
            "start": 0,
            "limit": 0
          },//查询条件
          "params": {}//其他参数
        },
        "response": {
          "shopDtl": {},//明细对象
          "items": []//列表对象
        }
      };
      /*分页*/
      $scope.pageCount = 1;//总页数，从服务中获得
      $scope.page = 2;
      $scope.currentPage = 1;//当前页
      $scope.pageSize = 10;
      $scope.total = 0;
      /***********************************************************************************************************
       **************************************3、内部方法——工具、设置类型*********************************************/
      //获取盘点单列表
      function getItems() {
        //获取盘点单列表
        var query = {
          start: ($scope.currentPage - 1) * $scope.pageSize,
          limit: $scope.pageSize,
          sorters: []
        };
        for (var i = 0; i < $scope.dataManage.request.query.sorters.length; i++) {
          if ($scope.dataManage.request.query.sorters[i].direction != "") {
            query.sorters.push($scope.dataManage.request.query.sorters[i]);
          }
        }
        //$scope.dataManage.request.query.start = ($scope.currentPage - 1) * $scope.pageSize;
        //$scope.dataManage.request.query.limit = $scope.pageSize;
        webService.commonProvide('/{shop}/checkBill/list', 'POST', query).then(function (resp) {
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

      /**
       * 初始化
       */
      function init() {
        $("th i")[0].click();
      }


      /*排序的实现*/
      $("th i").click(function () {
        var $this = $(this);
        $('th i').each(function (index) {
          if ($this.context != $(this).context) {
            $(this).removeClass("fa-arrow-circle-down").removeClass("fa-arrow-circle-up").addClass("fa-stop-circle");
            $scope.dataManage.request.query.sorters[index].direction = "";
          } else {
            $this.removeClass("fa-stop-circle");
            if ($this.hasClass("fa-arrow-circle-down")) {
              $this.removeClass("fa-arrow-circle-down").addClass("fa-arrow-circle-up");
              $scope.dataManage.request.query.sorters[index].direction = "asc";
            } else {
              $this.removeClass("fa-arrow-circle-up").addClass("fa-arrow-circle-down");
              $scope.dataManage.request.query.sorters[index].direction = "desc";
            }
          }
        });
        getItems();
      });

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
      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
        //跳转至导入盘点单页面
      $scope.gotoCheckBillUpload = function () {
        $state.go("checkBillUpload");

        Logger.bury({
          id: "DPOS_GOODS_CHECK_CKRESULTIN_CK",
          machine_id: true,
          store_id: true,
          machine_store_id: true,
          user_id: true,
          phone_number: true
        });
      };

      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

      Logger.bury({
        id: "DPOS_GOODS_CHECK_SW",
        machine_id: true,
        store_id: true,
        machine_store_id: true,
        user_id: true,
        phone_number: true
      });
    });

})();
