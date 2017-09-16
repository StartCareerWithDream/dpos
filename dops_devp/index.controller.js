/**
 * Created by songjian on 2017/4/14.
 */

function extAngularUiViewRender (){

  /* 路由中，js css 等文件可能放在外部地址*/
  var dir = 'angular';  // 正式环境
  if (window.location.href.toLocaleLowerCase().indexOf('://localhost') != -1) {//本地测试
    dir = '.';
  }

  document.getElementById("dpos-angular").innerHTML='<div ui-view=""></div>'
  var linkHtml='<link href="'+dir+'/css/hd.ui.min.css" rel="stylesheet">'+
     '<link href="'+dir+'/libs/iconfont/iconfont.css" rel="stylesheet">'+
    '<link href="'+dir+'/css/custome.css" rel="stylesheet">'+
      '<link href="'+dir+'/libs/treeView/metroStyle/metroStyle.css" rel="stylesheet">';
  $("head").append(linkHtml);

  var urls = [
    "//download.qianfan123.com/resources/libs/angular.min.js",
    "//download.qianfan123.com/resources/libs/angular-route.min.js",
    dir+"/libs/angular-ui-router.js",
    dir+"/libs/angular-sanitize.min.js",
    dir+"/libs/ocLazyLoad.js",
    dir+"/app.controller.js",
    dir+"/libs/hd.ui.min.js",
    dir+"/libs/treeView/jquery.ztree.all.js",
    dir+"/libs/treeView/jquery.ztree.core.min.js",
    dir+"/libs/treeView/jquery.ztree.excheck.js",
    dir+"/js/utils.js",
    dir+"/js/directives/hd-tab/tab.directive.js",
    dir+"/js/directives/hd-authPermission/hd-authPermission.service.js",
    dir+"/js/provider/service.js"
  ];

  var getScript = function(callback){
    var url =urls.shift();
    if(url){
      $.getScript(url,function(){
        getScript(callback);
      });
    }else{
      callback()
    }
  };

  $(function(){
    $.ajaxSetup({
      cache: true
    });
    getScript(function(){
      $.ajaxSetup({
        cache: false
      });
      angular.bootstrap(document, ['dposApp']);
    });
  });
}

if (window.location.href.toLocaleLowerCase().indexOf('://localhost:') != -1) {//本地测试
  $(function(){
    extAngularUiViewRender();
  });
}