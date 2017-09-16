/**
 * Created by songjian on 2017/6/3.
 * 必须在 hd.ui.js  后面引用
 * @desc 对hd.ui中 hdUtils的扩展
 */
if (!window.hdUtils) {
  window.hdUtils = {}
}
window.hdUtils.date = {
  //获取本周第一天
  getWeekStartDate: function () {
    var date = new Date();
    date.setDate(date.getDate() - date.getDay() + 1);
    return window.hdUtils.date.format(date, 'yyyy-MM-dd');
  },
  //获取当前日期的前多少天
  getOtherDate: function (number) {
    var date = new Date(new Date() - 24 * 60 * 60 * 1000 * number);
    return window.hdUtils.date.format(date, 'yyyy-MM-dd');
  },
  //获取当月的第一天 最近三个月 getMonthStartDate(2)
  getMonthStartDate: function (number) {
    if (!number) {
      number = 0;
    }
    var date = new Date();
    return window.hdUtils.date.format(new Date(date.getFullYear(), date.getMonth() - number, 1), 'yyyy-MM-dd');
  },
  //fomart
  format: function (date, fmt) {
    var o = {
      "M+": date.getMonth() + 1,                 //月份
      "d+": date.getDate(),                    //日
      "h+": date.getHours(),                   //小时
      "m+": date.getMinutes(),                 //分
      "s+": date.getSeconds(),                 //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
};

window.hdUtils.string = {
  format: function () {
    if (arguments.length == 0)
      return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
      str = str.replace(re, arguments[i]);
    }
    return str;
  },
  htmlEncode: function (s) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(s));
    return div.innerHTML;
  },
  htmlDecode: function (s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    return div.innerText || div.textContent;
  }
};

//埋点
window.Logger = {
  bury: function (jsonBury) {
    if (window.top.lionApi && window.top.lionApi.logger) {
      if (jsonBury) {
        if (jsonBury.machine_id) {
          //等老大改了lionApi后，則可以去除try
          try{
            jsonBury.machine_id = window.top.lionApi.getMachineCode();
          }catch(e){
          }
        }

        if (jsonBury.machine_store_id) {
          jsonBury.machine_store_id = window.top.lionApi.getBindShop().id;
        }

        if (jsonBury.store_id) {
          jsonBury.store_id = window.top.lionApi.getLionSession("shop").id;
        }

        if (jsonBury.user_id) {
          jsonBury.user_id = window.top.lionApi.getLionSession("user").id;
        }

        if (jsonBury.phone_number) {
          jsonBury.phone_number = window.top.lionApi.getLionSession("user").mobile;
        }
        window.top.lionApi.logger('dpos', 'bury', jsonBury);
      }
    }
  }
};