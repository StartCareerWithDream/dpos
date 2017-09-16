/**
 * Created by zhaorong on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleAddFavoriteMod.Controller', function ($document,$scope,$timeout,webService,hdTip,hdDialog) {
      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      //新增收藏夹
      $scope.addFavorite = function(){
        hdDialog.show('newFavoriteDialog');
        $scope.$parent.dataManage.request.addfavoriteparams.name = '';
      };
      //点击切换收藏夹分类
      $scope.onClickTabMod = function (tab) {
        $scope.$parent.isActiveTabMod = tab;
        $scope.config={
          checkAll:false,
          checked:[]
        };
        $scope.favoriteModEditSelfFlag = true;
        $scope.favoriteByCategoryFunc(tab);
      };
      //收藏夹类名切换
      $scope.favoriteByCategoryFunc = function(tab){
        $scope.$parent.dataManage.request.favoriteparams ={
          "category":tab.categoryName
        }
        webService.commonProvide('/{shop}/skuFavorite/get/byCategory', 'get', '',$scope.$parent.dataManage.request.favoriteparams).then(function (resp) {
          if (resp&&resp.data.success) {
            $scope.$parent.dataManage.response.favoriteList = resp.data.data;
            $scope.$parent.tabListMod = $scope.$parent.dataManage.response.favoriteList;
            for(var i=0;i<$scope.$parent.tabListMod.length;i++){
              $scope.$parent.tabListMod[i].checked = false;
            }
            $scope.$parent.tabListModCopy = angular.copy($scope.$parent.tabListMod);
            $scope.$parent.dataManage.response.favProdLimit = resp.data.fields.favProdLimit;//总限制数
            $scope.$parent.dataManage.response.totalCount = resp.data.fields.totalCount;//目前拥有的数
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      //新建收藏夹保存
      $scope.dialogSubmit = function(){
        if(!commonVerify('addfavorite')) {return false;}
        var addfavoriteparams = $.param($scope.$parent.dataManage.request.addfavoriteparams);
        webService.attachProvide('/{shop}/skuFavorite/saveNewSkuFavCategory', 'post', addfavoriteparams,'').then(function (resp) {
          if (resp&&resp.data.success) {
           $scope.$parent.favoriteByshopFunc();
            $('#run').css({'left':0});
            hdDialog.hide('newFavoriteDialog');
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      //编辑收藏夹
      $scope.editFavorite = function(tab,$event){
        $event.stopPropagation();
        hdDialog.show('editFavoriteModDialog');
        $scope.$parent.dataManage.request.editfavoriteparams = {
          "categoryName":tab.categoryName,
          "id":tab.id,
          "version":tab.version,
          "shop":tab.shop,
          "created":tab.created,
          "lastModified":tab.lastModified
        }
      };
      //编辑收藏夹保存
      $scope.editFavoriteModDialogSave = function(){
        if(!commonVerify('editfavorite')) {return false;}
        webService.commonProvide('/{shop}/skuFavorite/saveModifySkuFavCategory', 'post', $scope.$parent.dataManage.request.editfavoriteparams,'').then(function (resp) {
          if (resp&&resp.data.success) {
            $scope.$parent.favoriteByshopFunc();
            hdDialog.hide('editFavoriteModDialog');
            $scope.favoriteModEditSelfFlag = true;
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      //删除收藏夹
      $scope.removeFavorite = function(tab,$event){
        $event.stopPropagation();
        hdDialog.show(null,{
          dialogTitle:'删除收藏夹分类',
          dialogMsg:'确认删除收藏夹分类?',
          submitCallback:function(){
            $scope.$parent.dataManage.request.removefavoriteparams ={
              'category':tab.categoryName,
              'version':tab.version
            }
            var removefavoriteparams = $.param($scope.$parent.dataManage.request.removefavoriteparams);
            webService.attachProvide('/{shop}/skuFavorite/removeSkuFavCategory', 'post',removefavoriteparams,'').then(function (resp) {
              if (resp&&resp.data.success) {
                $scope.$parent.favoriteByshopFunc();
                $('#run').css({'left':0});
                hdDialog.hide();
                $scope.favoriteModEditSelfFlag = true;
              } else {
                hdTip.tip(resp.data.message[0], 'error');
              }
            })
          }
        })
      }
      //编辑收藏夹的分类
      $scope.favoriteModEditSelfFlag = true;//箭头的方向
      $scope.favoriteModEditSelf = function(event,index){
        //阻止事件冒泡
        event.stopPropagation();
        $scope.favoriteModEditSelfFlag = !$scope.favoriteModEditSelfFlag;
        if(!$scope.favoriteModEditSelfFlag){//打开状态
          $('#hhhh'+index).focus();
        }
      };
      //点击其他区域关闭tips
      $scope.closeTips = function(){
        $scope.favoriteModEditSelfFlag = true;
      }
      //收藏夹新加新商品
      function getSkuShopInfo(){
        $scope.$parent.dataManage.request.query2.filter = [{"property": "searchKey:%=%","value": $scope.$parent.dataManage.request.query2.query}];
        $scope.$parent.dataManage.request.query2.filter = angular.toJson($scope.$parent.dataManage.request.query2.filter);
        webService.commonProvide('/{shop}/shopSkuService/queryInputSearch', 'GET', '', $scope.$parent.dataManage.request.query2).then(function (resp) {
          if (resp && resp.data && resp.data.success) {
            $scope.$parent.dataManage.response.query2Data = resp.data.data;
            for(var i = 0; i < $scope.$parent.dataManage.response.query2Data.length ; i++){
              if($scope.$parent.dataManage.response.query2Data[i].name){
                while($scope.$parent.dataManage.response.query2Data[i].name.indexOf("<em>")!= -1||$scope.$parent.dataManage.response.query2Data[i].name.indexOf("</em>")!= -1){
                  $scope.$parent.dataManage.response.query2Data[i].name = $scope.$parent.dataManage.response.query2Data[i].name.replace('<em>','');
                  $scope.$parent.dataManage.response.query2Data[i].name = $scope.$parent.dataManage.response.query2Data[i].name.replace('</em>','');
                }
              }
            }
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      $timeout(function(){
        initHdInputSearch('hdInputSearch1', 2)
      },100)
      // 单选建议框的回调函数1: 输入字符串后, 可以开始调用后台服务
      $scope.hdInputSearchStart = function(jqueryObj, hdId) {
        if (hdId == 'hdInputSearch1') {
          getSkuShopInfo();
        }
      };
      // 单选建议框的回调函数2: 选中一个, 可以得到输入框中的对象信息
      $scope.hdInputSearchCheckOne = function(jqueryObj, hdId) {
        if (hdId == 'hdInputSearch1') {
          var jsonObj = JSON.parse(jqueryObj.attr('itemObj'));
          console.log(jsonObj);
          jqueryObj.val(jsonObj.name);
          $scope.$parent.dataManage.request.favoriteaddskuparams = {
            "categoryName":$scope.$parent.isActiveTabMod.categoryName,
            "shop":$scope.$parent.isActiveTabMod.shop,
            "shopSku":jsonObj.id
          };
          webService.commonProvide('/{shop}/skuFavorite/saveNew', 'post',$scope.$parent.dataManage.request.favoriteaddskuparams,'').then(function (resp) {
            if (resp&&resp.data.success) {
              $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
              jsonObj = '';
              jqueryObj.val('');
            } else {
              hdTip.tip(resp.data.message[0], 'error');
              jsonObj = '';
              jqueryObj.val('');
            }
          })
        }
      };
      //编辑商品
      $scope.favoriteModEdit = function(shopSku){
          hdDialog.show('editFavoriteDialog');
        $scope.$parent.dataManage.request.favoriteeditskuparams.uuid = '';
          $scope.$parent.dataManage.request.favoritegetskuparams = {
            'uuid':shopSku
          };
          webService.commonProvide('/{shop}/shopSkuService/readSimple', 'get','',$scope.$parent.dataManage.request.favoritegetskuparams).then(function (resp) {
            if (resp&&resp.data.success) {
              $scope.$parent.dataManage.response.favoritegetskuData = resp.data.data;
              $scope.resetName = resp.data.data.name;
              console.log(resp.data.data);
            } else {
              hdTip.tip(resp.data.message[0], 'error');
            }
          })
      };
      //使用默认民称
      $scope.favoriteModNameReset = function(){
        $scope.$parent.dataManage.response.favoritegetskuData.shortName = $scope.resetName;
      };
      //编辑商品保存按钮
      $scope.favoriteModEditSave = function(){
        $scope.$parent.dataManage.request.favoriteeditskuparams ={
            'uuid':$scope.$parent.dataManage.response.favoritegetskuData.uuid,
            'shortName':$scope.$parent.dataManage.response.favoritegetskuData.shortName,
            'version':$scope.$parent.dataManage.response.favoritegetskuData.version
        };
        var favoriteeditskuparams  = $.param($scope.$parent.dataManage.request.favoriteeditskuparams);
        webService.attachProvide('/{shop}/skuFavorite/updataSkuShortName', 'post',favoriteeditskuparams,'').then(function (resp) {
          if (resp&&resp.data.success) {
            $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
            hdDialog.hide('editFavoriteDialog');
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      //移动商品分组
      $scope.favoriteModMove = function(index){
        hdDialog.show('moveFavoriteDialog');
        $scope.moveSKuDetail  = $scope.$parent.tabListMod[index];
        $scope.$parent.dataManage.request.favoriteskumoveparams = {
          "categoryName":$scope.moveSKuDetail.categoryName,
          "created":$scope.moveSKuDetail.created,
          "id":$scope.moveSKuDetail.id,
          "lastModified":$scope.moveSKuDetail.lastModified,
          "shop":$scope.moveSKuDetail.shop,
          "shopSku":$scope.moveSKuDetail.shopSku,
          "shortName":$scope.moveSKuDetail.shortName,
          "skuIndex":$scope.moveSKuDetail.skuIndex,
          "version":$scope.moveSKuDetail.version
        };
        moveSkuArr.push($scope.$parent.dataManage.request.favoriteskumoveparams);
      };
      //多选模拟单选
      $scope.favoriteModChange = function(item){
          for(var i=0;i<$scope.$parent.dataManage.response.skufavcategoryList.length;i++){
            $scope.$parent.dataManage.response.skufavcategoryList[i].checked = false;
          }
          item.checked = true;
      };
      //移动商品保存
      var moveSkuArr =[];
      $scope.favoriteModMoveSave = function(){
        var moveparams={};
        for(var i=0;i<$scope.$parent.dataManage.response.skufavcategoryList.length;i++){
          if($scope.$parent.dataManage.response.skufavcategoryList[i].checked==true){
            moveparams = $scope.$parent.dataManage.response.skufavcategoryList[i];
          }
        }
        webService.commonProvide('/{shop}/skuFavorite/moveTo/category', 'post',moveSkuArr,{'category':moveparams.categoryName}).then(function (resp) {
          if (resp&&resp.data.success) {
            $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
            hdDialog.hide('moveFavoriteDialog');
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      }
      //删除商品
      $scope.favoriteModDelete = function(uuid){
        hdDialog.show(null,{
          dialogTitle:'删除商品',
          dialogMsg:'确认删除商品?',
          submitCallback:function(){
            $scope.$parent.dataManage.request.favoriteskuremoveparams ={
              'uuids':uuid
            }
            var favoriteskuremoveparams = $.param($scope.$parent.dataManage.request.favoriteskuremoveparams);
            webService.attachProvide('/{shop}/skuFavorite/delete/batch', 'post',favoriteskuremoveparams,'').then(function (resp) {
              if (resp&&resp.data.success) {
                $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
                hdDialog.hide();
              } else {
                hdTip.tip(resp.data.message[0], 'error');
              }
            })
          }
        })
      };
      //全选
      $scope.config={
        checkAll:false,
        checked:[]
      };
      $scope.selectAll = function () {
        if ($scope.config.checkAll) {
          $scope.config.checked = [];
          angular.forEach($scope.$parent.tabListMod, function (i) {
            i.checked = true;
            $scope.config.checked.push(i);
          })
        } else {
          angular.forEach($scope.$parent.tabListMod, function (i) {
            i.checked = false;
            $scope.config.checked = [];
          })
        }
      };
      $scope.selectOne = function () {
        angular.forEach($scope.$parent.tabListMod, function (i) {
          var index = $scope.config.checked.indexOf(i);
          if (i.checked && index === -1) {
            $scope.config.checked.push(i);
          } else if (!i.checked && index !== -1) {
            $scope.config.checked.splice(index, 1);
          }
        });
        if($scope.$parent.tabListMod.length === $scope.config.checked.length) {
          $scope.config.checkAll = true;
        } else {
          $scope.config.checkAll = false;
        }
        console.log($scope.config.checked)
      };
      //批量删除
      $scope.favoriteModDelteAll = function(){
        if($scope.config.checked.length==0){
            hdTip.tip('提示信息','error','请先选择');
            return;
        }
        hdDialog.show(null,{
          dialogTitle:'删除商品',
          dialogMsg:'确认删除商品?',
          submitCallback:function(){
            var favoriteModdelTabs = {"uuids":[]};
            for(var i=0;i<$scope.config.checked.length;i++){
              favoriteModdelTabs.uuids.push($scope.config.checked[i].id)
            }
            favoriteModdelTabs = $.param(favoriteModdelTabs, true);
            webService.attachProvide('/{shop}/skuFavorite/delete/batch', 'post',favoriteModdelTabs,'').then(function (resp) {
              if (resp&&resp.data.success) {
                $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
                hdDialog.hide();
                $scope.config={
                  checkAll:false,
                  checked:[]
                };
              } else {
                hdTip.tip(resp.data.message[0], 'error');
              }
            })
          }
        })
      }
      //批量移动
      $scope.favoriteModMoveAll = function(){
        if($scope.config.checked.length==0){
          hdTip.tip('提示信息','error','请先选择');
          return;
        }
        hdDialog.show('moveFavoriteDialog');
        var favoriteModmoveTabs = [];
        for(var i=0;i<$scope.config.checked.length;i++){
          favoriteModmoveTabs.push({"categoryName":$scope.config.checked[i].categoryName,
            "created":$scope.config.checked[i].created,
            "id":$scope.config.checked[i].id,
            "lastModified":$scope.config.checked[i].lastModified,
            "shop":$scope.config.checked[i].shop,
            "shopSku":$scope.config.checked[i].shopSku,
            "shortName":$scope.config.checked[i].shortName,
            "skuIndex":$scope.config.checked[i].skuIndex,
            "version":$scope.config.checked[i].version})
        }
        moveSkuArr = favoriteModmoveTabs;
      };


      //拖动效果
      $timeout(function(){
        $('#gridly').dragsort({
          dragSelector: ".draggle-item",
          dragBetween: false,
          placeHolderTemplate: "<div class='placeHolder' style='float:left;'></div>",
          dragEnd:saveOrder
        })
      },500);
      function saveOrder(){
        var $this = $(this);
        console.log($this);
          var currentObjId = $this[0].id;
          for(var i=0;i<$scope.$parent.tabListMod.length;i++){
            if($scope.$parent.tabListMod[i].shopSku==currentObjId){
              var currentObjItem = $scope.$parent.tabListMod[i];
            }
          }
          $scope.$parent.dataManage.request.favoriteskusortparams = {
            "categoryName":$scope.$parent.isActiveTabMod.categoryName,
            "id":currentObjItem.id,
            "shop":currentObjItem.shop,
            "shopSku":currentObjItem.shopSku,
            "skuIndex":currentObjItem.skuIndex,
            "version":currentObjItem.version
          };
          var arr = $(".draggle-item").map(function () { return $(this).attr('id'); }).get();
          for(var i =0; i < arr.length; i++){
            if(arr[i] == currentObjId){
              var newIndex = i+1;
            }
          }
          webService.commonProvide('/{shop}/skuFavorite/sort', 'post',$scope.$parent.dataManage.request.favoriteskusortparams,{'newIndex':newIndex}).then(function (resp) {
            if (resp&&resp.data.success) {
              $scope.favoriteByCategoryFunc($scope.$parent.isActiveTabMod);
            } else {
              hdTip.tip(resp.data.message[0], 'error');
            }
          })
      }
    });
})();

