/**
 * Created by dsj on 2017/5/26.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('platSkuImport.Controller', function ($scope,webService,hdTip,$state,hdDialog) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      // 本次导入的唯一标识
      $scope.checkId = {
        "checkId": localStorage.getItem('setId')
      }

      //共有记录数
      $scope.skuCountAll = 0;
      $scope.skuCountPage = 0;

      // 导入当前页按钮的文字
      $scope.txtBtn1 = '忽略当前商品';

      //是否全选本页
      $scope.selectPage = false;

      //数据定义集
      $scope.dataManage = {
        // 用于显示
        "skuList" : [
         /* {
            "id": "b4074a2d-ea12-42c6-b162-23d19bbe4c3d",
            "barcode": "6920907805161",
            "name": "好丽友木糖醇3+无糖口香糖超檬味101g",
            "qpcText": "",
            "munit": "瓶",
            "salePrice": 10,
            "weighed": false,
            "tags": [],
            "focus": true,
            "minInvQty": 0
          }*/
        ],
        // 用于提交
        "skus": {
          "skus": [
            /*{
             "tags": [
             "蔬菜"
             ],
             "id": "74d98311-a7ea-11e6-a8ce-6c92bf31542f",
             "weighed": true,
             "barcode": "6900255288601",
             "salePrice": 50,
             "minInvQty": 10
             }*/
            ]
        },

        "tags": []
      };


      /***********************************************************************************************************
       **************************************3、内部方法——工具、设置类型*********************************************/
      /**
       * 初始化
       */
      function init() {
        svcGetTags();
        svcSkuList();
      }

      // 服务: 获得第一页数据
      function svcSkuList(){
        webService.commonProvide('/{shop}/checkBill/platform/sku/list', 'get', '', $scope.checkId).then(function (resp) {
          if (resp.data) {
            // 正常返回值的情况
            if (resp.data.success) {
              $scope.dataManage.skuList = resp.data.data;
              $scope.skuCountAll = resp.data.total;

              if ($scope.skuCountAll < 20) {
                $scope.skuCountPage = $scope.skuCountAll;
              }
              else {
                $scope.skuCountPage = 20;
              }
            }
            else {
              hdTip.tip("请求失败","error", resp.message.toString());
            }
          }
          else {
            hdTip.tip("请求失败","error", '系统错误');
            console.log(resp);
          }
        }).catch(function (local) {
          console.log(local);
        });
      }

      // 服务: 提交本页
      function svcImportPage(){
        webService.commonProvide('/{shop}/checkBill/sku/import', 'post', $scope.dataManage.skus, $scope.checkId).then(function (resp) {
          if (resp.data) {
            // 正常返回值的情况
            if (resp.data.success) {
              //更新当页显示的数据
              if (resp.data.data.length > 0) {
                hdTip.tip("选择商品导入成功", "success", '为您显示下一批的云平台商品');
                $scope.dataManage.skuList = resp.data.data;
                if (resp.data.total < 20) {
                  $scope.skuCountPage = resp.data.total
                }
                else {
                  $scope.skuCountPage = 20;
                }
                $scope.txtBtn1 = '忽略当前商品';
              }
              else {
                hdTip.tip("选择商品导入成功","success",'没有更多商品了');
                goBack();
              }
            }
            else {
              hdTip.tip("请求失败","error", resp.message.toString());
            }
          }
          else {
            hdTip.tip("请求失败","error", '系统错误');
            console.log(resp);
          }
        }).catch(function (local) {
          console.log(local);
        });
      }

      // 服务: 提交全部
      function svcImportAll(){
        webService.commonProvide('/{shop}/checkBill/sku/import/all', 'post', '', $scope.checkId).then(function (resp) {
          if (resp.data) {
            // 正常返回值的情况
            if (resp.data.success) {
              hdTip.tip("全部商品导入成功","success",'返回盘点单导入页面');
              goBack();
            }
            else {
              hdTip.tip("请求失败","error", resp.message.toString());
            }
          }
          else {
            hdTip.tip("请求失败","error", '系统错误');
            console.log(resp);
          }
        }).catch(function (local) {
          console.log(local);
        });
      }

      // 路由 : 返回上一页( checkBillImport页面)
      function goBack() {
        $state.go('checkBillImport');
      }

      // 服务: 获得标签列表
      function  svcGetTags() {
        var temp = {
          "page":1,
          "start":0,
          "limit":25
        }
        webService.commonProvide('/{shop}/shopSkuService/getShopSkuTags', 'get', '', temp).then(function (resp) {
          if (resp.data) {
            // 正常返回值的情况
            if (resp.data.success) {
              $scope.dataManage.tags = resp.data.data;
            }
            else {
              // hdTip.tip("请求失败","error", resp.message.toString());
            }
          }
          else {
            hdTip.tip("标签请求失败","error", '系统错误');
            console.log(resp);
          }
        }).catch(function (local) {
          console.log(local);
        });
      }



      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/

      // 点击导入本页
      $scope.clickImportPage = function() {
        var sku = {};

        // 整理数据
        $scope.dataManage.skus.skus= [];
        for (var i = 0; i < $scope.dataManage.skuList.length; i++ ) {
          if (!$scope.dataManage.skuList[i].selected) {continue;}

          sku = {
            "tags": [$scope.dataManage.skuList[i].tag],
            "id": $scope.dataManage.skuList[i].id,
            "weighed": $scope.dataManage.skuList[i].weighed,
            "barcode": $scope.dataManage.skuList[i].barcode,
            "salePrice": $scope.dataManage.skuList[i].salePrice,
            "minInvQty": $scope.dataManage.skuList[i].minInvQty
          }
          $scope.dataManage.skus.skus.push(sku);
        }

        //  服务: 导入本页
        svcImportPage();
      }

      // 点击导入全部
      $scope.clickImportAll = function() {
        //确认提示
        hdDialog.show(null,{
          dialogTitle:"提示",//可选
          dialogMsg:"选择导入全部商品，您针对单个商品填写的信息将不被保存。",//可选
          submitCallback:function(){
            //点击确定的话, 继续导入
            svcImportAll();
            hdDialog.hide();
          }
        });

        // svcImportAll();
      }

      // 全部商品勾选
      $scope.clickChkAll = function(isTrue) {
        for (var i = 0; i < $scope.dataManage.skuList.length; i++) {
          $scope.dataManage.skuList[i].selected = isTrue;
        }


        // 改变按钮文字
        $scope.txtBtn1 = '忽略当前商品';
        if (isTrue && $scope.dataManage.skuList.length > 0) {
          $scope.txtBtn1 = '导入当前商品';
        }
      }

      // 单条商品勾选
      $scope.clickChkSingle = function(isTrue) {
        // 任意一个不勾选, 全部勾选框不勾选
        if (!isTrue) {
          $scope.selectPage = false;
        }
        else {
          $scope.selectPage = true;
          for (var i = 0; i < $scope.dataManage.skuList.length; i++) {
            if (!$scope.dataManage.skuList[i].selected) {
              $scope.selectPage = false;
              break;
            }
          }
        }


        // 改变按钮文字
        $scope.txtBtn1 = '忽略当前商品';
        for (var i = 0; i < $scope.dataManage.skuList.length; i++) {
          if ($scope.dataManage.skuList[i].selected) {
            $scope.txtBtn1 = '导入当前商品';
            break;
          }
        }
      }

      // 标签
      $scope.selTag = function () {
      //  todo 标签
      }


      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

    });

})();

