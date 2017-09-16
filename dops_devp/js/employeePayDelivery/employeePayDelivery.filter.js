/**
 * Created by songjian on 2017/6/9.
 */
(function () {
  'use strict';
  angular.module('dposApp')
    //取和
    .filter('sumOfItems', function () {
      return function (data, key) {
        if (typeof(data) === "undefined" || typeof(key) === "undefined") {
          return 0;
        }
        var sum = 0,
          i = data.length - 1;

        for (; i >= 0; i--) {
          if (data[i][key]) {
            sum += parseFloat(data[i][key]);
          }
        }
        return sum;
      };
    })
    //时间格式化
    .filter('dateFormat', function myDateFormat($filter) {
      return function (text) {
        if (!text) {
          return "";
        }
        var tempdate = new Date(text.replace(/-/g, "/"));
        return $filter('date')(tempdate, "yyyy-MM-dd");
      }
    })
    //状态
    .filter('status', function ($sce) {
      return function (inputStr, type) {
        var out = "";
        if (inputStr == null) {
          out = "-";
        } else if (inputStr == "待签字") {
          if (type == "small") {
            out = "<span hdPill_s='undo'>待签字</span>";
          } else {
            out = "<span hdPill='undo'>待签字</span>";
          }
        } else if (inputStr == "待处理") {
          if (type == "small") {
            out = "<span hdPill_s='undo'>待处理</span>";
          } else {
            out = "<span hdPill='undo'>待处理</span>";
          }
        }
        else if (inputStr == "已处理") {
          if (type == "small") {
            out = "<span hdPill_s='done'>已处理</span>";
          } else {
            out = "<span hdPill='done'>已处理</span>";
          }
        } else if (inputStr == "已作废") {
          if (type == "small") {
            out = "<span hdPill_s='invalid'>已作废</span>";
          } else {
            out = "<span hdPill='invalid'>已作废</span>";
          }
        }
        return $sce.trustAsHtml(out);
      };
    });
})();

