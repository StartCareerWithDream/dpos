/**
 * Created by zhaorong on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleAddTop.Controller', function ($scope,hdDialog) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "query": {//一般查询条件
            "filters": [
              {
                "property": "",
                "value": ""
              }
            ],
            "sorters": [
              {
                "property": "",
                "direction": ""
              }
            ],
            "start": 0,
            "limit": 10
          },//查询条件
          "params": {}//其他参数
        },
        "response": {
          "shopDtl": {},//明细对象
          "shopList": []//列表对象
        }
      };
      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();
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

      }

      /**
       * 控件初始化
       */
      function initWidget() {

      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /**
       *按钮事件
       * @constructor
       */

      /**
       * 分页回调函数
       * @param number
       */
      $scope.eachPageEvent = function (number) {
        //getShopList(number);//调用你自己的方法
      };
      $scope.member={};
      $scope.memberShow = function(){
        if($scope.member.memberInfo!=''&&$scope.member.memberInfo!=undefined){
          $scope.$parent.saleAddMemberFlag = true;
          $scope.$parent.memberTab('会员信息');
        }else{
          $scope.$parent.saleAddMemberFlag = false;
          $scope.$parent.favoriteTab('收藏夹');
          $scope.$parent.isActiveTab = $scope.$parent.tabs[0];
          $scope.$parent.tabList = $scope.$parent.tabsInfo[0];
        }
      };
      $scope.pendingShow = function(){
        hdDialog.show('pendingDialog');
      };
      $scope.backTop = function(){
        $scope.$parent.backLeftOrRight = !$scope.$parent.backLeftOrRight;
      };
      //单号是否加密
      $scope.stateChange = function(){
          $scope.$parent.stateFlag  = !$scope.$parent.stateFlag;
      }
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
