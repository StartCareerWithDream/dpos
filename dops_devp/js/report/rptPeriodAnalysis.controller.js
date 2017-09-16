(function () {
    'use strict';
    angular.module('dposApp')
        .controller('rptPeriodAnalysis.Controller', function ($scope, webService, hdTip, $filter, $rootScope, $timeout) {
            /***********************************************************************************************************
             **************************************1、定义页面变量********************************************************/
            $scope.dataManage = {
                "request": {
                    "query": {
                        "filters": [
                            {
                                "property": "date:[,]", /*精确到天*/
                                "value": ['', '']
                            }
                        ],
                        "start": 0,
                        "limit": 0
                    },
                    'params': {
                        'tagNames': []
                    }
                },
                "response": {
                    "periodAnalysisList": []
                },
                "other": {
                    "periodTh": [],
                    "periodTd": [],
                    'index':"sevenDay"
                }
            };
            /***********************************************************************************************************
             **************************************2、内部方法——初始化****************************************************/
            init();
            function init() {
                initDataManage();//数据管理值初始化
                initView();
            }

            function initView() {
                    getPeriodAnalysisList();
                getShopSkuTags();
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
                        initHdMultiple('periodAnalysisMult');
                    } else {
                        hdTip.tip(resp.data.message[0], 'error');
                    }
                })
            }

            //获取列表数据
            function getPeriodAnalysisList() {
                webService.commonProvide('/{shop}/report/v2/salehour/period/report', 'POST', $scope.dataManage.request.query, $scope.dataManage.request.params).then(function (resp) {
                    if (resp.data.success) {
                        $scope.dataManage.other.periodTh = [];
                        $scope.dataManage.other.periodTd = [];
                        $scope.dataManage.response.periodAnalysisList = resp.data.data;
                        if ($scope.dataManage.request.params.tagNames.length != 0) {
                            for (var i = 0; i < resp.data.data.length; i++) {
                                $scope.dataManage.other.periodTd[i] = [];
                                if (resp.data.data[i].tags.length != 0) {
                                    for (var j = 0; j < resp.data.data[i].tags.length; j++) {
                                        for (var m = 0; m < $scope.dataManage.request.params.tagNames.length; m++) {
                                            if ($scope.dataManage.other.periodTd[i][2 * m] == undefined && $scope.dataManage.other.periodTd[i][2 * m + 1] == undefined) {
                                                $scope.dataManage.other.periodTd[i][2 * m] = '0.00'
                                                $scope.dataManage.other.periodTd[i][2 * m + 1] = '0'
                                            }
                                            if (resp.data.data[i].tags[j].saleSkuTagName == $scope.dataManage.request.params.tagNames[m]) {
                                                $scope.dataManage.other.periodTd[i][2 * m] = $filter('currency')(resp.data.data[i].tags[j].saleAmount, '')
                                                $scope.dataManage.other.periodTd[i][2 * m + 1] = resp.data.data[i].tags[j].saleQty

                                            }
                                        }
                                    }
                                } else {
                                    for (var m = 0; m < $scope.dataManage.request.params.tagNames.length; m++) {
                                        $scope.dataManage.other.periodTd[i][2 * m] = '0.00'
                                        $scope.dataManage.other.periodTd[i][2 * m + 1] = '0'
                                    }
                                }
                            }
                            for (var m = 0; m < $scope.dataManage.request.params.tagNames.length; m++) {
                                $scope.dataManage.other.periodTh.push(/*$scope.dataManage.request.params.tagNames[m] + */'零售额');
                                $scope.dataManage.other.periodTh.push(/*$scope.dataManage.request.params.tagNames[m] + */'零售数');
                            }
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
                if(hdId='periodAnalysisMult'){
                    $scope.dataManage.request.params.tagNames = [];
                    for (var i = 0, l = hdMultipleObj[hdId].list.length; i < l; i++) {
                        $scope.dataManage.request.params.tagNames.push(hdMultipleObj[hdId].list[i].tag)
                    }
                    getPeriodAnalysisList();
                }
            };


            //切换最近的tab按钮
            $scope.changeStartTime = function (date) {
                $scope.dataManage.other.index=date
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
                getPeriodAnalysisList();
            };

            //重置搜索条件
            $scope.reset = function () {
                initDataManage();
                $scope.dataManage.other.index='sevenDay'
                $scope.dataManage.request.params.tagNames = [];
                initHdMultiple('periodAnalysisMult');
                $scope.dataManage.other.periodTh = [];
                $scope.dataManage.other.periodTd = [];
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
                getPeriodAnalysisList();
            });
        });

})();

/**
 * Created by zhangying on 2017/7/20.
 */
