/**
 * Created by wangxue on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleList.Controller', function ($scope,$filter,$state,webService,hdTip) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "query": {//一般查询条件
            "filter":[
              {"property":"posNo=","value":""},//pos机号
              {"property":"sku=","value":""},//商品的sku
              {"property":"realAmount>=","value":""},//金额>=
              {"property":"realAmount<=","value":""},//金额<=
              {"property":"customer=", "value":""},//会员
              {"property":"paymentIn","value":[]},//支付方式
              {"property":"operator%=%","value":""},//操作人
              {"property":"orderNum%=%","value":""},//流水号
              {"property":"discountAmount>=","value":""},//优惠金额>=
              {"property":"discountAmount<=","value":""},//优惠金额<=
              {"property":"created bco","value":["",""]}//时间
            ],
            "start": 0,
            "limit": 30
          },//查询条件
          "params": {}//其他参数
        },
        "posRequest": {
          "start": 0,
          "limit": 25,
          "query":""
        },
        "shopRequest": {
          "start": 0,
          "limit": 10,
          "query": '',
          "filter": [
            {
              "property": "searchKey:%=%",
              "value": ""
            }
          ]
        },
        "customerRequest": {
          "start": 0,
          "limit": 10,
          "query": '',
          "filter":[
            {
              "property":"searchKey:%=%",
              "value":""
            },{
              "property":"state:=",
              "value":""
            }
          ]
        },
        "response": {
          "saleList": [],//列表对象
          "posList" : [], //pos对象
          "shopList" : [],
          "customerList" : []
        }
      };
      $scope.sumList = {};
      $scope.payWay = [];
      $scope.byDate = 'byDay';
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
        $scope.showDay = true;
        $scope.showWeek = false;
        $scope.showMonth = false;
        $scope.showDate = false;
        $scope.$watch('showByWeekStart', function (newVal, oldVal) {
          $scope.showByWeekEnd =  $filter('date')(new Date($scope.showByWeekStart).getTime()+6*24*60*60*1000, 'yyyy-MM-dd')
        });

        $scope.$watch('showByWeekEnd', function (newVal, oldVal) {
          $scope.showByWeekStart =  $filter('date')(new Date($scope.showByWeekEnd).getTime()-6*24*60*60*1000, 'yyyy-MM-dd')
        });
      }

      /**
       * 页面初始化
       */
      function initView() {
        getSaleList();
        getPosList();
        // getShopList();
        // getCustomerList();
      }
      /**
       * 控件初始化
       */
      function initWidget() {
        initHdInputSearch('hdInputSearch1', 2);
        initHdInputSearch('hdInputSearch2', 2);
        $scope.showByDay = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
        $scope.dataManage.request.query.filter[10].value = [$filter('date')(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'),
          $filter('date')(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
        ];
      }
      /**
       * 销售列表初始化
       */
      function getSaleList(currentNum,pageSize) {
        if(!currentNum){
          currentNum = 1;
        }
        if(!pageSize){
          pageSize = 10;
        }
        $scope.dataManage.request.query.start = (currentNum-1)*parseInt(pageSize);
        $scope.dataManage.request.query.limit = parseInt(pageSize);
        // $scope.showByWeekEnd = $scope.showByWeekStart
        if(typeof $scope.dataManage.request.query.filter != 'string'){
          var saleListStr = JSON.stringify($scope.dataManage.request.query.filter);//把引用类型转换为值类型
          var saleListArr = JSON.parse(saleListStr);
          var arr = [];

          for(var x=0;x<saleListArr.length;x++){
            if(!saleListArr[x].value || saleListArr[x].value.length == 0){
              // $scope.dataManage.request.query.filter=$scope.dataManage.request.query.filter.splice(x,1)
              delete(saleListArr[x]);
            }
          }
          for(var y=0;y<saleListArr.length;y++){
            if(saleListArr[y]){
              arr.push(saleListArr[y]);
            }
          }
          console.log(arr)
          // $scope.dataManage.request.query.filter = angular.toJson(arr);
          var obj = {//一般查询条件
            "filter":angular.toJson(arr),
            "start": $scope.dataManage.request.query.start,
            "limit": $scope.dataManage.request.query.limit
          }
        }else{
          // $scope.dataManage.request.query.filter = JSON.parse($scope.dataManage.request.query.filter);
          var str = $scope.dataManage.request.query.filter;
          var saleListArr = JSON.parse(str);
          var arr = [];

          for(var x=0;x<saleListArr.length;x++){
            if(!saleListArr[x].value || saleListArr[x].value.length == 0){
              // $scope.dataManage.request.query.filter=$scope.dataManage.request.query.filter.splice(x,1)
              delete(saleListArr[x]);
            }
          }
          for(var y=0;y<saleListArr.length;y++){
            if(saleListArr[y]){
              arr.push(saleListArr[y]);
            }
          }
          var obj = {//一般查询条件
            "filter":angular.toJson(arr),
            "start": $scope.dataManage.request.query.start,
            "limit": $scope.dataManage.request.query.limit
          }
        }
        webService.commonProvide('/{shop}/sale/v2/list', 'get', '', obj).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.saleList = resp.data.data;
            $scope.sumList = resp.data.summary;
            $scope.listcount = resp.data.total;
            if(typeof $scope.dataManage.request.query.filter == 'string'){
              $scope.dataManage.request.query.filter = JSON.parse($scope.dataManage.request.query.filter);
            }

          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      }
      /**
       * 收银机列表初始化
       */
      function getPosList() {
        webService.commonProvide('/{shop}/pos/list', 'get','',$scope.dataManage.posRequest).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.posList = resp.data.data;
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }
      /**
       * 商品列表初始化
       */
      function getShopList() {
        $scope.dataManage.shopRequest.filter = [{"property": "searchKey:%=%","value": $scope.dataManage.shopRequest.query}];
        $scope.dataManage.shopRequest.filter = angular.toJson($scope.dataManage.shopRequest.filter);
        webService.commonProvide('/{shop}/shopSkuService/queryInputSearch', 'GET', '', $scope.dataManage.shopRequest).then(function (resp) {
          if (resp && resp.data && resp.data.success) {
            for(var i = 0; i < resp.data.data.length ; i++){
              if(resp.data.data[i].name){
                while(resp.data.data[i].name.indexOf("<em>")!= -1||resp.data.data[i].name.indexOf("</em>")!= -1){
                  resp.data.data[i].name = resp.data.data[i].name.replace('<em>','');
                  resp.data.data[i].name = resp.data.data[i].name.replace('</em>','');
                }
              }
            }
            $scope.dataManage.response.shopList = resp.data.data;
            initHdMultiple('multSingle1');
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })

      }
      /**
       * 会员列表初始化
       */
      function getCustomerList() {
        $scope.dataManage.customerRequest.filter = [{"property":"searchKey:%=%", "value":$scope.dataManage.customerRequest.query},{"property":"state:=", "value":""}];
        $scope.dataManage.customerRequest.filter = angular.toJson($scope.dataManage.customerRequest.filter);
        webService.commonProvide('/{shop}/customer/query', 'GET', '', $scope.dataManage.customerRequest).then(function (resp) {
          if (resp && resp.data && resp.data.success) {
            for(var i = 0; i < resp.data.data.length ; i++){
              if(resp.data.data[i].name){
                while(resp.data.data[i].name.indexOf("<em>")!= -1||resp.data.data[i].name.indexOf("</em>")!= -1){
                  resp.data.data[i].name = resp.data.data[i].name.replace('<em>','');
                  resp.data.data[i].name = resp.data.data[i].name.replace('</em>','');
                }
              }
            }
            $scope.dataManage.response.customerList = resp.data.data;
            initHdMultiple('multSingle1');
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        })
      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /**
       * 支付方式格式化
       */
      $scope.payWayList = [{"name":"现金","ename":"CASH"},{"name":"微信","ename":"WEIXIN"},{"name":"支付宝","ename":"ALIPAY"},{"name":"储值支付","ename":"BALANCE"},{"name":"翼支付","ename":"BESTPAY"},{"name":"赊账","ename":"CREDIT"},{"name":"其他","ename":"OTHER"}];
      /**
       * 支付方式树初始化
       */
      initHdMultiple('orderWayTree');
      /**
       * 复选框回调方法
       */
      $scope.hdMultipleCallBack = function (hdId) {
        if (hdId == 'orderWayTree'){
          if(hdMultipleObj.orderWayTree.list.length!=0){
            $scope.payWay=[];
            for(var i=0;i<hdMultipleObj.orderWayTree.list.length;i++){
              $scope.payWay.push(hdMultipleObj.orderWayTree.list[i].ename);
              $scope.dataManage.request.query.filter[5].value = $scope.payWay;
            }
          }else{
            $scope.payWay=[];
          }
        }
      };
      /**
       * 输入字符串后, 可以开始调用后台服务
       */
      $scope.hdInputSearchStart = function(jqueryObj, hdId) {
        if (hdId == 'hdInputSearch1') {
          getShopList();
        }
        if(hdId == 'hdInputSearch2'){
          getCustomerList();
        }
      };
      /**
       * 选中一个, 可以得到输入框中的对象信息
       */
      $scope.hdInputSearchCheckOne = function(jqueryObj, hdId) {
        if (hdId == 'hdInputSearch1') {
          var jsonObj = JSON.parse(jqueryObj.attr('itemObj'));
          jqueryObj.val(jsonObj.name);
          $scope.dataManage.shopRequest.query = jsonObj.name;
          $scope.dataManage.request.query.filter[1].value = jsonObj.id;
        }
        if (hdId == 'hdInputSearch2') {
          var jsonObj = JSON.parse(jqueryObj.attr('itemObj'));
          jqueryObj.val(jsonObj.name);
          $scope.dataManage.customerRequest.query = jsonObj.name;
          $scope.dataManage.request.query.filter[4].value = jsonObj.id;
        }
      };
      /**
       * 选择列表数据展示的时间段
       */
      $scope.changeQueryDate = function (date) {
        $scope.byDate = date;
        if (date == "byDay") {
          $scope.showDay = true;
          $scope.showWeek = false;
          $scope.showMonth = false;
          $scope.showDate = false;
          $scope.showByDay = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          $scope.dataManage.request.query.filter[10].value = [
            $filter('date')(new Date($scope.showByDay).getTime(), 'yyyy-MM-dd hh:mm:ss'),
            $filter('date')(new Date($scope.showByDay).getTime(), 'yyyy-MM-dd hh:mm:ss')
          ]
        } else if (date == "byWeek") {
          $scope.showDay = false;
          $scope.showWeek = true;
          $scope.showMonth = false;
          $scope.showDate = false;
          $scope.showByWeekStart = hdUtils.date.getOtherDate(6);
          $scope.showByWeekEnd = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          var curDate = new Date();
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByWeekStart + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByWeekEnd + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        } else if (date == "byMonth") {
          $scope.showDay = false;
          $scope.showWeek = false;
          $scope.showMonth = true;
          $scope.showDate = false;
          $scope.showByMonth = $filter('date')(new Date().getTime(), 'yyyy-MM');
          var curDate = new Date();
          /* 获取当前月份 */
          var curMonth = curDate.getMonth();
          /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
          curDate.setMonth(curMonth + 1);
          /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
          curDate.setDate(0);
          /* 返回当月的天数 */
          // alert(curDate.getDate()) ;
          $scope.dataManage.request.query.filter[10].value =
            [
            curDate.getFullYear() + '-' + ((curDate.getMonth()+1)>9 ?(curDate.getMonth()+1) : '0'+(curDate.getMonth()+1))  + '-01' + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
            curDate.getFullYear() + '-' + ((curDate.getMonth()+1)>9 ?(curDate.getMonth()+1) : '0'+(curDate.getMonth()+1)) +'-' + (curDate.getDate()>9 ? curDate.getDate() :'0'+curDate.getDate()) +' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
          ]
        } else if (date == "byDate") {
          $scope.showDay = false;
          $scope.showWeek = false;
          $scope.showMonth = false;
          $scope.showDate = true;
          $scope.showByDateFrom = hdUtils.date.getOtherDate(6);
          $scope.showByDateTo = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          var curDate = new Date();
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByDateFrom + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByDateTo + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        }
      };
      /**
       * 按日期展示列表数据时选择列表数据展示的时间段
       */
      $scope.changeDate = function (date) {
        if (date == "DAY") {
          $scope.showByDateFrom = hdUtils.date.getOtherDate(6);
          $scope.showByDateTo = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          var curDate = new Date();
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByDateFrom + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByDateTo + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        } else if (date == "MONTH") {
          $scope.showByDateFrom = hdUtils.date.getOtherDate(89);
          $scope.showByDateTo = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          var curDate = new Date();
          $scope.dataManage.request.query.filter[10].value=
            [
              $scope.showByDateFrom + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByDateTo + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        } else if (date == "YEAR") {
          $scope.showByDateFrom = hdUtils.date.getOtherDate(182);
          $scope.showByDateTo = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
          var curDate = new Date();
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByDateFrom + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByDateTo + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        }
      };
      /**
       * 选择前一天
       */
      $scope.preDay= function () {
        var time = new Date($scope.showByDay).getTime();
        var preDayTime = time - 24*60*60*1000;
        var preDayDate = $filter('date')(new Date(preDayTime), 'yyyy-MM-dd')
        $scope.showByDay = preDayDate;
        $scope.dataManage.request.query.filter[10].value =  [$filter('date')(new Date(preDayTime), 'yyyy-MM-dd hh:mm:ss'),$filter('date')(new Date(preDayTime), 'yyyy-MM-dd hh:mm:ss')];
        getSaleList();
      };
      /**
       * 选择后一天
       */
      $scope.nextDay = function () {
        var time = new Date($scope.showByDay).getTime();
        var nextDayTime = time + 24*60*60*1000;
        var nextDayDate = $filter('date')(new Date(nextDayTime), 'yyyy-MM-dd')
        $scope.showByDay = nextDayDate;
        $scope.dataManage.request.query.filter[10].value =  [$filter('date')(new Date(nextDayTime), 'yyyy-MM-dd hh:mm:ss'),$filter('date')(new Date(nextDayTime), 'yyyy-MM-dd hh:mm:ss')];
        getSaleList();
      };
      /**
       * 选择前一周
       */
      $scope.preWeek = function () {
        var timeFrom = new Date($scope.showByWeekStart).getTime();
        var timeTo = new Date($scope.showByWeekEnd).getTime();
        var preWeekTimeFrom = timeFrom - 7*24*60*60*1000;
        var preWeekTimeTo = timeTo - 7*24*60*60*1000;
        var preDayDateFrom = $filter('date')(new Date(preWeekTimeFrom), 'yyyy-MM-dd');
        var preDayDateTo = $filter('date')(new Date(preWeekTimeTo), 'yyyy-MM-dd');
        $scope.showByWeekStart = preDayDateFrom;
        $scope.showByWeekEnd = preDayDateTo;
        $scope.dataManage.request.query.filter[10].value = [$filter('date')(new Date(preWeekTimeFrom), 'yyyy-MM-dd hh:mm:ss'),$filter('date')(new Date(preWeekTimeTo), 'yyyy-MM-dd hh:mm:ss')];
        getSaleList();
      };
      /**
       * 选择后一天
       */
      $scope.nextWeek = function () {
        var timeFrom = new Date($scope.showByWeekStart).getTime();
        var timeTo = new Date($scope.showByWeekEnd).getTime();
        var preWeekTimeFrom = timeFrom + 7*24*60*60*1000;
        var preWeekTimeTo = timeTo + 7*24*60*60*1000;
        var preDayDateFrom = $filter('date')(new Date(preWeekTimeFrom), 'yyyy-MM-dd');
        var preDayDateTo = $filter('date')(new Date(preWeekTimeTo), 'yyyy-MM-dd');
        $scope.showByWeekStart = preDayDateFrom;
        $scope.showByWeekEnd = preDayDateTo;
        $scope.dataManage.request.query.filter[10].value = [$filter('date')(new Date(preWeekTimeFrom), 'yyyy-MM-dd hh:mm:ss'),$filter('date')(new Date(preWeekTimeTo), 'yyyy-MM-dd hh:mm:ss')];
        getSaleList();
      };
      /**
       * 选择前一个月
       */
      $scope.preMonth = function () {
        var curDate = new Date();
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();
        var timeFrom = new Date($scope.showByMonth+'-'+'01').getTime();
        var preWeekTimeFrom = timeFrom - curDate.getDate()*24*60*60*1000;
        var preDayDateFrom = $filter('date')(new Date(preWeekTimeFrom), 'yyyy-MM');
        $scope.showByMonth = preDayDateFrom;
        if($scope.showByMonth[5] == 0){
          curMonth = $scope.showByMonth.substr(6,7)-1;
        }else{
          curMonth = $scope.showByMonth.substr(5,7)-1;
        }
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        $scope.dataManage.request.query.filter[10].value =
          [
            $scope.showByMonth+'-'+'01'+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())),
            $scope.showByMonth+'-'+curDate.getDate()+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
          ];
        getSaleList();
      };
      /**
       * 选择后一个月
       */
      $scope.nextMonth = function () {
        var curDate = new Date();
        var curMonth;
        if($scope.showByMonth[5] == 0){
          $scope.showByMonth = $scope.showByMonth.substr(0,4)+'-'+((parseInt($scope.showByMonth.substr(6,7))+1) < 10 ? ('0'+(parseInt($scope.showByMonth.substr(6,7))+1)) : (parseInt($scope.showByMonth.substr(6,7))+1))
          curMonth = parseInt($scope.showByMonth.substr(6,7));
        }else{
          if($scope.showByMonth[6]<3){
            if($scope.showByMonth[6]==2){
              $scope.showByMonth = parseInt($scope.showByMonth.substr(0,4))+1+'-'+'01';
              curMonth = 12;
            }else{
              $scope.showByMonth = $scope.showByMonth.substr(0,4)+'-'+(parseInt($scope.showByMonth.substr(5,7))+1);
              curMonth = parseInt($scope.showByMonth.substr(5,7));
            }
          }
        }

        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        $scope.dataManage.request.query.filter[10].value =
          [
            $scope.showByMonth+'-'+'01'+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())),
            $scope.showByMonth+'-'+curDate.getDate()+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
          ];
        getSaleList();
      };

      /**
       * 查询按钮事件
       */
      $scope.search = function () {
        var curDate = new Date();
        if ($scope.byDate == "byDay") {
          $scope.dataManage.request.query.filter[10].value = [
            $filter('date')(new Date($scope.showByDay).getTime(), 'yyyy-MM-dd hh:mm:ss'),
            $filter('date')(new Date($scope.showByDay).getTime(), 'yyyy-MM-dd hh:mm:ss')
          ]
        } else if ($scope.byDate == "byWeek") {
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByWeekStart + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByWeekEnd + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        } else if ($scope.byDate == "byMonth") {
          var curMonth;
          console.log($scope.showByMonth);
          if($scope.showByMonth[5] == 0){
           curMonth = $scope.showByMonth.substr(6,7)-1;
          }else{
            curMonth = $scope.showByMonth.substr(5,7)-1;
          }
          /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
          curDate.setMonth(curMonth + 1);
          /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
          curDate.setDate(0);
          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByMonth+'-'+'01'+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())),
              $scope.showByMonth+'-'+curDate.getDate()+' '+((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        } else if ($scope.byDate == "byDate") {

          $scope.dataManage.request.query.filter[10].value =
            [
              $scope.showByDateFrom + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds())) ,
              $scope.showByDateTo + ' ' + ((curDate.getHours()>9 ? curDate.getHours() : '0'+curDate.getHours())  + ':' + (curDate.getMinutes()>9 ? curDate.getMinutes() : '0'+curDate.getMinutes() ) + ':' +(curDate.getSeconds()>9 ? curDate.getSeconds() : '0'+curDate.getSeconds()))
            ]
        }

        $scope.isPageToOne = !$scope.isPageToOne;
        if(hdMultipleObj.orderWayTree.list.length!=0){
          $scope.payWay=[];
          for(var i=0;i<hdMultipleObj.orderWayTree.list.length;i++){
            $scope.payWay.push(hdMultipleObj.orderWayTree.list[i].ename);
          }
        }
        if(typeof $scope.dataManage.request.query.filter != 'string'){
          $scope.dataManage.request.query.filter = angular.toJson($scope.dataManage.request.query.filter);
        }else{
          $scope.dataManage.request.query.filter = JSON.parse($scope.dataManage.request.query.filter);
        }
        getSaleList();

      };
      /**
       * 重置搜索条件
       */
      $scope.reset = function () {
        // initDataManage();
        if(typeof $scope.dataManage.request.query.filter == 'string'){
          $scope.dataManage.request.query.filter = JSON.parse($scope.dataManage.request.query.filter);
        }
        for (var i = 0; i < 11; i++) {
          if(i != 10){
            $scope.dataManage.request.query.filter[i].value = '';
          }
        }
        $scope.payWay=[];
        $scope.dataManage.shopRequest.query = '';
        $scope.dataManage.customerRequest.query = '';
        initHdMultiple('orderWayTree');
        initHdMultiple('multSingle1');
        initHdInputSearch('hdInputSearch1', 2);
        initHdInputSearch('hdInputSearch2', 2);
      };
      /**
       * 销售收银点击事件
       */
      $scope.gotoSaleAdd = function () {
        $state.go('saleAdd');
      };
      /**
       * 单号点击跳转事件
       */
      $scope.saleDtl = function (index) {
        $state.go('saleDtl',
          {
            'id':$scope.dataManage.response.saleList[index].id,
            'posNo':$scope.dataManage.response.saleList[index].posNo
          }
        );
      };

      /**
       * 分页回调函数
       * @param number
       */
      $scope.eachPageEvent = function (number,pageSize,id) {
        getSaleList(number,pageSize);
      };


      /***********************************************************************************************************
       **************************************5、广播**************************************************************/
     
    });

})();

