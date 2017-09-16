/**
 * Created by ckj on 2017/8/18.
 */
(function () {
    "use strict";
    angular.module('dposApp')
        .controller('goodsModifyRecord.Controller', function ($scope, webService, hdTip, $rootScope, $filter, $state, hdDialog) {
            $scope.dataManage = {
                "request": {
                    "query": {
                        'start': 0,
                        'limit': 10,
                        "sorters": [
                            {
                                "property": "name",     //名称排序
                                "direction": ""
                            },
                            {
                                "property": "barcode",    //条码排序
                                "direction": ""
                            },
                            {
                                "property": "updateTime",     //修改时间排序
                                "direction": ""
                            }
                        ],
                        'filters': [
                            {
                                "property": "searchKey:=", // 商品uuid:90909102121FJAD
                                "value": ""
                            }, {
                                "property": "operator:in", //操作人:章三
                                "value": []
                            }, {
                                "property": "changeType:in", //修改内容:salePrice
                                "value": []
                            }, {
                                "property": "updateDate:[,]", // 时间从:2017-08-19到：
                                "value": []
                            }
                        ]
                    },
                    "shopquery": {
                        "page": 1,
                        "start": 0,
                        "limit": 10,
                        "query": "",
                        "filter": [
                            {
                                "property": "searchKey:%=%",
                                "value": ""
                            },
                            {
                                "property": "state:=",
                                "value": "normal;deleted"
                            }
                        ]
                    }
                },
                "response": {
                    "items": [],
                    "updatertags": []
                },
                "changetags": [
                    {
                        "name": "条码",
                        "value": "barcode"
                    },
                    {
                        "name": "自编码",
                        "value": "code"
                    },
                    {
                        "name": "最新进价",
                        "value": "lastInPrice"
                    },
                    {
                        "name": "售价",
                        "value": "salePrice"
                    },
                    {
                        "name": "成本价",
                        "value": "costPrice"
                    },
                    {
                        "name": "是否自动补货",
                        "value": "autoRpl"
                    },
                    {
                        "name": "最小库存数",
                        "value": "minInvQty"
                    }
                ],
                'other':{
                    'index':'sevenDay'
                },
                dateType: "sevenDay",
                show: [],
                showNum: [],
                names: []
            };
            // var date = new Date();
            /*分页*/
            $scope.pageCount = 1;//总页数，从服务中获得
            $scope.page = 2;
            $scope.currentPage = 1;//当前页
            $scope.pageSize = 10;
            $scope.total = 0;

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
                $scope.changeDate("sevenDay");
            }

            /**
             * 页面初始化
             */
            function initView() {
                var obj = eval("("+window.top.sessionStorage.getItem('goodsModifyRecord')+")");
                if (obj && obj.id && obj.id != "") {
                    $scope.dataManage.request.query.filters[0].value = obj.id;
                    if (obj.name) {
                        $scope.dataManage.request.shopquery.filter[0].value = obj.name;
                        $scope.dataManage.request.shopquery.query = obj.name;
                        initHdInputSearch('hdInputSearch1', 2);
                    }
                }
                getUpdatertags();
                getItems();
            }

            /**
             * 控件初始化
             */
            function initWidget() {
                $("th i")[2].click();
                initHdMultiple('ModifyRecordModMult');
                /*排序的实现*/
                $("th i").click(function () {
                    var $this = $(this);
                    $('th i').each(function (index) {
                        if ($this.context != $(this).context) {
                            $(this).removeClass("icon-jiangxu").removeClass("icon-shengxu").addClass("icon-morenpaixu");
                            $scope.dataManage.request.query.sorters[index].direction = "";
                        } else {
                            $this.removeClass("icon-morenpaixu");
                            if ($this.hasClass("icon-jiangxu")) {
                                $this.removeClass("icon-jiangxu").addClass("icon-shengxu");
                                $scope.dataManage.request.query.sorters[index].direction = "asc";
                            } else {
                                $this.removeClass("icon-shengxu").addClass("icon-jiangxu");
                                $scope.dataManage.request.query.sorters[index].direction = "desc";
                            }
                        }
                    });
                    getItems();
                });
                setTimeout(function() {initHdInputSearch('hdInputSearch1', 2)}, 10);
            }

            /**
             * 列表初始化
             */
            function getItems() {
                var query = {
                    start: ($scope.currentPage - 1) * $scope.pageSize,
                    limit: $scope.pageSize,
                    filters: $scope.dataManage.request.query.filters,
                    sorters: []
                };
                for (var i = 0; i < $scope.dataManage.request.query.sorters.length; i++) {
                    if ($scope.dataManage.request.query.sorters[i].direction != "") {
                        query.sorters.push($scope.dataManage.request.query.sorters[i]);
                    }
                }
                webService.commonProvide('/{shop}/report/v2/queryShopSkuModifyLog', 'POST', query, '').then(function (resp) {
                    if (resp && resp.data && resp.data.success) {
                        for (var j = 0; j < resp.data.data.length; j++) {
                            resp.data.data[j].newVal = JSON.parse(resp.data.data[j].newVal);
                            resp.data.data[j].originalVal = JSON.parse(resp.data.data[j].originalVal);
                        }
                        $scope.dataManage.response.items = resp.data.data;
                        for (var i = 0; i < $scope.dataManage.response.items.length; i++) {
                            var itemsN = $scope.dataManage.response.items[i].newVal;
                            var itemsO = $scope.dataManage.response.items[i].originalVal;
                            var num = 0;
                            if (itemsN.salePrice != itemsO.salePrice) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = "false,";
                            }
                            if (itemsN.barcode != itemsO.barcode) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (itemsN.lastInPrice != itemsO.lastInPrice) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (itemsN.minInvQty != itemsO.minInvQty) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (itemsN.code != itemsO.code) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (itemsN.autoRpl != itemsO.autoRpl) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (itemsN.costPrice != itemsO.costPrice) {
                                if (num < 2) {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "true,";
                                }
                                else {
                                    $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide,";
                                }
                                num = num + 1;
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false,";
                            }
                            if (num >= 2) {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "hide";
                            }
                            else {
                                $scope.dataManage.show[i] = $scope.dataManage.show[i] + "false";
                            }
                            $scope.dataManage.show[i] = $scope.dataManage.show[i].split(",");
                        }
                        $scope.total = resp.data.total;
                        if (resp.data.total) {
                            $scope.total = resp.data.total;
                            $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
                        } else {
                            $scope.pageCount = 1;
                        }
                    } else {
                        // hdTip.tip(resp.data.message[0], 'error');
                        hdTip.tip("请求出错！", 'error');
                    }
                });
            }

            /**
             * 商品名称选择框初始化
             */
            function getItemsName() {
                console.log($scope.dataManage.request.shopquery.query);
                console.log($scope.dataManage.request.shopquery.filter);
                $scope.dataManage.request.shopquery.filter = [{"property": "searchKey:%=%","value": $scope.dataManage.request.shopquery.query}];
                console.log($scope.dataManage.request.shopquery.filter);
                $scope.dataManage.request.shopquery.filter = angular.toJson($scope.dataManage.request.shopquery.filter);
                webService.commonProvide('/{shop}/shopSkuService/queryInputSearch', 'GET', '', $scope.dataManage.request.shopquery).then(function (resp) {
                    if (resp && resp.data && resp.data.success) {
                        for(var i = 0; i < resp.data.data.length ; i++){
                            if(resp.data.data[i].name){
                                while(resp.data.data[i].name.indexOf("<em>")!= -1||resp.data.data[i].name.indexOf("</em>")!= -1){
                                    resp.data.data[i].name = resp.data.data[i].name.replace('<em>','');
                                    resp.data.data[i].name = resp.data.data[i].name.replace('</em>','');
                                }
                                console.log(resp.data.data[i].name);
                            }
                        }
                        $scope.dataManage.names = resp.data.data;
                        initHdMultiple('multSingle1');
                    } else {
                        // hdTip.tip(resp.data.message[0], 'error');
                        // hdTip.tip("请求出错！", 'error');
                    }
                })
            }

            /**
             * 获取修改人标签列表初始化
             */
            function getUpdatertags() {
                webService.commonProvide('/{shop}/report/v2/queryAllEmployee', 'POST', null, '').then(function (resp) {
                    if (resp && resp.data && resp.data.success) {
                        $scope.dataManage.response.updatertags = resp.data.data;
                        initHdMultiple('ModifyRecordUpdMult');
                    } else {
                        // hdTip.tip(resp.data.message[0], 'error');
                        hdTip.tip("请求出错！", 'error');
                    }
                });
            }

            /***********************************************************************************************************
             **************************************4、对外方法，ng-clickng-change等方法*********************************/
            /**
             * 查询事件
             * @constructor
             */
            $scope.search = function () {
                $scope.dataManage.other.index=''
                $scope.currentPage = 1;
                $scope.total = 0;
                getItems();
            };

            /**
             * 改变日期
             * @param newValue
             */
            $scope.changeDate = function (newValue) {
                $scope.dataManage.other.index=newValue
                if (newValue == "sevenDay") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(6);
                } else if (newValue == "sixMonth") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(89);
                } else if (newValue == "threeMonth") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(29);
                }
                $scope.dataManage.request.query.filters[3].value[1] = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
            };

            /**
             * 搜索框搜索商品名
             */
            $scope.searchBtnClick  = function () {
                getItemsName();
            };

            /**
             * 复选框回调方法
             * @param hdId
             */
            $scope.hdMultipleCallBack = function (hdId) {
                //操作人多选
                if (hdId == 'ModifyRecordUpdMult') {
                    $scope.dataManage.request.query.filters[1].value = [];
                    for (var i = 0, l = hdMultipleObj[hdId].list.length; i < l; i++) {
                        $scope.dataManage.request.query.filters[1].value[i] = hdMultipleObj[hdId].list[i].name;
                    }
                }
                //修改信息多选
                else if (hdId == 'ModifyRecordModMult') {
                    $scope.dataManage.request.query.filters[2].value = [];
                    for (var x = 0, y = hdMultipleObj[hdId].list.length; x < y; x++) {
                        $scope.dataManage.request.query.filters[2].value[x] = hdMultipleObj[hdId].list[x].value;
                    }
                }
            };

            /**
             * 单选建议框的回调函数1: 输入字符串后, 可以开始调用后台服务
             * @param jqueryObj
             * @param hdId
             */
            $scope.hdInputSearchStart = function(jqueryObj, hdId) {
                if (hdId == 'hdInputSearch1') {
                    getItemsName();
                }
            };

            /**
             * 单选建议框的回调函数2: 选中一个, 可以得到输入框中的对象信息
             * @param jqueryObj
             * @param hdId
             */
            $scope.hdInputSearchCheckOne = function(jqueryObj, hdId) {
                if (hdId == 'hdInputSearch1') {
                    var jsonObj = JSON.parse(jqueryObj.attr('itemObj'));
                    jqueryObj.val(jsonObj.name);
                    $scope.dataManage.request.shopquery.query = jsonObj.name;
                    $scope.dataManage.request.query.filters[0].value = jsonObj.id;
                }
            };

            /**
             * 重置搜索条件
             */
            $scope.reset = function () {
                // initDataManage();
                $scope.dataManage.other.index='sevenDay'
                $scope.dataManage.request.query.filters[0].value = "";
                $scope.dataManage.request.query.filters[1].value = "";
                $scope.dataManage.request.query.filters[2].value = [];
                $scope.dataManage.dateType = "sevenDay";
                $scope.dataManage.request.shopquery.query = "";
                $scope.changeDate("sevenDay");
                initHdMultiple('ModifyRecordModMult');
                initHdMultiple('multSingle1');
                initHdMultiple('ModifyRecordUpdMult');
                initHdInputSearch('hdInputSearch1', 2);
            };

            /**
             * 回车键进行搜索
             */
            $scope.enterSearch = function () {
                var key = event.which || event.keyCode;
                if (key == 13) {
                    $scope.search();
                }
            };


            /**
             * 交替展开收缩
             * @param e
             */
            $scope.toggle = function (e) {
                if ($scope.dataManage.show[e][7] == "hide") {
                    for (var i = 0; i < 7; i++) {
                        if ($scope.dataManage.show[e][i] == "hide") {
                            $scope.dataManage.show[e][i] = "true"
                        }
                    }
                    $scope.dataManage.show[e][7] = "true"
                }
                else {
                    var sum = 0;
                    for (var i = 0; i < 7; i++) {
                        if ($scope.dataManage.show[e][i] == "true") {
                            sum = sum + 1;
                            if (sum > 2) {
                                $scope.dataManage.show[e][i] = "hide";
                            }
                        }
                    }
                    $scope.dataManage.show[e][7] = "hide"
                }
            };


            //分页
            /**
             * 点击第一页或者最后一页调取服务
             * @param index 第一页还是最后一页
             */
            $scope.pageGo = function (index) {
                if (index == 1) { //如果点击的是页数1
                    //此处调取服务
                    getItems();
                } else if (index == $scope.pageCount) {
                    //此处调取服务
                    getItems();
                } else {
                    //此处调取服务
                    getItems();
                }
            };
            /**
             * 点击下一页
             */
            $scope.pageTo = function () {
                $scope.currentPage += 1;//当前页加1
                if ($scope.currentPage > 5 && $scope.currentPage < $scope.pageCount) {//如果下一页到第六页并且小于总页数
                    if (($scope.page + 3) >= $scope.currentPage) {//点击下一页是否要更新页码
                    } else {
                        $scope.page = $scope.currentPage - 3;
                    }
                }
                //此处调取服务
                getItems();
            };
            /**
             * 点击上一页
             */
            $scope.pageFrom = function () {
                $scope.currentPage -= 1;//当前页减1
                if ($scope.currentPage < $scope.pageCount - 4 && $scope.currentPage > 1) {
                    if ($scope.page <= $scope.currentPage) {
                    } else {
                        $scope.page = $scope.currentPage;
                    }
                }
                //此处调取服务
                getItems();
            };
            /**
             * 到达指定页面
             * @param page
             */
            $scope.toThePage = function (page) {
                $scope.currentPage = parseInt(page);
                if (parseInt(page) >= $scope.pageCount - 4) {
                    $scope.page = $scope.pageCount - 4;
                } else if (parseInt(page) <= 5) {
                    $scope.page = 2;
                } else {
                    $scope.page = parseInt(page)
                }
            };

            init();
        });
})();
