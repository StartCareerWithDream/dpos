/**
 * Created by ckj on 2017/2/24.
 */
(function () {
  'use strict';
  angular.module('dposApp')
  // .constant('baseUrl',obj.url.baseUrl)

    .provider('webService', function () {
      /**
       * 变量定义
       * @type {{url: {testUrl: string, branchUrl: string, runUrl: string, baseUrl: string}, part: {urlPart1: string, urlPart2: string}, switch: string}}
       */
      var obj = {
        "url": {
          testUrl: 'https://s02c-test.qianfan123.com/dpos-web/s',//测试
          branchUrl: '/dpos-web/s',//分支
          runUrl: '/dpos-web/s',//部署
          baseUrl: '/dpos-web/s'
        },
        "part": {
          urlPart1: '',
          urlPart2: ''
        },
        "switch": "real" //开关 'real' 代表服务数据,'mock'代表假数据
      };


      // 如果 当前网址中有 localhost 时，为开发环境，需要调用测试服务器地址
      if (window.location.href.toLocaleLowerCase().indexOf('://localhost') != -1) {//测试
        obj.url.baseUrl = obj.url.testUrl;
      }

      //根据开关处理相关的urlPart1和urlPart2路径
      switch (obj.switch) {
        case 'real' :

          obj.part.urlPart1 = obj.url.baseUrl;
          obj.part.urlPart2 = '?_dc=' + new Date().getTime();

          break;
        case 'mock' :
          obj.part.urlPart1 = 'json/';
          obj.part.urlPart2 = '.json';
          break;
      }

      /**
       * provider定义
       * @param $http
       * @returns {{commonProvide: service.commonProvide, attachProvide: service.attachProvide}}
       */
      this.$get = function ($http) {
        var service = {


          /**
           * 通用非文件请求方法
           * @param sApiName url路径
           * @param sMethod 请求方法
           * @param inJson 放在body中的对象
           * @param inUrlParam  拼接在url后的参数(也是一个对象)
           * @returns {*}
           */


          commonProvide: function (sApiName, sMethod, inJson, inUrlParam) {
            //得到门店信息
            var shopInfo = '';
            shopInfo = JSON.parse(window.top.sessionStorage.getItem('shop'));

            if (obj.switch == 'mock' && sApiName.indexOf('/') != -1) {//有'.'
              sApiName = sApiName.replace(/\//g, '_');
            }
            else {
              sApiName = sApiName.replace(/{shop}/g, shopInfo.id);
            }
            return $http({
              url: obj.part.urlPart1 + sApiName,
              method: sMethod,
              params: inUrlParam,
              data: inJson,
              headers: {'trace_id': JSON.parse(window.top.sessionStorage.getItem("user")).id + "_" + new Date().getTime()}
            })
          },

          /**
           * 通用文件请求
           * @param sApiName url路径
           * @param sMethod 请求方法
           * @param inJson 放在body中的对象
           * @param inUrlParam 拼接在url后的参数(也是一个对象)
           * @param contentType 32位随机数
           * @returns {*}
           */
          attachProvide: function (sApiName, sMethod, inJson, inUrlParam, contentType) {
            //得到门店信息
            var shopInfo = '';
            shopInfo = JSON.parse(window.top.sessionStorage.getItem('shop'));

            if (obj.switch == 'mock' && sApiName.indexOf('/') != -1) {//有'.'
              sApiName = sApiName.replace(/\//g, '_');
            }
            else {
              sApiName = sApiName.replace(/{shop}/g, shopInfo.id);
            }
            return $http({
              url: obj.part.urlPart1 + sApiName + obj.part.urlPart2,
              method: sMethod,
              params: inUrlParam,
              data: inJson,
              headers: {
                'trace_id': JSON.parse(window.top.sessionStorage.getItem("user")).id + "_" + new Date().getTime(),
                'Content-Type':typeof(inJson)=='string'?'application/x-www-form-urlencoded; charset=UTF-8':undefined,
                //'Content-Type': undefined,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': '*/*',
              }
            })
          },
          getBaseUrl:function () {
            return obj.url.baseUrl
          }
        };
        return service;
      }
    })
})();