/**
 * Created by ckj on 2017/1/11.
 */
(function () {
    'use strict';
    angular.module('dposApp', [
        'ui.router',
        'oc.lazyLoad',
        'ngSanitize',
        'hd.authPermission',
        'hd.ui',
        'hd.tab'
        // 'hd.page'
        // 'hd.loading'
    ])
        .controller('myCtrl', myCtrlFuc)
        .config(routerConfig);
    function myCtrlFuc($scope, $rootScope, $compile, $window, hdAuthPermissionService, AUTH_EVENTS) {

        //集成认证权限
        var userProfile = window.top.sessionStorage.getItem("user");
        if (userProfile) {
            userProfile = JSON.parse(userProfile);
            hdAuthPermissionService.auth(userProfile);
            $rootScope.user = userProfile;


            var userPermissionList = window.top.sessionStorage.getItem("permissions");
            if (userPermissionList) {
                userPermissionList = JSON.parse(userPermissionList);
            } else {
                userPermissionList = [];
            }
            hdAuthPermissionService.setPermissions(userPermissionList);
        }
        $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
            alert("未授权");
        });
        $rootScope.$on(AUTH_EVENTS.noPermission, function () {
            alert("没有权限");
        });


        $rootScope.compile = function (content) {
            $compile(content)($scope);
        };

        $rootScope.push = function (cfg) {
            Ext.getCmp('mainContent').fireEvent('push', cfg);
        };

        $rootScope.replace = function (cfg) {
            Ext.getCmp('mainContent').fireEvent('replace', cfg);
        };

        $rootScope.onScrollEvent = function (root, header, body, footer) {
            $('#dpos-angular-component').scroll(function () {
                var mainTop = root.offset().top,
                    headerTop = header.offset().top,
                    bodyTop = body.offset().top;
                if (headerTop < mainTop) {
                    header.css({
                        'position': 'fixed',
                        'top': mainTop + 'px',
                        'width': header.width() + 'px'
                    });
                    header.parent().css('padding-top', header.height() + 'px');
                }
                if (bodyTop > headerTop + header.height()) {
                    header.css({
                        'position': 'inherit'
                    });
                    header.parent().css('padding-top', '0');
                }
            });

            $rootScope.$on('dpos-angular-component-resize', function (e, width) {
                header.css('width', body.width() + 'px');
                footer.css('width', body.width() + 'px');
            })
        };
    }

    /* 路由中，js css 等文件可能放在外部地址*/
    var dir = 'angular';  // 正式环境
    if (window.location.href.toLocaleLowerCase().indexOf('://localhost') != -1) {//本地测试
        dir = '.';
    }

    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
        /* loading页面, 作为Exjs调用Angular的初始页面 */
            .state('loading', {
                url: '/start=Dpos.view.loading&factoryMethod=loading',
                templateUrl: dir + '/views/loading/loading.html'
            })

            /* 工具自动生成：盘点管理checkBillList */
            .state('checkBillList', {
                url: '/start=Dpos.view.checkbill.CheckBillEntry&factoryMethod=list',
                templateUrl: dir + '/views/checkBill/checkBillList.html',
                controller: 'checkBillList.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'checkBillList',
                            files: [
                                dir + '/js/checkBill/checkBillList.controller.js'
                            ]
                        })
                    }]
                }
            })
            /* 工具自动生成：盘点管理checkBillDtl */
            .state('checkBillDtl', {
                url: '/checkBillDtl/{id}',
                templateUrl: dir + '/views/checkBill/checkBillDtl.html',
                controller: 'checkBillDtl.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'checkBillDtl',
                            files: [
                                dir + '/js/checkBill/checkBillDtl.controller.js'
                            ]
                        })
                    }]
                }
            })


            /* 工具自动生成：盘点管理checkBillUpload */
            .state('checkBillUpload', {
                url: '/checkBillUpload',
                templateUrl: dir + '/views/checkBill/checkBillUpload.html',
                controller: 'checkBillUpload.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'checkBillUpload',
                            files: [
                                dir + '/js/checkBill/checkBillUpload.controller.js'
                            ]
                        })
                    }]
                }
            })


            /* 工具自动生成：盘点管理checkBillImport */
            .state('checkBillImport', {
                url: '/checkBillImport',
                templateUrl: dir + '/views/checkBill/checkBillImport.html',
                controller: 'checkBillImport.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'checkBillImport',
                            files: [
                                dir + '/js/checkBill/checkBillImport.controller.js'
                            ]
                        })
                    }]
                }
            })
            //库存调整记录查询
            .state('inv', {
                url: '/navigationType={type}&start=Dpos.view.inv.InvAdjEntry&factoryMethod=list',
                templateUrl: dir + '/views/inv/invList.html',
                controller: 'invList.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'invList',
                            files: [
                                dir + '/js/inv/invList.controller.js'
                            ]
                        })
                    }]
                }
            })
          //库存调整记录报表
          .state('invReport', {
            url: '/navigationType={type}&start=Dpos.view.report.ReportEntry&factoryMethod=invAdjList',
            templateUrl: dir + '/views/inv/invList.html',
            controller: 'invList.Controller',
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name: 'invList',
                  files: [
                    dir + '/js/inv/invList.controller.js'
                  ]
                })
              }]
            }
          })

            //dsj DPOS-4728 导入云平台商品
            .state('platSkuImport', {
                url: '/platSkuImport',
                templateUrl: dir + '/views/checkBill/platSkuImport.html',
                controller: 'platSkuImport.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'platSkuImport',
                            files: [
                                dir + '/js/checkBill/platSkuImport.controller.js'
                            ]
                        })
                    }]
                }
            })

            /* 工具自动生成：收银缴款employeePayDeliveryList */
            .state('employeePayDeliveryList', {
                url: '/start=Dpos.view.paydelivery.PayDeliveryEntry&factoryMethod=list',
                templateUrl: dir + '/views/employeePayDelivery/employeePayDeliveryList.html',
                controller: 'employeePayDeliveryList.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'employeePayDeliveryList',
                            files: [
                                dir + '/js/employeePayDelivery/employeePayDeliveryList.controller.js',
                                dir + '/js/employeePayDelivery/employeePayDelivery.filter.js',
                                dir + '/js/provider/printService.js'
                            ]
                        })
                    }]
                }
            })


            /* 工具自动生成：收银缴款employeePayDeliveryDtl */
            .state('employeePayDeliveryDtl', {
                url: '/employeePayDeliveryDtl/{uuid}',
                templateUrl: dir + '/views/employeePayDelivery/employeePayDeliveryDtl.html',
                controller: 'employeePayDeliveryDtl.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'employeePayDeliveryDtl',
                            files: [
                                dir + '/js/employeePayDelivery/employeePayDeliveryDtl.controller.js',
                                dir + '/js/employeePayDelivery/employeePayDelivery.filter.js'
                            ]
                        })
                    }]
                }
            })


            /* 工具自动生成：收银缴款employeePayDeliveryMod */
            .state('employeePayDeliveryMod', {
                url: '/employeePayDeliveryMod/{uuid}',
                templateUrl: dir + '/views/employeePayDelivery/employeePayDeliveryMod.html',
                controller: 'employeePayDeliveryMod.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'employeePayDeliveryMod',
                            files: [
                                dir + '/js/employeePayDelivery/employeePayDeliveryMod.controller.js',
                                dir + '/js/employeePayDelivery/employeePayDelivery.filter.js'
                            ]
                        })
                    }]
                }
            })
            /* 工具自动生成：标签统计报表rptTagAnalysis */
            .state('rptTagAnalysis', {
                url: '/navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=saleSkuTag',
                templateUrl: dir + '/views/report/rptTagAnalysis.html',
                controller: 'rptTagAnalysis.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'rptTagAnalysis',
                            files: [
                                dir + '/js/report/rptTagAnalysis.controller.js'
                            ]
                        })
                    }]
                }
            })
            /* 工具自动生成：时段统计报表rptPeriodAnalysis */
            .state('rptPeriodAnalysis', {
                url: '/navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=saleHourPeriod',
                templateUrl: dir + '/views/report/rptPeriodAnalysis.html',
                controller: 'rptPeriodAnalysis.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'rptPeriodAnalysis',
                            files: [
                                dir + '/js/report/rptPeriodAnalysis.controller.js'
                            ]
                        })
                    }]
                }
            })
            /* 工具自动生成：单品商品销售报表rptSkuAnalysis */
            .state('rptSkuAnalysis', {
                url: '/navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=saleSku',
                templateUrl: dir + '/views/report/rptSkuAnalysis.html',
                controller: 'rptSkuAnalysis.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'rptSkuAnalysis',
                            files: [
                                dir + '/js/report/rptSkuAnalysis.controller.js'
                            ]
                        })
                    }]
                }
            })
            /* 工具自动生成：报表rptBusinessAnalysis */
            .state('rptBusinessAnalysis', {
                url: '/navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=operationAnalysis',
                templateUrl: dir + '/views/report/rptBusinessAnalysis.html',
                controller: 'rptBusinessAnalysis.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'rptBusinessAnalysis',
                            files: [
                                dir + '/libs/echarts.min.js',
                                dir + '/js/report/rptBusinessAnalysis.controller.js'
                            ]
                        })
                    }]
                }
            })
            //商铺修改记录
            .state('goodsModifyRecord', {
                url: '/navigationType=push&start=Dpos.view.report.ReportEntry&factoryMethod=goodsModifyRecord',
                templateUrl: dir + '/views/report/goodsModifyRecord.html',
                controller: 'goodsModifyRecord.Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'goodsModifyRecord',
                            files: [
                                dir + '/js/report/goodsModifyRecord.controller.js'
                            ]
                        })
                    }]
                }
            })
            //新销售-新建
            .state('saleAdd', {
                url: '/saleAdd',
                templateUrl: dir + '/views/sale/saleAdd.html',
                controller: 'saleAdd.Controller',
                resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      name: 'saleAdd',
                      files: [
                        dir + '/js/sale/saleAdd.controller.js'
                      ]
                    })
                  }]
                }
              })
            //新销售-新建二级
              .state('saleAdd.saleAddTop', {
                url: '/saleAddTop',
                views: {
                  "saleAddTopView": {//顶栏
                    templateUrl:dir + '/views/sale/saleData/saleAdd-top.html',
                    controller: 'saleAddTop.Controller'
                  },
                  "saleAddPendingView": {//挂单
                    templateUrl: dir + '/views/sale/saleData/saleAdd-pending.html',
                    controller: 'saleAddPending.Controller'
                  },
                  "saleAddSkuView": {//录入
                    templateUrl:  dir + '/views/sale/saleData/saleAdd-sku.html',
                    controller: 'saleAddSku.Controller'
                  },
                  "saleAddFavoriteView": {//收藏夹
                    templateUrl: dir +'/views/sale/saleData/saleAdd-favorite.html',
                    controller: 'saleAddFavorite.Controller'
                  },
                  "saleAddFavoriteModView": {//收藏夹编辑
                    templateUrl: dir +'/views/sale/saleData/saleAdd-favoriteMod.html',
                    controller: 'saleAddFavoriteMod.Controller'
                  },
                  "saleAddMemberView": {//会员
                    templateUrl: dir +'/views/sale/saleData/saleAdd-member.html',
                    controller: 'saleAddMember.Controller'
                  },
                  "saleAddPayView": {//支付
                    templateUrl: dir +'/views/sale/saleData/saleAdd-pay.html',
                    controller: 'saleAddPay.Controller'
                  }
                },
                data: {
                  isLogin: false
                },
                resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      files: [
                        dir + '/js/sale/saleData/saleAdd-top.controller.js',
                        dir + '/js/sale/saleData/saleAdd-pending.controller.js',
                        dir + '/js/sale/saleData/saleAdd-sku.controller.js',
                        dir + '/js/sale/saleData/saleAdd-favorite.controller.js',
                        dir + '/js/sale/saleData/saleAdd-favoriteMod.controller.js',
                        dir + '/js/sale/saleData/saleAdd-member.controller.js',
                        dir + '/js/sale/saleData/saleAdd-pay.controller.js'
                      ]
                    })
                  }]
                }
              })
              //新销售-列表
              .state('saleList', {
                  url: '/saleList',
                  templateUrl: dir + '/views/sale/saleList.html',
                  controller: 'saleList.Controller',
                  resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                        name: 'saleList',
                        files: [
                          dir + '/js/sale/saleList.controller.js'
                        ]
                      })
                    }]
                  }
                })
                //新销售-详情
              .state('saleDtl', {
                  url: '/saleDtl/{id}/{posNo}',
                  templateUrl: dir + '/views/sale/saleDtl.html',
                  controller: 'saleDtl.Controller',
                  resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                        name: 'saleDtl',
                        files: [
                          dir + '/js/sale/saleDtl.controller.js',
                          dir + '/js/provider/printService.js'
                        ]
                      })
                    }]
                  }
                });
        //$urlRouterProvider.otherwise('/checkBillList');//默认跳转
    }
})();