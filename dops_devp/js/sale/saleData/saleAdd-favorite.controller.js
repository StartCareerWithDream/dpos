/**
 * Created by zhaorong on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleAddFavorite.Controller', function ($timeout,$scope,$filter,hdDialog,webService,hdTip) {
      //点击编辑收藏夹
      $scope.favoriteModShow = function(){
        hdDialog.show('favoriteModDialog');
      };
      //点击切换收藏夹分类
      $scope.onClickTab = function (tab) {
        $scope.$parent.isActiveTab = tab;
        $scope.favoriteByCategoryFunc(tab);
      };
      //收藏夹类名切换
      $scope.favoriteByCategoryFunc = function(tab){
        $scope.$parent.dataManage.request.favoriteparams ={
          "category":tab
        }
        webService.commonProvide('/{shop}/skuFavorite/get/byCategory', 'get', '',$scope.$parent.dataManage.request.favoriteparams).then(function (resp) {
          if (resp&&resp.data.success) {
            $scope.$parent.dataManage.response.favoriteList = resp.data.data;
            $scope.$parent.tabList = $scope.$parent.dataManage.response.favoriteList;
            $scope.$parent.tabListCopy = angular.copy($scope.$parent.tabList);
            $scope.$parent.dataManage.response.favProdLimit = resp.data.fields.favProdLimit;//总限制数
            $scope.$parent.dataManage.response.totalCount = resp.data.fields.totalCount;//目前拥有的数
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      };
      //$scope.LOrRBtnShow = $('#run').get(0).getBoundingClientRect().width - $('#overrun').get(0).getBoundingClientRect().width;
      //console.log($scope.LOrRBtnShow)
      //收藏夹排序
      $scope.title='';
      $scope.desc = 0;
      //添加商品
      $scope.pushSku = function(index){//往录入数据中加商品
        console.log($scope.$parent.tabList[index]);
      };
      //分类左右点击事件
      $scope.leftBtn = function(){
        if(parseFloat($('#run').css('left'))<0){
          if(Math.abs(parseFloat($('#run').css('left')))<=30){
            $('#run').css({'left':0});
          }else{
            startrun(30);
          }
        }else{
            $('#run').css({'left':0});
            return;
        }

      };
      $scope.rightBtn = function(){
        var runWidth = $('#run').get(0).getBoundingClientRect().width - $('#overrun').get(0).getBoundingClientRect().width;
        if(runWidth<0){
          return;
        }
        if(parseFloat($('#run').css('left'))>-runWidth){
          if((Math.abs(parseFloat($('#run').css('left'))+30)>=Math.abs(runWidth))){
            $('#run').css({'left':-runWidth});
          }else{
            startrun(-30);
          }
        }else{
          $('#run').css({'left':-runWidth});
          return;
        }
      }
      function startrun(distance) {
        $('#run').css({'left':parseFloat($('#run').css('left'))+distance + "px"});
      }
    });
})();

