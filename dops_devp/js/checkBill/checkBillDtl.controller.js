(function () {
  'use strict';
  angular.module('dposApp')
    .controller('checkBillDtl.Controller', function ($scope,webService,$stateParams,hdTip,$state) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "query": {//一般查询条件
            "sorters": [
              {
                "property": "",
                "direction": ""
              }
            ],
            "start": 0,
            "limit": 0
          },//查询条件
          "params": {}//其他参数
        },
        "response": {
          "summary":{},
          "dtl": {},//明细对象
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
      function getDetail(){
        //获取详情
        webService.commonProvide('/{shop}/checkBill/detail/get', 'GET', null,{
          checkBill:$stateParams.id
        }).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.dtl = resp.data.data;
            $scope.dataManage.response.summary  = resp.data.summary;
          } else {
            hdTip.tip(resp.data.message[0],'error');
          }
        });
      }

      function getDetailLineList(){
        //获取详情明细列表
        webService.commonProvide('/{shop}/checkBill/detail/lineList', 'POST',{
          "start": ($scope.currentPage - 1) * $scope.pageSize,
          "limit": $scope.pageSize
        },{checkBill:$stateParams.id}).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.items = resp.data.data;
            $scope.total = resp.data.total;
            if(resp.data.total){
              $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
            }else{
              $scope.pageCount = 1;
            }
          } else {
            hdTip.tip(resp.data.message[0],'error');
          }
        });
      }

      function initDataManage() {
        getDetail();
        getDetailLineList();
      }

      /**
       * 页面初始化
       */
      function initView() {

      }

      /**
       * 控件初始化
       */
      function initWidget() {

      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/


      /**
       * 上一单，下一单 的点击事件
       * @constructor
       */
      $scope.goDetail = function (id) {
        if(id){
          $state.go("checkBillDtl",{id:id});
        }
      };
      /**
       *link事件
       * @constructor
       */
      $scope.linkFunc = function () {

      }
      /**选择事件
       *
       * @constructor
       */
      $scope.selFunc = function () {

      }
      /**************************************************分页事件start*********************************************/
      /**
       * 点击第一页或者最后一页调取服务
       * @param index 第一页还是最后一页
       */
      $scope.pageGo = function (index) {
        if (index == 1) { //如果点击的是页数1
          //此处调取服务
          getDetailLineList();
        } else if (index == $scope.pageCount) {
          //此处调取服务
          getDetailLineList();
        } else {
          //此处调取服务
          getDetailLineList();
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
        getDetailLineList();
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
        getDetailLineList();
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
      $scope.$watch('pageItem', function (newVal, oldVal) {
        $scope.currentPage = 1;
        $scope.page = 2;
        $scope.innerPage = '';
      })
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

      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

    });

})();

