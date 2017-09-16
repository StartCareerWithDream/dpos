/**
 * Created by ckj on 2017/7/3.
 */
(function () {
    angular.module('hd.page',[])
      .directive('hdPage', function () {
          return {
              restrict: 'AE',
              templateUrl: 'js/directives/hd-newPagenation/hd-newPagenation.directive.html',
              replace: true,
              scope:{
                  "listcount":"@",
                  "ispagetoone":"@"
              },
              link: function (scope, element,attr) {
                  /**
                   * 每页的点击事件
                   * @param currentNum
                   */
                  function eachPageEvent(currentNum,pageSize,id) {
                      scope.$parent.eachPageEvent(currentNum,pageSize,id);
                  }
                  if(attr.id){
                      element.find('ul').attr('id','').attr('id',attr.id);
                  }
                  //分页初始化
                  if(attr.id){
                      element.find('#'+attr.id).initPage(0,1,eachPageEvent,false);
                  }else{
                      element.find('#page').initPage(0,1,eachPageEvent,false);//兼容上个版本
                  }
                  /**
                   * 监听点击搜索(为了修复先点击到非第一页，然后直接点击搜索，由于总条数没变化，所以下面的change事件无法触发)
                   */
                  scope.$watch('ispagetoone',function (newValue,oldValue) {
                      if(newValue != oldValue){
                          if(attr.id){
                              element.find('#'+attr.id).setNewTotal(scope.listcount);
                          }else{
                              element.find('#page').setNewTotal(scope.listcount);
                          }
                      }
                  });
                  /**
                   * 监听总条数变化
                   */
                  scope.$watch('listcount',function (newValue,oldValue) {
                      console.log(newValue+"-----"+oldValue);
                      if(newValue != oldValue){
                          if(attr.id){
                              element.find('#'+attr.id).setNewTotal(newValue);
                          }else{
                              element.find('#page').setNewTotal(newValue);
                          }
                      }
                  });
              }
          };
      })
})();