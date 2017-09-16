/**
 * Created by zhaorong on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleAdd.Controller', function ($scope,webService,hdTip) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "posparams":{//获取本机绑定的信息
            "id":'',
            "machineCode":'',//本机的code
            "shop":''
          },
          "shopparams":{//获取门店配置中销售相关的内容
            "posNo":''
          },
          "membermatchparams":{//会员录入信息
            "page":1,
            "start": 0,
            "limit": 10,
            "code":''
          },
          "addmemberparams":{//会员录入手机号码新增
            "id":'',
            "mobile":'',
            "name":''
          },
          "memberparams":{//获取会员信息
              "id":'',
              "couponLimit":'',
              "oftenLimit":''
          },
          "memberedidparams":{//会员编辑名称

          },
          "membertagparams":{//会员标签列表
            "page":1,
            "start": 0,
            "limit": 10,
          },
          "membergetpay":{//获取会员储值信息
              "id":'',
              "containBalance":''
          },
          "skuquery": {//录入商品查询
            "page":1,
            "start": 0,
            "limit": 10,
            "code":''
          },
          "addskuparams":{//录入商品新建
            "code":''
          },
          "skutagquery":{//商品标签列表
              "page":1,
              "start":0,
              "limit":25
          },
          "skusimpleparams":{//简易商品信息
              "uuid":'',
              "fetch_parts":''
          },
          "skudetailparams":{//编辑商品保存数据

          },
          "favoriteparams":{//收藏夹分类列表查询
            "category":''
          },
          "addfavoriteparams":{//新建收藏夹
            "name":''
          },
          "editfavoriteparams":{//编辑收藏夹
              "categoryName":''
          },
          "removefavoriteparams":{//删除收藏夹
            "category":'',
            "version":''
          },
          "favoriteaddskuparams":{//收藏夹中新增商品
            "categoryName":"",
            //"created":"",
            //"id":"",
            //"lastModified":"",
            "shop":"",
            "shopSku":""
            //"skuIndex":"",
            //"version":""
          },
          "favoritegetskuparams":{//收藏夹中得到商品
            "uuid":""
          },
          "favoriteeditskuparams":{//收藏夹中编辑商品
            "uuid":"",
            "shortName":"",
            "version":""
          },
          "favoriteskumoveparams":{//收藏夹中商品移动分组
            "categoryName":"",
            "created":"",
            "id":"",
            "lastModified":"",
            "shop":"",
            "shopSku":"",
            "shortName":"",
            "skuIndex":"",
            "version":""
          },
          "favoriteskusortparams":{//收藏夹中拖动商品
            "categoryName":"",
            //"created":"",
            "id":"",
            //"lastModified":"",
            "shop":"",
            "shopSku":"",
            "skuIndex":"",
            "version":""
          },
          "favoriteskuremoveparams":{//收藏夹中删除
            "uuids":""
          },
          "paydiscountparams":{//优惠券查找

          },
          query2:{//新增商品
            "start": 0,
            "limit": 10,
            "query": '',
            "filter": [
              {
                "property": "searchKey:%=%",
                "value": ""
              }
            ]
          }
        },
        "response": {
          "shopData":{},//获取门店配置中销售相关的内容
          "memberData":{},//会员信息
          "membermatchData":{},//会员录入匹配
          "addmemberData":{},//新增会员列表
          "memebertagList":[],//会员中的标签列表
          "membergetpayData":{},//会员储值信息
          "paydiscountData":{},//优惠券
          "posData":{},//绑定手机号到本机数据
          "pendingList":[],//挂单列表
          "skutagList":[],//标签列表
          "skusimpleData":{},//简易商品信息
          "skudetailData":{},//编辑商品保存得到的数据
          "favoriteList":[],//收藏夹分类列表
          "skufavcategoryList": [],//收藏夹商品类名
          "skufavoriteList": [],//收藏夹商品列表
          "newfavoriteData":{},//新增的收藏夹
          "favoriteaddskuData":{},//收藏夹中新添商品
          "favoritegetskuData":{},//收藏夹中得到商品
          "favoriteeditskuData":{},//收藏夹中编辑商品
          "totalCount":'',//目前拥有的收藏夹数量
          "favProdLimit":'',//总的收藏夹数量限制
          "query2Data":[]//新增商品列表
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
      //左侧返回按钮，控制右侧是否展示
      $scope.backLeftOrRight = true;
      //控制会员信息tab是否展示
      $scope.saleAddMemberFlag = false;
      //收藏夹和会员信息的切换
      $scope.favoriteFlag = true;
      $scope.memberFlag = false;
      $scope.favoriteTab = function(changeTab){
        if(changeTab=='收藏夹'){
          $("li[name=tab3]:eq(1)").removeClass('tbfocus');
          $("li[name=tab3]:eq(0)").addClass('tbfocus');
        }
        $scope.favoriteFlag = true;
        $scope.memberFlag = false;
      };
      $scope.memberTab = function(changeTab){
        if(changeTab=='会员信息'){
          $("li[name=tab3]:eq(0)").removeClass('tbfocus');
          $("li[name=tab3]:eq(1)").addClass('tbfocus');
        }
        $scope.favoriteFlag = false;
        $scope.memberFlag = true;
      };
      //单号加密
      $scope.stateFlag = true;

      //收藏夹
      $scope.favoriteByshopFunc = function(){
        webService.commonProvide('/{shop}/skuFavorite/get/byShop', 'get', '','').then(function (resp) {
          if (resp&&resp.data.success) {
              if(resp.data.data.skufavcategory.length==0){//没有收藏数据
                $scope.dataManage.response.skufavcategoryList = resp.data.data.skufavcategory;//收藏夹名称分类列表
                $scope.dataManage.response.skufavoriteList = resp.data.data.skufavoriteList;//收藏夹名称分类列表
                return;
              }else{
                $scope.dataManage.response.skufavcategoryList = resp.data.data.skufavcategory;//收藏夹名称分类列表
                $scope.dataManage.response.skufavoriteList = resp.data.data.skufavoriteList;//收藏夹名称分类列表
                $scope.dataManage.response.favProdLimit = resp.data.fields.favProdLimit;//总限制数
                $scope.dataManage.response.totalCount = resp.data.fields.totalCount;//目前拥有的数
                $scope.isActiveTab = $scope.dataManage.response.skufavcategoryList[0].categoryName;
                $scope.isActiveTabMod = $scope.dataManage.response.skufavcategoryList[0];
                $scope.tabList = $scope.dataManage.response.skufavoriteList;
                $scope.tabListMod = $scope.dataManage.response.skufavoriteList;
                for(var i=0;i<$scope.tabListMod.length;i++){
                  $scope.tabListMod[i].checked = false;
                }
                $scope.tabListCopy = angular.copy($scope.tabList);
                $scope.tabListModCopy = angular.copy($scope.tabListMod);
              }
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      $scope.favoriteByshopFunc();
    });

})();
