(function () {
    'use strict';
    angular.module('dposApp')
        .controller('rptTagAnalysis.Controller', function ($scope, webService, hdTip, $filter, $rootScope) {
            /***********************************************************************************************************
             **************************************1、定义页面变量********************************************************/
            $scope.dataManage = {
                "request": {
                    "query": {
                        "filters": [
                            {
                                "property": "date:[,]",  /*精确到天*/
                                "value": ['','']
                            },
                            {
                                "property": "tags:in",   /*标签名称包含*/
                                "value": []
                            }
                        ],
                        "sorters": [
                            {
                                "property": "saleAmount",
                                "direction": ""
                            },
                            {
                                "property": "saleCostAmount",
                                "direction": ""
                            },
                            {
                                "property": "saleQty",
                                "direction": ""
                            },
                            {
                                "property": "saleAmount",
                                "direction": ""
                            },
                            {
                                "property": "saleGrossAmount",
                                "direction": ""
                            }
                        ],
                        "start": 0,
                        "limit": 0
                    }
                },
                "response": {
                    "tagAnalysisList": []
                },
                "other": {
                    'index':'sevenDay'
                }
            };

            /*分页*/
            $scope.pageCount = 1;//总页数，从服务中获得
            $scope.page = 2;
            $scope.currentPage = 1;//当前页
            $scope.pageSize = 10;
            $scope.total = 0;
            /***********************************************************************************************************
             **************************************2、内部方法——初始化****************************************************/
            init();
            function init() {
                initDataManage();//数据管理值初始化
                initView()
            }
           function initView() {
               getShopSkuTags();
               getTagAnalysisList()
           }
            //数据管理值初始化
            function initDataManage() {
                $scope.dataManage.request.query.filters[0].value[1] = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
                $scope.dataManage.request.query.filters[0].value[0] = hdUtils.date.getOtherDate(6);
            }
            /*********************此处部分是处理多选下拉框的*********************************/
            //获取查询的标签select
            function getShopSkuTags() {
                webService.commonProvide('/{shop}/inv/getShopSkuTags', 'GET', '', '').then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataManage.response.shopSkuTags = resp.data.data;
                        initHdMultiple('tagAnalysisMult');
                    } else {
                        hdTip.tip(resp.data.message[0], 'error');
                    }
                })
            }

            //获取列表数据
            function getTagAnalysisList() {
                $scope.dataManage.request.query.start = ($scope.currentPage - 1) * $scope.pageSize;
                $scope.dataManage.request.query.limit = $scope.pageSize;
                webService.commonProvide('/{shop}/report/v2/saleskutag/report', 'POST', $scope.dataManage.request.query, '').then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataManage.response.tagAnalysisList = resp.data;
                        $scope.total = resp.data.total;
                        if (resp.data.total) {
                            $scope.pageCount = Math.ceil(resp.data.total / $scope.pageSize);
                        } else {
                            $scope.pageCount = 1;
                        }
                    } else {
                        hdTip.tip(resp.data.message[0], 'error');
                    }
                });
            }

            /***********************************************************************************************************
             **************************************3、外部方法****************************************************/
            //选择标签
            $scope.hdMultipleCallBack = function (hdId) {
                if(hdId='tagAnalysisMult'){
                    $scope.dataManage.request.query.filters[1].value = [];
                    for (var i = 0, l = hdMultipleObj[hdId].list.length; i < l; i++) {
                        $scope.dataManage.request.query.filters[1].value.push(hdMultipleObj[hdId].list[i].tag)
                    }
                }
            };

            //切换最近的tab按钮
            $scope.changeStartTime = function (date) {
                $scope.dataManage.other.index=date;
                if (date == "sevenDay") {
                    $scope.dataManage.request.query.filters[0].value[0] = hdUtils.date.getOtherDate(6);
                } else if (date == "sixMonth") {
                    $scope.dataManage.request.query.filters[0].value[0] = hdUtils.date.getOtherDate(89);
                } else if (date == "threeMonth") {
                    $scope.dataManage.request.query.filters[0].value[0] = hdUtils.date.getOtherDate(29);
                }
                $scope.dataManage.request.query.filters[0].value[1] = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
            };
            //根据搜索条件进行查询数据
            $scope.search = function () {
                $scope.dataManage.other.index=''
                $scope.currentPage = 1;
                getTagAnalysisList();
            };

            //重置搜索条件
            $scope.reset = function () {
                initDataManage();
                initHdMultiple('tagAnalysisMult');
                $scope.dataManage.other.index='sevenDay'
                $scope.dataManage.request.query.filters[1].value = [];
            };
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
                getTagAnalysisList();
            });
            //分页
            /**
             * 点击第一页或者最后一页调取服务
             * @param index 第一页还是最后一页
             */
            $scope.pageGo = function (index) {
                if (index == 1) { //如果点击的是页数1
                    getTagAnalysisList();
                } else if (index == $scope.pageCount) {
                    getTagAnalysisList();
                } else {
                    getTagAnalysisList();
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
                getTagAnalysisList();
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
                getTagAnalysisList();
            };
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
        });

})();

