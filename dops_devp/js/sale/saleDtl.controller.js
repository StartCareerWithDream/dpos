/**
 * Created by zhaorong on 2017/9/4.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    .controller('saleDtl.Controller', ["$scope","$state","$stateParams","hdDialog","webService","hdTip",function ($scope,$state,$stateParams,hdDialog,webService,hdTip) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "goodsDtlRequest": {
          "id":"",
          "fetchContext":false,
          "posNo":""
        },
        "goodsRequest": {
          "uuid":"",
          "fetch_parts":"tags"
        },
        "tagRequest": {
          "start":"0",
          "limit":"25"
        },
        "saveRequest": {
          "id": "",
          "version": "",
          "created": "",
          "creator": {
            "id": "",
            "code": null,
            "name": "",
            "newUcn": false
          },
          "lastModified": "",
          "lastModifier": {
            "id": "",
            "code": null,
            "name": "",
            "newUcn": false
          },
          "barcode": "",
          "name": "",
          "qpcText": "",
          "munit": "",
          "multipack": false,
          "shop": "",
          "code": "",
          "smartCodes": "",
          "state": "",
          "salePrice": "",
          "lastInPrice": "",
          "memberPrice": "",
          "platformSku": "",
          "tags": [
            "2"
          ],
          "images": [],
          "remark": "",
          "inFavorite": false,
          "minPackSku": false,
          "inventory": null,
          "invQty": null,
          "minQty": null,
          "costPrice": "",
          "logs": [],
          "autoRpl": false,
          "rplSuggestDay": "",
          "rplSuggestNum": "",
          "weighed": false,
          "weighingCode": "",
          "qpcSku": "",
          "spec": "",
          "qpc": "",
          "currentSku": false,
          "basicQpcSku": false,
          "shortName": ""
        },
        "response": {
          "goodsList": [],//列表对象
          "goodsMessageList":[],
          "tagList":[]
        }
      };

      $scope.turnScreet = false;
      $scope.turnNormal = true;
      $scope.showOrder = true;
      $scope.showCreator = false;
      $scope.dataManage.goodsDtlRequest.id = $stateParams.id;
      $scope.dataManage.goodsDtlRequest.posNo = $stateParams.posNo;
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
        getGoodsDtlList();
        getTagList();
      }

      /**
       * 控件初始化
       */
      function initWidget() {

      }

      /**
       * 销售详情列表初始化
       */
      function getGoodsDtlList() {
        webService.commonProvide('/{shop}/sale/v2/get', 'post','',$scope.dataManage.goodsDtlRequest).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.goodsList = resp.data.data;
            $scope.receivable = $scope.dataManage.response.goodsList.amount - $scope.dataManage.response.goodsList.discountAmount;
            $scope.receipt = $scope.dataManage.response.goodsList.amount - $scope.dataManage.response.goodsList.discountAmount + $scope.dataManage.response.goodsList.changeAmount;
            $scope.qtySum = 0;
            $scope.amountSum = 0;
            if($scope.dataManage.response.goodsList.lines){
              for(var i=0;i<$scope.dataManage.response.goodsList.lines.length;i++){
                $scope.qtySum = $scope.qtySum+parseInt($scope.dataManage.response.goodsList.lines[i].qty);
              }
              for(var j=0;j<$scope.dataManage.response.goodsList.lines.length;j++){
                $scope.amountSum = $scope.amountSum+parseInt($scope.dataManage.response.goodsList.lines[j].amount);
              }
            }

          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }
      /**
       * 商品编辑弹框初始化
       */
      function getGoodsList() {
        webService.commonProvide('/{shop}/shopSkuService/getSkuSimple', 'get','',$scope.dataManage.goodsRequest).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.goodsMessageList = resp.data.data;
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }
      /**
       * 标签列表初始化
       */
      function getTagList() {
        webService.commonProvide('/{shop}/shopSkuService/getShopSkuTags', 'get','',$scope.dataManage.tagRequest).then(function (resp) {
          if (resp.data.success) {
            $scope.dataManage.response.tagList = resp.data.data;
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      }

      function mergeSaleLine(order) {
        var me = this;
        if (Ext.isEmpty(order) || Ext.isEmpty(order.lines)) {
          return order;
        }
        var map = {};
        for (var i = 0; i < order.lines.length; i++) {
          var line = order.lines[i];
          var key = line.sku.id

            + Ext.util.Format.number(order.lines[i].price, '0.00');
          var value = map[key];
          if (Ext.isEmpty(value)) {
            map[key] = line;
          } else {
            value.qty = Ext.Number.from(value.qty) + Ext.Number.from(line.qty);
            value.amount = Ext.Number.from(value.amount) + Ext.Number.from(line.amount);
          }
        }
        var lines = [];
        Ext.Object.eachValue(map, function(value) {
          lines.push(value);
        });
        order.lines = lines;
        return order;
      }

      function buildPrintLogo() {
        var me = this;
        var logo = webService.getBaseUrl() + 'resources/images/ticket-logo.png';
        var logoImage = '<img style="width:30mm;border:0;margin-top:1.5mm;" src=' + logo + '>';
        // var channel = ChannelConfig.getConfig();
        var channel = window.top.lionApi.getLionSession('curCustomer');
        if (channel && channel.ticketLogo) {
          var channelLogo = '<div style="float:left;border-left:1px;border-left-style:solid;height:5mm;margin-top:1.5mm;margin-left:2mm;margin-right:3mm;"></div><div style="float:left;"><img style="width:18mm;border:0" src='
            + channel.ticketLogo + '></div>'
          logoImage = '<div><img style="width:22mm;float:left;" src=' + logo + '></div>';
          return '<div>' + logoImage + channelLogo + '</div>';
        } else {
          return logoImage;
        }
      }

      function doPrintSale(order) {
        var PrintMgr = window.top.lionApi.printMgr;
        var me = this;
        var shop = JSON.parse(sessionStorage.getItem("shop"));
        var tpl = 'lodop.PRINT_INIT(\"' + "销售单_" + order.number + "_" + Date.now() + '\");';
        var height = 15;
        var hpos = 10;
        tpl += PrintMgr.addTextElement(hpos, 0, '100%', height, '欢迎光临' + shop.name,
          'center');
        if (window.top.lionApi.getLionSession() && window.top.lionApi.getLionSession(pos).saleTicketEncryptNumber) {
          tpl += hdPrint.addTextElement(hpos += height, 0, '100%', height, '销售单号:' + order.encryptNumber);
        } else {
          tpl += PrintMgr.addTextElement(hpos += height, 0, '100%', height, '销售单号:' + order.number);
        }
        tpl += PrintMgr.addTextElement(hpos += height, 0, '100%', height, '机号:' + order.posNo);
        tpl += PrintMgr.addTextElement(hpos += height, 0, '100%', height, '收银员:' + order.creator.name);
        tpl += hdUtils.String.format('lodop.ADD_PRINT_LINE({0},{1},{2},{3},{4});', hpos += (height + 7), 0, hpos, '"100%"', 3);
        tpl += PrintMgr.addTextElement(hpos += 8, 0, '20%', height, '品名');
        tpl += PrintMgr.addTextElement(hpos, '20%', '25%', height, '单价', 'right');
        tpl += PrintMgr.addTextElement(hpos, '45%', '25%', height, '数量', 'right');
        tpl += PrintMgr.addTextElement(hpos, '70%', '30%', height, '金额', 'right');
        order = me.mergeSaleLine(order);
        for (var i = 0; i < order.lines.length; i++) {
          var line = order.lines[i];
          tpl += PrintMgr.addTextElement(hpos += height, 0, '100%', height, line.sku.name

          );
          tpl += PrintMgr.addTextElement(hpos += height, 0, '45%', height, Ext.util.Format.number(order.lines[i].price, '0.00'), 'right');
          tpl += PrintMgr.addTextElement(hpos, '45%', '25%', height, Ext.util.Format.number(order.lines[i].qty, '0.###'), 'right');
          tpl += PrintMgr.addTextElement(hpos, '70%', '30%', height, Ext.util.Format.number(order.lines[i].amount, '0.00'), 'right');
        }
        tpl += hdUtils.String.format('lodop.ADD_PRINT_LINE({0},{1},{2},{3},{4});', hpos += (height + 7), 0, hpos, '"100%"', 3);
        tpl += PrintMgr.addTextElement(hpos += 8, 0, '45%', height, '合计:');
        tpl += PrintMgr.addTextElement(hpos, '45%', '25%', height, Ext.util.Format.number(order.qty, '0.###'), 'right');
        tpl += PrintMgr.addTextElement(hpos, '70%', '30%', height, Ext.util.Format.number(order.amount, '0.00'), 'right');
        tpl += PrintMgr.addTextElement(hpos += height, 0, '50%', height, '应付:');
        tpl += PrintMgr.addTextElement(hpos, '50%', '50%', height, Ext.util.Format.number(DposPrecision.floatSub(order.amount, order.discountAmount), '0.00'), 'right');
        tpl += PrintMgr.addTextElement(hpos += height, 0, '50%', height, '优惠:');
        tpl += PrintMgr.addTextElement(hpos, '50%', '50%', height, Ext.util.Format.number(order.discountAmount, '0.00'), 'right');
        tpl += hdUtils.String.format('lodop.ADD_PRINT_LINE({0},{1},{2},{3},{4});', hpos += (height + 7), 0, hpos, '"100%"', 3);
        var nextPrint = true;
        Ext.Array.forEach(order.payments, function(payment) {
          if (payment.paidAmount && payment.paidAmount != 0) {
            tpl += PrintMgr.addTextElement(nextPrint ? hpos += 8 : hpos += height, 0, '50%', height, payment.paymentMethod + ':');
            tpl += PrintMgr.addTextElement(hpos, '50%', '50%', height, Ext.util.Format.number(payment.paidAmount, '0.00'), 'right');
            nextPrint = false;
          }
        });
        tpl += PrintMgr.addTextElement(nextPrint ? hpos += 8 : hpos += height, 0, '50%', height, '找零:');
        tpl += PrintMgr.addTextElement(hpos, '50%', '50%', height, Ext.util.Format.number(order.changeAmount, '0.00'), 'right');
        tpl += PrintMgr.addTextElement(hpos += height, 0, '40%', height, '交易时间:');
        tpl += PrintMgr.addHtmlElement(hpos, '40%', '60%', height, order.created, 'right');
        tpl += PrintMgr.addTextElement(hpos += height, 0, '100%', height, '谢谢惠顾, 欢迎下次光临!', 'center');
        tpl += PrintMgr.addHtmlElement(hpos += height, 0, '100%', 50, me.buildPrintLogo(), 'center', false);

        tpl += 'lodop.SET_PRINT_STYLEA(0, "Stretch", 2);';
        tpl += 'lodop.SET_PRINT_PAGESIZE(3, "100%", "10mm", order.shopName +"订单信息");';

        PrintMgr.print(tpl, order, -1);
      }


      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /**
       *按钮事件
       * @constructor
       */
      /**
       * 点击商品名称事件
       */
      $scope.goodsEdit = function (index) {
        $scope.dataManage.goodsRequest.uuid = $scope.dataManage.response.goodsList.lines[index].sku.id;
        getGoodsList();
        hdDialog.show("goodsEditMessage");
      };
      /**
       * 点击结算信息事件
       */
      $scope.checkMessage = function () {
        $scope.showOrder = true;
        $scope.showCreator = false;
      };
      /**
       * 点击创建与修改事件
       */
      $scope.checkModify = function () {
        $scope.showOrder = false;
        $scope.showCreator = true;
      };
      /**
       * 新增按钮事件
       */
      $scope.goSaleAdd =function () {
        $state.go('saleAdd');
      };
      /**
       * 编辑按钮事件
       */
      $scope.goSaleDtlEdit =function () {
        $state.go('saleAdd',
          {
            'id':$scope.dataManage.response.goodsList.id,
            'posNo':$scope.dataManage.response.goodsList.posNo
          }
        );
      };
      /**
       * 退货按钮事件，退货页面还没做，所以暂时跳转新增页
       */
      $scope.goSaleReturn =function () {
        $state.go('saleAdd');
      };
      /**
       * 加密点击事件
       */
      $scope.lock = function () {
        $scope.turnScreet = false;
        $scope.turnNormal = true;
      };
      /**
       * 正常点击事件
       */
      $scope.open = function () {
        $scope.turnScreet = true;
        $scope.turnNormal = false;
      };
      /**
       * 保存按钮事件
       */
      $scope.dialogSubmit = function () {
        // $scope.dataManage.saveRequest.id = $scope.dataManage.response.goodsList.lines[index].sku.id;
        $scope.dataManage.saveRequest.shortName = $scope.dataManage.response.goodsMessageList.shortName;
        $scope.dataManage.saveRequest.lastInPrice = $scope.dataManage.response.goodsMessageList.lastInPrice;
        $scope.dataManage.saveRequest.salePrice = $scope.dataManage.response.goodsMessageList.salePrice;
        $scope.dataManage.saveRequest.costPrice = $scope.dataManage.response.goodsMessageList.costPrice;
        $scope.dataManage.saveRequest.code = $scope.dataManage.response.goodsMessageList.code;
        // $scope.dataManage.saveRequest.tags = $scope.dataManage.response.goodsMessageList.tags;
        $scope.dataManage.saveRequest.remark = $scope.dataManage.response.goodsMessageList.remark;
        webService.commonProvide("/{shop}/shopSkuService/update",'POST','',$scope.dataManage.saveRequest
        ).then(function(resp) {
          if(resp.data.success){
            getGoodsDtlList();
          }else{
            hdTip.tip("请求失败","error","失败原因:"+resp.data.message);
          }
        });
      };
      /**
       * 打印小票按钮事件
       */
      $scope.print = function () {
        webService.commonProvide('/{shop}/sale/v2/get', 'post', '', $scope.dataManage.goodsDtlRequest
        ).then(function (resp) {
          if (resp.data.success) {
            doPrintSale(resp.data.data);
          } else {
            hdTip.tip(resp.data.message[0], 'error');
          }
        });
      };
      /**
       * 上一单，下一单点击事件
       * @param id
       */
      $scope.goUpDetail = function () {
        $scope.dataManage.goodsDtlRequest.id= $scope.dataManage.response.goodsList.preId;
        getGoodsList();
      };
      $scope.goDownDetail = function () {
        $scope.dataManage.goodsDtlRequest.id= $scope.dataManage.response.goodsList.nextId;
        getGoodsList();
      };
      /**
       * 分页回调函数
       * @param number
       */
      $scope.eachPageEvent = function (number) {
        //getShopList(number);//调用你自己的方法
      };


    }]);

})();

