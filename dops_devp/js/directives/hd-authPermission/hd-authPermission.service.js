/**
 * Created by songjian on 2017/3/17.
 */

angular.module('hd.authPermission',[])
    .config(["$httpProvider",function($httpProvider){
        $httpProvider.interceptors.push('httpInterceptor');
    }])
    .factory('httpInterceptor', ['$q','hdAuthPermissionService','$rootScope','AUTH_EVENTS', function ($q,hdAuthPermissionService,$rootScope,AUTH_EVENTS) {
        var httpInterceptor = {
            'responseError': function (response) {
                if (response.status == 401) {
                    hdAuthPermissionService.unAuth();
                    //var url = location.href.split("#")[0];
                    //location.href = url;
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    return $q.reject(response);
                } else if (response.status == 403) {
                    $rootScope.$broadcast(AUTH_EVENTS.noPermission);
                    //hdTip.tip("您没有权限,请联系管理员","error");
                    return $q.reject(response);
                } else if(response.status == 500){
                    //hdTip.tip("服务器出错，请联系管理员","error");
                    return $q.reject(response);
                }
            }
        };
        return httpInterceptor;
    }])
    .directive('hasPermission', ['hdAuthPermissionService', function (angularPermission) {
        return {
            link: function (scope, element, attrs) {
                if (!angular.isString(attrs.hasPermission))
                    throw "hasPermission value must be a string, 你懂了吗亲?";
                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value[0] === '!';
                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission() {
                    var hasPermission = angularPermission.hasPermission(value);
                    if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                        //element.show();
                    } else {
                        element.remove();
                    }
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    //权限服务

/**
 * 权限列表数据格式
 [
 {"path":"/基础资料/付款方式"
 "authActions":["查看","编辑"]}
 ]
 */

    .factory('hdAuthPermissionService', ['$rootScope', 'AUTH_EVENTS', '$window', function ($rootScope, AUTH_EVENTS, $window) {
        return {
            getPermissions:function (){
                var userPermissionList = $window.localStorage.getItem("userPermissions");
                if (userPermissionList) {
                    userPermissionList = JSON.parse(userPermissionList);
                }else{
                    userPermissionList = [];
                }
                return userPermissionList;
            },
            setPermissions: function (permissions) {
                $window.localStorage.setItem("userPermissions", JSON.stringify(permissions));
                $rootScope.$broadcast('permissionsChanged');
            },
            //判断是否有单个权限
            hasPermission: function (permission) {
                var userPermissionList =this.getPermissions();
                for (var i = 0; i < userPermissionList.length; i++) {
                    if (userPermissionList[i] === permission) {
                        return true;
                    }
                }
                return false;
            },
            //判断是否同时拥有权限列表
            hasPermissions: function (permissions) {
                for (var i = 0; i < permissions.length; i++) {
                    if (!this.hasPermission(permissions[i])) {
                        return false;
                    }
                }
                return true;
            },
            //判断是否拥有权限列表之一
            hasOrPermissions: function (permissions) {
                for (var i = 0; i < permissions.length; i++) {
                    if (this.hasPermission(permissions[i])) {
                        return true;
                    }
                }
                return false;
            },
            //授权认证
            auth: function (data) {
                $window.localStorage.setItem("user", JSON.stringify(data));
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            },
            //取消授权认证
            unAuth: function () {
                $window.localStorage.clear();
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            },
            //判断是否认证
            isAuthorized: function () {
                return !!$window.localStorage.getItem("user");
            }
        };
    }])
    //认证服务
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        logoutSuccess: 'auth-logout-success',
        notAuthorized: 'auth-not-authorized',
        noPermission: 'no-permission',
        permissionChange:'permission-change'
    });

