(function () {
  'use strict';
  angular.module('dposApp')
    .controller('rptBusinessAnalysis.Controller', function ($scope, webService, hdTip, $filter, $rootScope) {
      /***********************************************************************************************************
       **************************************1、定义页面变量********************************************************/
      $scope.dataManage = {
        "request": {
          "body": {//一般查询条件
            "filters": [
              {
                "property": 'date:[,]', // 日期范围，精确到天 (必填)
                "value": ['', '']
              },
              {
                "property": 'shopSkuTag:in', // 商品标签 （1.9.5版本不提供）
                "value": ['', '']
              }, {
                "property": 'shopSku:=', // 商品uuid等于,如果查询条件存在商品等于，则不考虑商品标签查询条件 （1.9.5版本不提供）
                "value": []
              }
            ],
            "start": 0,
            "limit": 0
          },//查询条件
          "params": {
            "scope": "MONTH",  // DAY MONTH YEAR
            "eveningWorkStart": "23:00",
            "eveningWorkEnd": "07:00"
          }//其他参数
        },
        "response": {
          "shopDtl": {},//明细对象
          "shopList": []//列表对象
        },
        'other':{
          'index':'DAY'
        }
      };

      /*分页初始化*/
      $scope.pageCount = 1;//总页数，从服务中获得
      $scope.page = 2;
      $scope.currentPage = 1;//当前页
      $scope.pageSize = 10;
      $scope.total = 0;

      //option展示
      $scope.showOption = false;
      //是否第一次进入页面只展示4种线
      $scope.showFour = true;


      var date = new Date();

      $scope.dataManage.request.params.scope = "DAY";
      $scope.dataManage.request.body.filters[0].value[0] = $filter('date')((date.getTime() - 6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
      $scope.dataManage.request.body.filters[0].value[1] = $filter('date')(date.getTime(), 'yyyy-MM-dd');

      /***********************************************************************************************************
       **************************************2、内部方法——初始化****************************************************/
      init();

      //重置按钮
      $scope.reset = function () {
        $scope.dataManage.other.index='DAY'
        $scope.dataManage.request.body.filters[0].value[0] = $filter('date')((date.getTime() - 6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
        $scope.dataManage.request.body.filters[0].value[1] = $filter('date')(date.getTime(), 'yyyy-MM-dd');
        $scope.dataManage.request.params.eveningWorkStart = '23:00';
        $scope.dataManage.request.params.eveningWorkEnd = '07:00';
      }
      /***********************************************************************************************************
       **************************************3、内部方法——工具、设置类型*********************************************/
      /**
       * 初始化
       */
      function init() {
        initDataManage();//数据管理值初始化
      }

      /**
       * 数据管理值初始化
       */
      function initDataManage() {
        getAnlysisReport();
      }

      //搜索条件按钮搜索
      $scope.search = function () {
        $scope.dataManage.other.index=''
        getAnlysisReport();
      }

      /**
       * 页面初始化
       */
      // function initView() {
      //
      // }

      /**
       * 控件初始化
       */
      // function initWidget() {
      //
      // }
      //时间间隔方法
      function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-")
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式
        aDate = sDate2.split("-")
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
        return iDays
      }


      //获取页面报表数据
      function getAnlysisReport() {
        var arr1 = $scope.dataManage.request.body.filters[0].value[0].split("-");
        var arr2 = $scope.dataManage.request.body.filters[0].value[1].split("-");
        var date1=new Date(parseInt(arr1[0]),parseInt(arr1[1])-1,parseInt(arr1[2]),0,0,0);
        var date2=new Date(parseInt(arr2[0]),parseInt(arr2[1])-1,parseInt(arr2[2]),0,0,0);
        if(date1.getTime()>date2.getTime()) {
          hdTip.tip("请求失败", "error", '请选择正确的时间段!');
          return false;
        }


        $scope.xAxisList = []; //x轴数量
        $scope.saleAmountList = []; //销售额列表
        $scope.maoLiList = []; //毛利额
        $scope.maolilvList = []; //毛利率
        $scope.customerNumList = []; //来客数 销售笔数
        $scope.unitPriceList = []; // 客单价
        $scope.pmSaleAmountList = []; //夜班售而
        $scope.cartList = []; //库存品相数
        $scope.dongxiaopingxiangList = []; //动向
        $scope.importGoodsList = []; //进货金额

        // if (DateDiff($scope.dataManage.request.body.filters[0].value[1], $scope.dataManage.request.body.filters[0].value[0]) > 0 && DateDiff($scope.dataManage.request.body.filters[0].value[1], $scope.dataManage.request.body.filters[0].value[0]) < 40) {
        //   $scope.dataManage.request.params.scope = 'DAY';
        // } else if (DateDiff($scope.dataManage.request.body.filters[0].value[1], $scope.dataManage.request.body.filters[0].value[0]) >= 40 && DateDiff($scope.dataManage.request.body.filters[0].value[1], $scope.dataManage.request.body.filters[0].value[0]) < 365) {
        //   $scope.dataManage.request.params.scope = 'MONTH';
        // } else if (DateDiff($scope.dataManage.request.body.filters[0].value[1], $scope.dataManage.request.body.filters[0].value[0]) >= 365) {
        //   $scope.dataManage.request.params.scope = 'YEAR';
        // }

        webService.commonProvide('/{shop}/report/operationanalysis', 'post', $scope.dataManage.request.body, $scope.dataManage.request.params).then(function (resp) {
          if (resp) {
            // 正常返回值的情况
            if (resp.data.success) {
              // $scope.$apply();
              // $scope.saleChartData = resp.summary.totalSaleAmount;
              // $scope.lineChart = resp.summary.totalPurchaseAmount;
              $scope.recordTableData = resp.data.data;


              for (var i = 0; i < resp.data.data.length; i++) {
                $scope.xAxisList.push(resp.data.data[i].axisLabel);//x轴数据

                $scope.saleAmountList.push(resp.data.data[i].saleAmount.toFixed(2)); //销售额 金额
                $scope.maoLiList.push(resp.data.data[i].retailGrossAmount.toFixed(2)); //毛利额 金额
                $scope.maolilvList.push(resp.data.data[i].saleGrossRate.toFixed(2)); //毛利率  利率
                $scope.customerNumList.push(resp.data.data[i].saleNumber); // 来客数 销售笔数 数量
                $scope.unitPriceList.push(resp.data.data[i].saleAmountAvg.toFixed(2)); //客单价 金额
                $scope.pmSaleAmountList.push(resp.data.data[i].eveningAmount.toFixed(2));//夜场销售 金额
                $scope.cartList.push(resp.data.data[i].ivnCount);//品项数 数量
                $scope.dongxiaopingxiangList.push(resp.data.data[i].saleCount); // 动向 数量
                $scope.importGoodsList.push(resp.data.data[i].purchaseAmount); //进货 数量
              }


              //给summary图表赋值
              $scope.saleSummaryAmount = resp.data.summary.totalSaleAmount;
              $scope.purchaseSummaryAmount = resp.data.summary.totalPurchaseAmount;

              //计算summary图最大值
              if ($scope.saleSummaryAmount > $scope.purchaseSummaryAmount) {
                if ($scope.saleSummaryAmount > 10000 === true) {
                  $scope.maxYaxis = Math.floor($scope.saleSummaryAmount / 1000) * 1000 + 1000
                  $scope.saleStep = $scope.maxYaxis / 10;
                } else {
                  $scope.maxYaxis = Math.floor($scope.saleSummaryAmount / 100) * 100 + 100;
                  $scope.saleStep = $scope.maxYaxis / 10;
                }
              } else {
                if ($scope.purchaseSummaryAmount > 10000 === true) {
                  $scope.maxYaxis = Math.floor($scope.purchaseSummaryAmount / 1000) * 1000 + 1000
                  $scope.saleStep = $scope.maxYaxis / 10;
                } else {
                  $scope.maxYaxis = Math.floor($scope.purchaseSummaryAmount / 100) * 100 + 100;
                  $scope.saleStep = $scope.maxYaxis / 10;
                }
              }

              //计算趋势图最大值
              //金额最大值
              var maxAmountList = [];
              maxAmountList.push(Math.max.apply(null, $scope.saleAmountList));
              maxAmountList.push(Math.max.apply(null, $scope.maoLiList));
              maxAmountList.push(Math.max.apply(null, $scope.unitPriceList));
              maxAmountList.push(Math.max.apply(null, $scope.pmSaleAmountList));
              maxAmountList.push(Math.max.apply(null, $scope.importGoodsList));
              $scope.maxYaxisAmount = Math.max.apply(null, maxAmountList);


              //金额最小值
              var minAmountList = [];
              minAmountList.push(Math.min.apply(null, $scope.saleAmountList));
              minAmountList.push(Math.min.apply(null, $scope.maoLiList));
              minAmountList.push(Math.min.apply(null, $scope.unitPriceList));
              minAmountList.push(Math.min.apply(null, $scope.pmSaleAmountList));
              minAmountList.push(Math.min.apply(null, $scope.importGoodsList));
              $scope.minYaxisAmount = Math.min.apply(null, minAmountList);

              if ($scope.minYaxisAmount >= 0) {
                $scope.minYaxis1 = 0;
              } else {
                $scope.minYaxis1 = Math.round($scope.minYaxisAmount / 100) * 100 - 100;
              }

              //计算间隔
              if ($scope.maxYaxisAmount > 10000 === true) {
                $scope.maxYaxis1 = Math.floor($scope.maxYaxisAmount / 1000) * 1000 + 1000
                $scope.stepChart1 = ($scope.maxYaxis1- $scope.minYaxis1) / 5;
              } else {
                $scope.maxYaxis1 = Math.floor($scope.maxYaxisAmount / 100) * 100 + 100;
                $scope.stepChart1 = ($scope.maxYaxis1- $scope.minYaxis1) / 5;
              }


              //利率Y轴最大值
              var maxRateList = [];
              var minRateList = [];
              maxRateList.push(Math.max.apply(null, $scope.maolilvList));
              minRateList.push(Math.min.apply(null, $scope.maolilvList));
              $scope.maxYaxisRate2 = Math.max.apply(null, maxRateList);
              if($scope.maxYaxisRate2 <= 0){
                $scope.maxYaxisRate2 = 0;
              }else if($scope.maxYaxisRate2 > 0 && $scope.maxYaxisRate2 <= 100){
                $scope.maxYaxisRate2 = 100;
              }else{
                $scope.maxYaxisRate2 = $scope.maxYaxisRate2 + 10;
              }
              $scope.minYaxisRate2 = Math.min.apply(null, minRateList);
              if($scope.minYaxisRate2 > 0){
                $scope.minYaxisRate2 = 0;
              }else{
                $scope.minYaxisRate2 = $scope.minYaxisRate2 - 10;
              }
              $scope.stepChart2 = ($scope.maxYaxisRate2 - $scope.minYaxisRate2) / 5;


              //数量Y轴最大值
              var maxCountList = [];
              maxCountList.push(Math.max.apply(null, $scope.customerNumList));
              // maxCountList.push(Math.max.apply(null, $scope.cartList));
              maxCountList.push(Math.max.apply(null, $scope.dongxiaopingxiangList));
              $scope.maxYaxisCount = Math.max.apply(null, maxCountList);
              if ($scope.maxYaxisCount > 10000 === true) {
                $scope.maxYaxis3 = Math.floor($scope.maxYaxisCount / 1000) * 1000 + 1000
                $scope.stepChart3 = $scope.maxYaxis3 / 5;
              } else {
                $scope.maxYaxis3 = Math.floor($scope.maxYaxisCount / 100) * 100 + 100;
                $scope.stepChart3 = $scope.maxYaxis3 / 5;
              }


              // if($scope.showFour == true){
              //   changeFourChartOption($scope.xAxisList,$scope.saleAmountList,$scope.customerNumList,$scope.unitPriceList,$scope.pmSaleAmountList);
              // }else{
              changeChartOption($scope.xAxisList, $scope.saleAmountList, $scope.maoLiList, $scope.maolilvList, $scope.customerNumList, $scope.unitPriceList, $scope.pmSaleAmountList, $scope.cartList, $scope.dongxiaopingxiangList, $scope.importGoodsList);
              // }

              setAmountChart();
            } else {
              hdTip.tip("请求失败", "error", resp.success);
            }
          } else {
            hdTip.tip("请求失败", "error", resp.success);
          }
        }).catch(function (local) {
          console.log(local);
        });
      }

      //点击 配置趋势表展示数据个数
      $scope.saleAmountBool = true;
      $scope.unitPriceBool = true;
      $scope.saleNumberBool = true;
      $scope.eveningAmountBool = true;
      $scope.importBool = false;
      $scope.retailGrossAmountBool = false;
      $scope.saleGrossRateBool = false;
      $scope.ivnCountBool = false;
      $scope.saleCountBool = false;

      $scope.bool = {
        "sale": true,
        "utp": true,
        "sc": true,
        "pms": true,
        "ip": false,
        "ml": false,
        "mlv": false,
        "dc": false,
        "dx": false,
      }

      $scope.xAxisList = []; //x轴数量
      $scope.saleAmountList = []; //销售额列表
      $scope.maoLiList = []; //毛利额
      $scope.maolilvList = []; //毛利率
      $scope.customerNumList = []; //来客数 销售笔数
      $scope.unitPriceList = []; // 客单价
      $scope.pmSaleAmountList = []; //夜班销售而
      $scope.cartList = []; //库存品相数
      $scope.dongxiaopingxiangList = []; //动向
      $scope.importGoodsList = []; //进货金额
      //销售额
      $scope.chooseSaleAmountOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[0] = {
            name: '销售额',
            type: 'line',
            symbol: 'circle',
            showAllSymbol: true,
            symbolSize: 10,
            data: $scope.saleAmountList,
            lineStyle: {
              normal: {
                color: '#F56E6A'
              }
            },
            itemStyle: {
              normal: {
                color: '#F56E6A'
              },
              emphasis: {
                color: '#F56E6A'
              }
            },
            yAxisIndex: 0
          };
          $scope.bool.sale = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[0] = '';
          $scope.bool.sale = false;
        }
      }
      //客单价
      $scope.chooseUnitPriceOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[1] = {
            name: '客单价',
            type: 'line',
            yAxisIndex: 0,
            data: $scope.unitPriceList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#009999'
              }
            },
            itemStyle: {
              normal: {
                color: '#009999'
              },
              emphasis: {
                color: '#009999'
              }
            }
          };
          $scope.bool.utp = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[1] = '';
          $scope.bool.utp = false;
        }
      }
      //销售笔数
      $scope.chooseSaleNumberOption = function (bool) {
        if (bool == true) {
          $scope.bool.sc = true;
          $scope.lineChartOption.series[2] = {
            name: '销售笔数',
            type: 'line',
            yAxisIndex: 1,
            data: $scope.customerNumList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#6EC71E'
              }
            },
            itemStyle: {
              normal: {
                color: '#6EC71E'
              },
              emphasis: {
                color: '#6EC71E'
              }
            }
          };
        } else if (bool == false) {
          $scope.lineChartOption.series[2] = '';
          $scope.bool.sc = false;
        }
      }
      //夜班销售总额
      $scope.chooseEveningSaleAmountOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[3] = {
            name: '夜班销售额',
            type: 'line',
            yAxisIndex: 0,
            data: $scope.pmSaleAmountList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#FFCC00'
              }
            },
            itemStyle: {
              normal: {
                color: '#FFCC00'
              },
              emphasis: {
                color: '#FFCC00'
              }
            }
          };
          $scope.bool.pms = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[3] = '';
          $scope.bool.pms = false;
        }
      }
      //进货
      $scope.chooseImportOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[4] = {
            name: '进货额',
            type: 'line',
            yAxisIndex: 0,
            data: $scope.importGoodsList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#4FA8F9'
              }
            },
            itemStyle: {
              normal: {
                color: '#4FA8F9'
              },
              emphasis: {
                color: '#4FA8F9'
              }
            }
          };
          $scope.bool.ip = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[4] = '';
          $scope.bool.ip = false;
        }
      }
      //毛利额
      $scope.chooseRetailGrossAmountOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[5] = {
            name: '零售毛利额',
            type: 'line',
            yAxisIndex: 0,
            data: $scope.maoLiList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#ff6600'
              }
            },
            itemStyle: {
              normal: {
                color: '#ff6600'
              },
              emphasis: {
                color: '#ff6600'
              }
            }
          };
          $scope.bool.ml = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[5] = '';
          $scope.bool.ml = false;
        }
      }
      //毛利率
      $scope.chooseSaleGrossRateOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[6] = {
            name: '毛利率',
            type: 'line',
            yAxisIndex: 2,
            data: $scope.maolilvList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#cc3300'
              }
            },
            itemStyle: {
              normal: {
                color: '#cc3300'
              },
              emphasis: {
                color: '#cc3300'
              }
            }
          };
          $scope.bool.mlv = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[6] = '';
          $scope.bool.mlv = false;
        }
      }
      //库存品项数
      $scope.chooseIvnCountOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[7] = {
            name: '库存品项数',
            type: 'line',
            yAxisIndex: 1,
            data: $scope.cartList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#1B1B1B'
              }
            },
            itemStyle: {
              normal: {
                color: '#1B1B1B'
              },
              emphasis: {
                color: '#1B1B1B'
              }
            }
          };
          $scope.bool.dc = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[7] = '';
          $scope.bool.dc = false;
        }
      }
      //动销品项数
      $scope.chooseSaleCountOption = function (bool) {
        if (bool == true) {
          $scope.lineChartOption.series[8] = {
            name: '动销品项数',
            type: 'line',
            yAxisIndex: 1,
            data: $scope.dongxiaopingxiangList,
            symbol: 'circle',
            symbolSize: 10,
            showAllSymbol: true,
            lineStyle: {
              normal: {
                color: '#FF66CC'
              }
            },
            itemStyle: {
              normal: {
                color: '#FF66CC'
              },
              emphasis: {
                color: '#FF66CC'
              }
            }
          };
          $scope.bool.dx = true;
        } else if (bool == false) {
          $scope.lineChartOption.series[8] = '';
          $scope.bool.dx = false;
        }
      }


      //生成趋势图


      // function changeFourChartOption(xl, sl, cnl, upl, pml) {
      //   //趋势图 配置项
      //   $scope.lineChartOption1 = {
      //     "calculable": true,
      //     "tooltip": {
      //       "trigger": 'axis'
      //     },
      //     "grid": {
      //       "left": '12%',
      //       "right": '7%',
      //       "bottom": '19%',
      //       "top": '7%'
      //     },
      //     "legend": {
      //       "bottom": '20',
      //       "icon": 'circle',
      //       "orient": 'horizontal',
      //       "selectedMode": false,
      //       "selected": {
      //         '销售额': true,
      //         '客单价': true,
      //         '销售笔数': true,
      //         '夜班销售总额': true,
      //         '进货金额': true,
      //         '毛利额': true,
      //         '毛利率': true,
      //         '库存品项数': true,
      //         '动销品项数': true
      //       },
      //       "data": [
      //         '销售额', '客单价', '销售笔数', '夜班销售总额', '进货金额', '毛利额', '毛利率', '库存品项数', '动销品项数'
      //       ]
      //     },
      //     "xAxis": [
      //       {
      //         "data": xl,
      //         "type": "category",
      //         "boundaryGap": true,
      //         "axisLine": {
      //           show: false,
      //           lineStyle: {
      //             color: '#F2F2F2c'
      //           }
      //         },
      //         "splitLine": {
      //           "show": false
      //         },
      //         "axisTick": {
      //           "show": false
      //         }
      //       }
      //     ],
      //     "yAxis": [
      //       {
      //         type: 'value',
      //         name: '金额',
      //         axisLine: {
      //           show: false
      //         },
      //         min: 0,
      //         max: $scope.maxYaxis1,
      //         interval: $scope.stepChart1,
      //         splitnumber: 5,
      //         axisLabel: {
      //           formatter: '{value}'
      //         },
      //         axisTick: {
      //           show: false
      //         },
      //         label: {
      //           normal: {
      //             show: false
      //           }
      //         }
      //       },
      //       {
      //         type: 'value',
      //         name: '利率(100%)',
      //         min: 0,
      //         max: 100,
      //         interval: 20,
      //         axisLine: {
      //           show: false
      //         },
      //         axisLabel: {
      //           formatter: '{value}'
      //         },
      //         axisTick: {
      //           show: false
      //         },
      //         boundaryGap: [0, '100%'],
      //         label: {
      //           normal: {
      //             show: false
      //           }
      //         }
      //       },
      //       {
      //         min: 0,
      //         max: $scope.maxYaxis3,
      //         interval: $scope.stepChart3,
      //         type: 'value',
      //         name: '数量',
      //         position: 'left',
      //         offset: 60,
      //         axisLabel: {
      //           formatter: '{value}'
      //         }
      //       }
      //     ],
      //     "series": [
      //       {
      //         name: '销售额',
      //         type: 'line',
      //         symbol: 'circle',
      //         showAllSymbol: true,
      //         symbolSize: 10,
      //         data: sl,
      //         lineStyle: {
      //           normal: {
      //             color: '#F56E6A'
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: '#F56E6A'
      //           },
      //           emphasis: {
      //             color: '#F56E6A'
      //           }
      //         },
      //         yAxisIndex: 0
      //       },
      //       {
      //         name: '客单价',
      //         type: 'line',
      //         yAxisIndex: 0,
      //         data: upl,
      //         symbol: 'circle',
      //         symbolSize: 10,
      //         showAllSymbol: true,
      //         lineStyle: {
      //           normal: {
      //             color: '#009999'
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: '#009999'
      //           },
      //           emphasis: {
      //             color: '#009999'
      //           }
      //         }
      //       },
      //       {
      //         name: '销售笔数',
      //         type: 'line',
      //         yAxisIndex: 1,
      //         data: cnl,
      //         symbol: 'circle',
      //         symbolSize: 10,
      //         showAllSymbol: true,
      //         lineStyle: {
      //           normal: {
      //             color: '#6EC71E'
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: '#6EC71E'
      //           },
      //           emphasis: {
      //             color: '#6EC71E'
      //           }
      //         }
      //       },
      //       {
      //         name: '夜班销售总额',
      //         type: 'line',
      //         yAxisIndex: 0,
      //         data: pml,
      //         symbol: 'circle',
      //         symbolSize: 10,
      //         showAllSymbol: true,
      //         lineStyle: {
      //           normal: {
      //             color: '#FFCC00'
      //           }
      //         },
      //         itemStyle: {
      //           normal: {
      //             color: '#FFCC00'
      //           },
      //           emphasis: {
      //             color: '#FFCC00'
      //           }
      //         }
      //       }, '', '', '', '', ''
      //     ]
      //   }
      //   $scope.saleLineChart = echarts.init(document.getElementById("saleLineChart"));
      //   $scope.saleLineChart.setOption($scope.lineChartOption1, true);
      //   // window.onresize = $scope.saleLineChart.resize;
      // }


      function changeChartOption(xl, sl, ml, mlvl, cnl, upl, pml, ctl, dpl, igl) {
        $scope.lineChartOption = {
          "calculable": true,
          "tooltip": {
            "trigger": 'axis'
          },
          "grid": {
            "left": '20%',
            "right": '7%',
            "bottom": '19%',
            "top": '7%'
          },
          "legend": {
            "bottom": '20',
            "icon": 'circle',
            "orient": 'horizontal',
            "selectedMode": false,
            "selected": {
              '销售额': $scope.bool.sale,
              '客单价': $scope.bool.utp,
              '销售笔数': $scope.bool.sc,
              '夜班销售额': $scope.bool.pms,
              '进货额': $scope.bool.ip,
              '零售毛利额': $scope.bool.ml,
              '毛利率': $scope.bool.mlv,
              /* '库存品项数':$scope.bool.dc,*/
              '动销品项数': $scope.bool.dx
            },
            // formatter: function(params){
            //   console.log(params)
            //   if(params=='夜班销售额'){
            //     var res = '夜班销售额   搜索'
            //     return  res
            //   }else{
            //     return params
            //   }
            // },
            "data": [
              {
                "name": '销售额',
                "textStyle": {
                  "fontSize": 12
                }
              },
              '客单价', '销售笔数', '夜班销售额', '进货额', '零售毛利额', '毛利率', /*'库存品项数',*/ '动销品项数'
            ]
          },

          "xAxis": [
            {
              "data": xl,
              "type": "category",
              "boundaryGap": true,
              "axisLine": {
                show: false
              },
              "splitLine": {
                "show": false
              },
              "axisTick": {
                "show": false
              }
            }
          ],
          "yAxis": [
            {
              min: 0,
              max: $scope.maxYaxis3,
              interval: $scope.stepChart3,
              type: 'value',
              name: '数量(笔)',
              axisLabel: {
                formatter: '{value}'
              },
              axisLine: {
                show: true
              },
              axisTick: {
                show: false
              },
              boundaryGap: [0, '100%'],
              label: {
                normal: {
                  show: false
                }
              },
              splitnumber: 5,
            },
            {
              type: 'value',
              name: '金额(元)',
              offset: 60,
              position: 'left',
              axisLine: {
                show: true
              },
              min: $scope.minYaxis1,
              max: $scope.maxYaxis1,
              interval: $scope.stepChart1,
              splitnumber: 5,
              axisLabel: {
                formatter: function (value) {
                  return value.toFixed(2);
                }
              },
              axisTick: {
                show: false
              }
            },
            {
              type: 'value',
              name: '利率(%)',
              min: $scope.minYaxisRate2,
              max: $scope.maxYaxisRate2,
              interval: $scope.stepChart2,
              axisLine: {
                show: true
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                formatter: function (value) {
                  return value.toFixed(2);
                }
              },
              splitnumber: 5,
            }
          ],
          "series": [
            {
              name: '销售额',
              type: 'line',
              symbol: 'circle',
              showAllSymbol: true,
              symbolSize: 10,
              data: sl,
              lineStyle: {
                normal: {
                  color: '#F56E6A'
                }
              },
              itemStyle: {
                normal: {
                  color: '#F56E6A'
                },
                emphasis: {
                  color: '#F56E6A'
                }
              },
              yAxisIndex: 1
            },
            {
              name: '客单价',
              type: 'line',
              yAxisIndex: 1,
              data: upl,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#009999'
                }
              },
              itemStyle: {
                normal: {
                  color: '#009999'
                },
                emphasis: {
                  color: '#009999'
                }
              }
            },
            {
              name: '销售笔数',
              type: 'line',
              yAxisIndex: 0,
              data: cnl,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#6EC71E'
                }
              },
              itemStyle: {
                normal: {
                  color: '#6EC71E'
                },
                emphasis: {
                  color: '#6EC71E'
                }
              }
            },
            {
              name: '夜班销售额',
              type: 'line',
              yAxisIndex: 1,
              data: pml,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#FFCC00'
                }
              },
              itemStyle: {
                normal: {
                  color: '#FFCC00'
                },
                emphasis: {
                  color: '#FFCC00'
                }
              }
            },
            {
              name: '进货额',
              type: 'line',
              yAxisIndex: 1,
              data: igl,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#4FA8F9'
                }
              },
              itemStyle: {
                normal: {
                  color: '#4FA8F9'
                },
                emphasis: {
                  color: '#4FA8F9'
                }
              }
            },
            {
              name: '零售毛利额',
              type: 'line',
              yAxisIndex: 1,
              data: ml,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#ff6600'
                }
              },
              itemStyle: {
                normal: {
                  color: '#ff6600'
                },
                emphasis: {
                  color: '#ff6600'
                }
              }
            },
            {
              name: '毛利率',
              type: 'line',
              yAxisIndex: 2,
              data: mlvl,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#cc3300'
                }
              },
              itemStyle: {
                normal: {
                  color: '#cc3300'
                },
                emphasis: {
                  color: '#cc3300'
                }
              }
            },
            // {
            //   name: '库存品项数',
            //   type: 'line',
            //   yAxisIndex: 0,
            //   data: ctl,
            //   symbol: 'circle',
            //   symbolSize: 10,
            //   showAllSymbol: true,
            //   lineStyle: {
            //     normal: {
            //       color: '#1B1B1B'
            //     }
            //   },
            //   itemStyle: {
            //     normal: {
            //       color: '#1B1B1B'
            //     },
            //     emphasis: {
            //       color: '#1B1B1B'
            //     }
            //   }
            // },
            {
              name: '动销品项数',
              type: 'line',
              yAxisIndex: 0,
              data: dpl,
              symbol: 'circle',
              symbolSize: 10,
              showAllSymbol: true,
              lineStyle: {
                normal: {
                  color: '#FF66CC'
                }
              },
              itemStyle: {
                normal: {
                  color: '#FF66CC'
                },
                emphasis: {
                  color: '#FF66CC'
                }
              }
            }
          ]
        }
        $scope.saleLineChart = echarts.init(document.getElementById("saleLineChart"));
        $scope.saleLineChart.setOption($scope.lineChartOption, true);
        // window.onresize = $scope.saleLineChart.resize;

      }


      //生成总值图
      function setAmountChart() {
        //设置销售总额
        $scope.summaryChartOption = {

          tooltip: {
            trigger: 'item',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            position: 'top'
          },
          grid: {
            left: '0%',
            right: '10%',
            bottom: '10%',
            top: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['销售额', '进货额'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '元',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              min: 0,
              max: $scope.maxYaxis,
              interval: $scope.saleStep,
              splitNumber:10,
              axisLabel: {
                formatter: '{value}'
              },
              label: {
                normal: {
                  show: false
                }
              }
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '30',
              data: [$scope.saleSummaryAmount, $scope.purchaseSummaryAmount],
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorList = [
                      '#F56E6A', '#4FA8F9'
                    ];
                    return colorList[params.dataIndex]
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: '{c}',
                  textStyle: {
                    color: '#333'
                  }
                }
              }

            }

          ]
        };
        $scope.summaryBarChart = echarts.init(document.getElementById("summaryBarChart"));
        $scope.summaryBarChart.setOption($scope.summaryChartOption, true);
        // window.onresize = $scope.summaryBarChart.resize;
      }

      //图表响应式
      window.onresize = function () {
        $scope.saleLineChart.resize();
        $scope.summaryBarChart.resize();
      };

      //改变夜班时间查询
      $scope.searchTime = function () {
        getAnlysisReport();
      }

      $scope.searchTime = function () {
        getAnlysisReport();
      }

      //打开折线图选项
      $scope.chooseOptionPart = function () {
        $scope.showFour = false;
        $scope.showOption = !$scope.showOption;
      }
      //关闭折线图选项
      $scope.hideOption = function () {
        getAnlysisReport();
        $scope.showOption = false;
      }

      /***********************************************************************************************************
       **************************************4、对外方法，ng-click\ng-change\等方法*********************************/
      /**
       *选择切换时间段标签
       * @constructor
       */
      $scope.changeDate = function (type) {
        $scope.dataManage.other.index=type;
        if (type == 'DAY') {
          $scope.dataManage.request.body.filters[0].value[0] = $filter('date')((date.getTime() - 6 * 24 * 3600 * 1000), 'yyyy-MM-dd');
          $scope.dataManage.request.body.filters[0].value[1] = $filter('date')(date.getTime(), 'yyyy-MM-dd');
        } else if (type == 'MONTH') {
          $scope.dataManage.request.body.filters[0].value[0] = $filter('date')((date.getTime() - 29 * 24 * 3600 * 1000), 'yyyy-MM-dd');
          $scope.dataManage.request.body.filters[0].value[1] = $filter('date')(date.getTime(), 'yyyy-MM-dd');
        } else if (type == 'YEAR') {
          $scope.dataManage.request.body.filters[0].value[0] = $filter('date')((date.getTime() - 89 * 24 * 3600 * 1000), 'yyyy-MM-dd');
          $scope.dataManage.request.body.filters[0].value[1] = $filter('date')(date.getTime(), 'yyyy-MM-dd');
        }
        // $scope.$apply();
      };


      /***********************************************************************************************************
       **************************************5、广播**************************************************************/
      /**
       * 发送到**的广播
       */
      // $scope.$broadcast('**', '**');
      /**
       * 发送到**的广播
       */
      // $scope.$emit('**', '**');
      /**
       * 接收来自**的广播
       */
      // $scope.$on('**', function (event, data) {
      //
      // })

    });

})();

