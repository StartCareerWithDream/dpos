(function () {
    'use strict';
    angular.module('dposApp')
        .controller('invList.Controller', function ($scope, webService, hdTip, $filter) {
            /***********************************************************************************************************
             **************************************1、定义页面变量********************************************************/
            $scope.dataManage = {
                "request": {
                    "query": {//一般查询条件
                        "filters": [  // 支持的条件—sku:%=%, tag:=, user:%=%, date:[,]
                            {
                                "property": "sku:%=%",
                                "value": ""
                            },
                            {
                                "property": "tag:=",
                                "value": ""
                            },
                            {
                                "property": "user:%=%",
                                "value": ""
                            },
                            {
                                "property": "date:[,]",
                                "value": [hdUtils.date.getWeekStartDate(), ""]
                            }
                        ],
                        "sorters": [],
                        "start": 0,
                        "limit": 0
                    },//查询条件
                    "params": {}//其他参数
                },
                "response": {
                    "tags": [],
                    "shopDtl": {},//明细对象
                    "items": []//列表对象
                },
                'other':{
                    'index':'week'
                },
                dateType: "week"
            };
            var defaultQuery = angular.copy($scope.dataManage.request.query);

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
                getShopSkuTags();
                getItems();
                initview()
            }

            function initview(){
                $scope.dataManage.request.query.filters[3].value[1] = $filter('date')(new Date().getTime(), 'yyyy-MM-dd');
                $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(6);
            }

            function getItems() {
                //获取列表
                var query = {
                    start: ($scope.currentPage - 1) * $scope.pageSize,
                    limit: $scope.pageSize,
                    filters: $scope.dataManage.request.query.filters
                };
                for (var i = 0; i < $scope.dataManage.request.query.sorters.length; i++) {
                    if ($scope.dataManage.request.query.sorters[i].direction != "") {
                        query.sorters.push($scope.dataManage.request.query.sorters[i]);
                    }
                }
                webService.commonProvide('/{shop}/inv/adjustment/query', 'POST', query).then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataManage.response.items = resp.data.data;
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

            //获取标签列表
            function getShopSkuTags() {
                webService.commonProvide('/{shop}/inv/getShopSkuTags', 'GET').then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataManage.response.tags = resp.data.data;
                    } else {
                        hdTip.tip(resp.data.message[0], 'error');
                    }
                });
            }

            /***********************************************************************************************************
             **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
            //跳转至详情
            $scope.goToDetail = function (uuid) {
                var url = location.href.split("#")[0];
                location.href = url + "#/" + "navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=inv&shopSkuUuid=" + uuid + "&adj=true";
            };

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
             * 重置事件
             * @constructor
             */
            $scope.reset = function () {
                $scope.dataManage.other.index='week'
                $scope.dataManage.request.query = angular.copy(defaultQuery);
                $scope.dataManage.dateType = "week";
                // $scope.changeDate("week");
                initview()
            };


            //tab的点击事件
            $scope.changeDate = function (newValue) {
                $scope.dataManage.other.index=newValue;
                if (newValue == "week") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(6);
                    // $scope.dataManage.request.query.filters[3].value[1] = "";
                } else if (newValue == "month") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(29);
                    // $scope.dataManage.request.query.filters[3].value[1] = "";
                } else if (newValue == "threeMonth") {
                    $scope.dataManage.request.query.filters[3].value[0] = hdUtils.date.getOtherDate(89);
                    // $scope.dataManage.request.query.filters[3].value[1] = "";
                }
            };

            /**************************************************分页事件start*********************************************/
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
            /**************************************************分页事件end*********************************************/

            /**************************************************启动*********************************************/
            init();
        });
})();
