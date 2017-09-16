(function () {
  'use strict';
  angular.module('dposApp')
    .controller('checkBillUpload.Controller', function ($scope,$rootScope,webService,$stateParams,$state,hdTip,hdDialog) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
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
            "limit": 30
          },//查询条件
          "params": ""//其他参数
        },
        "response": {
          "shopDtl": {},//明细对象
          "shopList": []//列表对象
        },
        "page": {
          "maxSize": 5, //固定显示在页面跳转元素的个数
          "bigCurrentPage": 1, //目前所在页数
          "bigTotalItems": 0,
          "dataPerSize": 10, //每页显示多少条
          "pageList": [20, 30, 50] //配置每页显示多少条数据
        }
      };

      $scope.fileImported = {
        id: '',
        filePath: ''
      };
      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

      // function checkConfirmedNumber() {
      //   webService.commonProvide( '/{shop}/checkBill/import/preview', 'POST', $scope.dataManage.params,$scope.dataManage.request).then(function (resp) {
      //     if (resp.data.success) {
      //       hdDialog.show('successDialog');
      //       $rootScope.upLoadFileList = [];
      //     } else {
      //       hdDialog.show('errorDialog');
      //     }
      //   });
      // }

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
        localStorage.removeItem('setId');
        localStorage.removeItem('setFileName');
      }

      /**
       * 页面初始化
       */
      function initView() {
        // checkConfirmedNumber();
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
      $scope.closeDialog = function () {
        hdDialog.hide('confirmFileDialog');
        $rootScope.upLoadFileList = [];
      }
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
      /*上传文件
      *
      * */
      // $('#exclUpLoad').hide();
      // $('#exclUpLoadBtn').unbind('click');
      // $('#exclUpLoadBtn').bind('click', function () { $('#exclUpLoad').trigger('click'); });
      // $('#exclUpLoadBtn').attr("disabled", false);
      //
      // $scope.uploadFile = function () {
      //   var file = $("#exclUpLoad").val();
      //   var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
      //   var FileExt=file.replace(/.+\./,"");   //正则表达式获取后缀
      //   $scope.upLoadFileName = strFileName+'.'+FileExt;
      //
      //   webService.commonProvide(sessionStorage.shop.id + '/checkBill/upload', 'GET', '',{}).then(function (resp) {
      //     if (resp.data.success) {
      //       $scope.dataManage.response.dtl = resp.data.data;
      //     } else {
      //       hdTip.tip(resp.data.message,'error');
      //     }
      //   });
      // }
      // console.log($scope.upLoadFileName);

      $('#exclUpLoad').hide();
      $('#exclUpLoadBtn').unbind('click');
      $('#exclUpLoadBtn').bind('click', function () {
        $('#exclUpLoad').val('');
        $('#exclUpLoad').trigger('click');
      });
      $('#exclUpLoadBtn').attr("disabled", false);

      $scope.fileNameChanged = function (a) {
        var file;
        // if($rootScope.upLoadFileList != undefined && $rootScope.upLoadFileList.length > 0){
        //   $scope.clickable = true;
        // }else{
        //   $rootScope.upLoadFileList = [];
        // }
        $rootScope.upLoadFileList = [];


         /* var s = [];
          var hexDigits = "0123456789abcdef";
          for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = "4";
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
          s[8] = s[13] = s[18] = s[23] = "-";
          var uuid = s.join("");*/

          var fd = new FormData();
          var f = document.getElementById('exclUpLoad').files[0];//转换成base64转码
          if (f != undefined) {
            fd.append('file', f);
            $scope.scanFileName = f.name;
            if (f.size > 10485760) {
              hdTip.tip('文件上传必须小于10M',"error");
              //alert('文件上传必须小于10M');
              return;
            }
            /*@todo 路径以后修改 '/'+angular.fromJson(sessionStorage.shop).id +*/
            webService.attachProvide( '/{shop}/checkBill/upload', 'POST', fd,"", "").then(function (resp) {
              // console.log(resp);
              if (resp.data.success) {
                // by dsj 2016-12-31 15:01处理反馈的上传文件信息
                $scope.fileImportedId = resp.data.summary;//本次上传唯一id
                localStorage.setId = resp.data.summary;
                localStorage.setItem('setFileName', $scope.scanFileName);
                // $scope.fileImported.filePath = resp.data.data.filePath;
                $scope.repeatedFile = resp.data.data;

                //把不同的分两列
                $scope.singleFileList = [];
                $scope.triFileList = [];
                for(var i = 0; i < $scope.repeatedFile.length; i = i + 2){
                  $scope.singleFileList.push($scope.repeatedFile[i]);
                }
                if($scope.repeatedFile.length > 1){
                  for(var o = 1; o < $scope.repeatedFile.length; o = o + 2){
                    $scope.triFileList.push($scope.repeatedFile[o]);
                  }
                }

                $rootScope.upLoadFileList.push($scope.scanFileName+'-'+$scope.fileImportedId);

                if(resp.data.data.length && resp.data.data.length > 0){
                  hdDialog.show('confirmFileDialog');
                }else{
                  $state.go('checkBillImport');
                }
              } else {
                hdTip.tip(resp.data.message[0],'error');
              }
            });
          }
          angular.element('#exclUpLoad').clone().replaceAll(file =  angular.element('#exclUpLoade'));

        angular.element('#form').on('change', '#exclUpLoad',  function () {
          var f = document.getElementById('exclUpLoad').files[0];//转换成base64转码
          if (f != undefined) {
            $scope.$apply(function () {
              $scope.fileName = 'C:\\fakepath\\' + f.name;
            });
          }
          // angular.element("#fileName").attr('value', 'C:\\fakepath\\' + f.name);
        });

        $scope.confirmFile = function () {
          $state.go('checkBillImport');
        }
      }



      /**
       * 随机一个uuid
       * @returns {string}
       */



      /**************************************************分页事件start*********************************************/
      /**
       * 点击确定按钮
       * @param pageNo
       */
      $scope.btnSetPage = function (pageNo) {
        $scope.dataManage.page.bigCurrentPage = pageNo;
        $scope.dataManage.request.query.start = ($scope.dataManage.page.bigCurrentPage - 1) * $scope.dataManage
            .page.dataPerSize + 1;
        $scope.dataManage.request.query.limit = $scope.dataManage.page.dataPerSize;
        //请调取服务，获取分页数据

      };
      /**
       * 下一页
       */
      $scope.btnNext = function () {
        $scope.dataManage.request.query.start = ($scope.dataManage.page.bigCurrentPage - 1) * $scope.dataManage
            .page.dataPerSize + 1;
        $scope.dataManage.request.query.limit = $scope.dataManage.page.dataPerSize;
        //请调取服务，获取分页数据

      };
      /**
       * 每页的条数
       */
      $scope.selItem = function () {
        $scope.dataManage.request.query.start = 1;
        $scope.dataManage.request.query.limit = $scope.dataManage.page.dataPerSize;
        //请调取服务，获取分页数据

      };
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
