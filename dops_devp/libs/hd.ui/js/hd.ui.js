/**
 * Created by songjian on 2017/3/7.
 * hd.core
 */
(function () {
    angular.module('hd.ui', [
        'hd.radio',
        'hd.checkbox',
        'hd.switch',
        'hd.tip',
        'hd.dateInput',
        'hd.searchInput',
        'hd.loading',
        'hd.dialog',
        'hd.page',
        'hd.autoFocus'
        //'hd.selectCheckbox',
        //'hd.verticalMenu',
        //'hd.authPermission',
        //'hd.repeatFinished',
        //'hd.dropdown',
        //'hd.validates',
        //'hd.jmSelectSearchable',
        //'hd.tab'
    ]);
})();
/**
 * Created by songjian on 2017/3/22.
 * @desc  工具
 */
window.hdUtils={
  //生成随机字符串 , 如果带第二个参数: 是否仅数字,默认false
  randomToString32:function(len){
    len = len || 32;
    var $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    if (arguments[1] != undefined && arguments[1] == true) {
      $chars = '0123456789';
    }
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
    }
    return pwd;
  },
  //生成uuid
  getUuid:function(){
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  //得到url参数
  getQueryString: function(name)
  {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  },
  //验证身份证号码 , 当返回值不为空字符串, 则是有错误.
  idCardValid: function(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
      tip = "身份证号格式错误";
      pass = false;
    }

    else if(!city[code.substr(0,2)]){
      tip = "身份证号地址编码错误";
      pass = false;
    }
    else{
      //18位身份证需要验证最后一位校验位
      if(code.length == 18){
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        //校验位
        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++)
        {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if(parity[sum % 11] != code[17]){
          tip = "身份证号校验位错误";
          pass =false;
        }
      }
    }
    // if(!pass) alert(tip);
    return tip;
  },

  digitChk : function(obj){
    // 0 是 48; 9 是 57; 小数点46;减号 45
    var rtnDigit = (event.keyCode >= 48 && event.keyCode <= 57);  //数字判断
    var rtnPoint = (event.keyCode == 46);  //小数点
    var rtnMinus = (event.keyCode == 45);  //负数

    // 默认只判断数字
    var rtn = rtnDigit;

    // 如需要小数
    if (parseFloat(obj.getAttribute('hdFix')) > 0) {
      rtn = rtn || rtnPoint;
    }

    // 如支持负数
    if (parseFloat(obj.getAttribute('hdMin')) < 0) {
      rtn = rtn || rtnMinus;
    }

    return rtn;
  },

  digitLmt : function(obj){
    //parseFloat(obj.value) == Nan
    if(obj.value==''){
      return;
    }
    //数值合法性
    var rtnDigit = !isNaN(obj.value);
    if (!rtnDigit) {
      obj.value = '';
      return false;
    }

    //最大最小值限制
    if (parseFloat(obj.value) > parseFloat(obj.getAttribute('hdMax'))) {
      obj.value=parseFloat(obj.getAttribute('hdMax'));
    }
    if (parseFloat(obj.value) < parseFloat(obj.getAttribute('hdMin'))) {
      obj.value=parseFloat(obj.getAttribute('hdMin'));
    }

    // 小数位限制
    obj.value=parseFloat(obj.value).toFixed(parseFloat(obj.getAttribute('hdFix')));
  }
};
/**
 * Created by songjian on 2017/3/10.
 * @desc 提示控件
 * 支持 多次提示
 */

(function () {
  angular.module('hd.tip', [])
    .provider('hdTip', hdTipProvider);


  function hdTipProvider() {
    var self = this;

    self.timeout = 2000;
    self.setDefaultTimeout = function (defaultTimeout) {
      self.timeout = defaultTimeout;
    };

    self.$get = ['$timeout', function ($timeout) {
      var cancelTimeout = null;

      return {
        tip: tip
      };

      /**
       * set msg
       * default last 2s
       * @param msg
       * @param type
       */
      function tip(msg, type, msg1,callback) {
        var that = this;
        var id = "hdTip-" + hdUtils.getUuid();

        var html = '<div class="modal-tips" id=' + id + ' style="display: block;position: relative;margin-bottom: 10px;"><div class="image-tip">';
        if (type == "success") {
          html = html + '<i class="iconfont icon-chenggong i-success"></i>';
        } else if (type == "error") {
          html = html + '<i class="iconfont icon-guanbi i-error" ng-show="ngTip.type==\'error\'"></i>';
        } else if (type == "warn") {
          html = html + ' <i class="iconfont icon-jinggao i-warn" ng-show="ngTip.type==\'warn\'"></i>';
        } else if (type == "info") {
          html = html + ' <i class="iconfont icon-xiaoxitixing i-info" ng-show="ngTip.type==\'info\'"></i>';
        }
        html = html + '  </div><table class="text-tip"><tr><td>';
        if (type == "success") {
          html = html + ' <div><label class="i-success">' + msg + '</label><span>' + (msg1?msg1:'') + '</span></div>';
        } else if (type == "error") {
          html = html + ' <div><label class="i-error">' + msg + '</label><span>' + (msg1?msg1:'') + '</span></div>';
        } else if (type == "warn") {
          html = html + ' <div><label class="i-warn">' + msg + '</label><span>' + (msg1?msg1:'') + '</span></div>';
        } else if (type == "info") {
          html = html + ' <div><label class="i-info">' + msg + '</label><span>' + (msg1?msg1:'') + '</span></div>';
        }
        html = html + '</td></tr></table></div>';

        $("body").append(html);

        cancelTimeout = $timeout(function () {
          $("#"+id).remove();
        }, self.timeout);
      }
    }];
  }
})();
/**
 * Created by songjian on 2017/3/10.
 * @操作提示框控件
 */
(function () {
  //初始化全局dialog
  var hdDialog = document.createElement('hd-dialog');
  hdDialog.id = "commonHdDialog";
  document.body.appendChild(hdDialog);

  var hdPatch = document.createElement('hd-patch');
  document.body.appendChild(hdPatch);

  var patchInfoDialog = document.createElement('hd-dialog');
  patchInfoDialog.style.zIndex = 1001;
  patchInfoDialog.id = "patchInfoDialog";
  document.body.appendChild(patchInfoDialog);

  angular.module('hd.dialog', [])
    .directive('hdDialog', hdDialogDirective)
    .directive('hdDialogClose', hdDialogCloseDirective)
    .factory('hdDialog', hdDialogProvider)
    .directive('hdPatch', hdPatchDirective)
    .service('hdPatch', hdPatchProvider)
    .directive('hdImage', hdImageDirective);

  function hdDialogCloseDirective() {
    return {
      restrict: 'A',
      template: "",
      replace: true,
      require: ["^hdDialog"],
      transclude: false,
      link: function (scope, element, attrs, ctrls) {
        element.click(function () {
          ctrls[0].hide();
        });
      }
    }
  }

  hdDialogDirective.$inject = ['hdDialog'];
  function hdDialogDirective(provider) {
    return {
      restrict: 'E',
      template:'<div class="dialog hd-dialog" ng-class="{\'dialog--open\':provider.isOpen}"><div class="dialog__overlay"></div><div class="dialog__content" style="top:0;left:0"><div class="dialog-custom-content"><div class="hd-dialog-title" ng-show="provider.dialogTitle.length">{{provider.dialogTitle?provider.dialogTitle:dialogTitle}}</div><div class="hd-dialog-close" ng-click="cancle()"><i class="iconfont icon-fou"></i></div><div class="hd-dialog-content hd-dialog-content-default"><table width="100%"><tr><td><div>{{provider.dialogMsg?provider.dialogMsg:dialogMsg}}</div><div style="font-size: 13px;margin-top: 12px;">{{provider.dialogMsg2?provider.dialogMsg2:dialogMsg2}}</div></td></tr></table></div><div class="hd-dialog-button"><span ng-repeat="x in provider.buttons"><button ng-if="x.type==\'submit\'" btnMain="m1" ng-click="typeClick(x.type)" hd-auto-focus="{{x.focus}}">{{x.text}}</button> <button ng-if="x.type==\'close\'" btnMain="m3" ng-click="typeClick(x.type)" hd-auto-focus="{{x.focus}}">{{x.text}}</button></span></div></div><div ng-transclude class="tab-ng-transclude"></div></div></div>',
      replace: true,
      transclude: true,
      scope: {
        dialogTitle: "@",
        dialogMsg: "@",
        dialogSubmit: "&"
      },
      controller: ["$scope", function (scope) {
        this.hide = function () {
          scope.cancle();
          scope.$apply();
        }
      }],
      link: function (scope, element, attrs) {

        var transcludedBlock = element.find('.tab-ng-transclude');
        if (transcludedBlock.children().length == 0) {
          element.find('.dialog-custom-content').show();
        } else {
          element.find('.dialog-custom-content').remove();
        }
        var id = attrs["id"];
        if (!id) {
          id = "hdDialog-" + hdUtils.getUuid();
          element.attr("id", id);
        }
        scope.submit = function () {
          provider.submit(id);
          if (scope.dialogSubmit) {
            scope.dialogSubmit();
          }
        };
        scope.cancle = function () {
          provider.hide(id);
        };

        scope.typeClick = function (type) {
          if (type == "submit") {
            scope.submit();
          }
          if (type == "close") {
            scope.cancle();
          }
        };
        scope.provider = provider.register(id);
        if (attrs.show) {
          scope.provider.isOpen = true;
          //scope.$apply();
        }
      }
    }
  }

  function hdDialogProvider() {
    var dialogStack = [];
    var map = {};
    var initDialog = function (id) {
      if (map[id] == null) {
        map[id] = {};
      }
      map[id].dialogType = "";
      map[id].dialogTitle = "";
      map[id].dialogMsg = "";
      map[id].dialogMsg2 = "";
      map[id].submitCallback = null;
      map[id].closeCallback = null;
      map[id].buttons = [];
      map[id].isOpen = false;

      return map[id];
    };

    var show = function (id, params) {
      if (id == null) {
        id = "commonHdDialog";
      }

      if ($("#" + id).length > 0) {
        if (!map[id]) {
          throw "hd-dialog:  unregister  id=" + id + "   !!! ";
        }
        map[id].dialogType = "hd-dialog-default";
        if (params) {
          if (params.dialogType) {
            map[id].dialogType = params.dialogType;
          }
          map[id].dialogTitle = params.dialogTitle;
          map[id].dialogMsg = params.dialogMsg;
          map[id].dialogMsg2 = params.dialogMsg2;
          map[id].submitCallback = params.submitCallback;
          map[id].closeCallback = params.closeCallback;
          if (params.buttons) {
            map[id].buttons = params.buttons;
          } else {
            map[id].buttons = [{"text": "确认", "type": "submit",focus:true}, {"text": "取消", "type": "close"}]
          }
        }
        $("#" + id).show();
        map[id].isOpen = true;
        $(".ui-view-content").css("z-index", "100");
        dialogStack.push(id);

        //支持拖拽
        $("#" + id + " .hd-dialog-title").each(function (index, value) {
          new Mover($(this)[0]);
        });
      } else {
        throw "hd-dialog:  document  not found  id=" + id + " element";
      }
    };
    var hide = function (id) {
      if (!id) {
        id = "commonHdDialog";
      }
      $(".ui-view-content").css("z-index", "0");
      map[id] && map[id].closeCallback && map[id].closeCallback()
      initDialog(id);
      //还原移动
      $("#" + id + " .dialog__content").css("top", 0).css("left", 0);
      $("#" + id).hide();
      dialogStack.pop();
    };
    var submit = function (id) {
      if (map[id].submitCallback) {
        map[id].submitCallback();
      }
    };
    var hideAll = function () {
      for (var i in map) {
        hide(i);
      }
    };

    //绑定esc事件，
    $(document).keyup(function (event) {
      switch (event.keyCode) {
        case 27:
          if (dialogStack.length > 0 && dialogStack[dialogStack.length - 1]) {
            hide(dialogStack[dialogStack.length - 1]);
          }
      }
    });

    return {
      show: show,
      hide: hide,
      hideAll: hideAll,
      submit: submit,
      register: initDialog
    };
  }

  hdPatchDirective.$inject = ['hdPatch', '$timeout', 'hdDialog'];
  function hdPatchDirective(provider, $timeout, hdDialog) {
    return {
      restrict: 'E',
      template:'<div class="dialog patch-dialog hd-dialog hd-dialog-patch" ng-class="{\'dialog--open\':provider.isOpen}" style="z-index: 1001"><div class="dialog__overlay"></div><div class="dialog__content" style="top:0;left:0"><div class="hd-dialog-title" ng-show="provider.dialogTitle.length">{{provider.dialogTitle?provider.dialogTitle:dialogTitle}}</div><div class="hd-dialog-content"><div class="hd-patch-title">批量提交进度：{{provider.requestTotal}}/{{provider.allTotal}}</div><div class="hd-progress"><div class="hd-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" ng-style="{width:(provider.progress+\'%\')}"><span class="sr-only">{{provider.progress +\'%\'}}</span></div></div><div><span class="hd-patch-success-info"><i class="iconfont icon-chenggong"></i> 成功：<span class="hd-patch-success-info-number">{{provider.successTotal}}</span> 条</span> <span class="hd-patch-error-info"><i class="iconfont icon-guanbi"></i> 失败：<span class="hd-patch-error-info-number">{{provider.errorTotal}}</span> 条</span><div style="clear: both;"></div></div><div class="hd-patch-desc"><div ng-if="provider.data&&provider.errorParseParams" ng-repeat="item in provider.responses"><div ng-if="!item.data.success">{{provider.errorParseParams.name}}:<span>{{provider.data[$index][provider.errorParseParams.id]}}</span> 失败原因:<div ng-repeat="errorItem in item.data.message"><pre style="font-family: inherit;">{{errorItem}}</pre></div></div></div></div></div><div class="hd-dialog-button"><button ng-show="provider.status==0" btnMain="m1" ng-click="submit()">确定</button> <button ng-show="provider.status==3||provider.status==2" btnMain="m2" ng-click="finish()">关闭</button> <button ng-show="provider.status==1" btnMain="m3" ng-click="cancle()">取消提交</button></div></div></div>',
      scope: {
        dialogTitle: "@",
        dialogMsg: "@",
        dialogSubmit: "&"
      },
      link: function (scope, element) {
        scope.submit = function () {
          provider.submit();
          if (scope.dialogSubmit) {
            scope.dialogSubmit();
          }
        };
        scope.finish = function () {
          provider.hide();
        };
        scope.cancle = function () {
          provider.close();
          provider.status = 2;
          var isSubmit = false;
          hdDialog.show("patchInfoDialog", {
            dialogTitle: "提示",
            dialogMsg: "确认要取消提交？",
            dialogMsg2: "取消后，将不能再继续提交",
            closeCallback: function () {
              if (isSubmit) {
              } else {
                provider.open();
                provider.status = 1;
                provider.submit();
              }
            },
            submitCallback: function () {
              isSubmit = true;
              hdDialog.hide("patchInfoDialog");
              provider.open();
            }
          });

        };
        scope.provider = provider;

        scope.$watch('provider.isOpen', function (newValue) {
          if (newValue == true) {
            $timeout(function () {
              element.find("button").focus();
            });
          }
        });
      }
    }
  }

  function hdPatchProvider() {
    var self = this;
    self.dialog = null;
    self.dialogTitle = null;
    self.dialogMsg = null;
    self.requests = [];
    self.responses = [];
    self.successTotal = 0;
    self.errorTotal = 0;
    self.submitCallback = null;
    self.requestTotal = 0;
    self.progress = 0;
    self.status = null;//0=未开始，1=进行中， 2=终止 ，3=完成
    self.allTotal = 0;
    self.data = null;
    self.errorParseParams = null;
    self.isOpen = false;

    self.init = function () {
      self.successTotal = 0;
      self.errorTotal = 0;
      self.requestTotal = 0;
      self.requests = [];
      self.responses = [];
      self.dialogTitle = null;
      self.dialogMsg = null;
      self.submitCallback = null;
      self.progress = 0;
      self.status = 0;
      self.allTotal = 0;
      self.data = null;
      self.errorParseParams = null;
      self.isOpen = false;
    };

    self.show = function (id, params) {
      var s = $(".patch-dialog");
      if (s.length == 0) {
        throw "html require  hd-patch dom!!!!";
      }
      self.init();
      if (params) {
        if (params.dialogTitle) {
          self.dialogTitle = params.dialogTitle;
        } else {
          self.dialogTitle = "批量提交";
        }
        if (params.dialogMsg) {
          self.dialogMsg = params.dialogMsg;
        }
        if (params.requests) {
          self.requests = params.requests;
          self.allTotal = self.requests.length;
        } else {
          throw "hd-patch module  require  'requests' params!!!!!"
        }
        if (params.submitCallback) {
          self.submitCallback = params.submitCallback;
        }
        if (params.data) {
          self.data = params.data;
        }
        if (params.errorParseParams) {
          self.errorParseParams = params.errorParseParams;
        }
        if (params.closeCallback) {
          self.closeCallback = params.closeCallback;
        }
      }
      self.isOpen = true;
      $(".hd-dialog-patch .hd-dialog-title").each(function (index, value) {
        new Mover($(this)[0], $(this)[0].parentNode);
      });
    };

    self.hide = function () {
      self.isOpen = false;
      self.closeCallback && self.closeCallback();
      self.submitCallback && self.submitCallback();
      self.init();
      $(".hd-dialog-patch .dialog__content").css("top", 0).css("left", 0);
      self.closeCallback && self.closeCallback();
    };
    self.close = function () {
      self.isOpen = false;
    };
    self.open = function () {
      self.isOpen = true;
    };

    var doNextRequest = function (callback) {
      if (self.status == 2) {
        return;
      }
      var httpRequest = self.requests.shift();
      if (httpRequest) {
        httpRequest().then(function (resp) {
          self.requestTotal++;
          self.progress = window.Math.ceil(100 * self.requestTotal / self.allTotal);
          if (resp.data.success) {
            self.successTotal++;
          } else {
            self.errorTotal++;
          }
          self.responses.push(resp);
          doNextRequest(callback);
        });
      } else {
        self.status = 3;
        callback(self.responses)
      }
    };
    self.submit = function () {
      self.status = 1;
      if (self.submitCallback) {
        doNextRequest(self.submitCallback);
      } else {
        doNextRequest();
      }
    };
  }

  //图片
  function hdImageDirective() {
    return {
      restrict: 'E',
      template:'<div><div ng-repeat="i in images" style="display: inline-block;cursor: pointer;"><img ng-if="$index<=1" ng-click="browseImage($index)" width="50px" height="50px" style="border: 1px solid black;float: left;" ng-src="{{i.url}}"><div ng-click="browseImage($index+1)" ng-if="$index==1&&images.length>2" style="text-align:center; font-size: 12px;float:left; width: 50px;height: 50px;border: 1px solid black"><a>查看剩余{{images.length-2}}照片</a></div></div><div id="image-dialog" class="dialog image-dialog" ng-class="{\'dialog--open\':isOpen}"><div class="dialog__overlay" ng-click="hide()"></div><div class="dialog__content" style="background-color: transparent;padding: 0; width: auto;"><table style="background: transparent;"><tr><td><span ng-hide="currentIndex==0" ng-click="prevImage()" class="prevBtn" style="color: white;font-size: 40px;z-index: 1;cursor: pointer"><i class="iconfont icon-circleleft" style="font-size: 30px"></i></span></td><td style="position: relative;border: none;"><img style="width: 400px" ng-src="{{currentImage.url}}"><div style="position: absolute;color: white;top:10px;left: 10px;">{{currentImage.title}}</div><div style="position: absolute;color:white;bottom: 10px;left:10px" ng-bind="currentImage.desc"></div></td><td style="border: none;"><span ng-hide="currentIndex==images.length-1" ng-click="nextImage()" class="nextBtn" style="color: white;font-size: 40px;z-index: 1;cursor: pointer"><i class="iconfont icon-circleright" style="font-size: 30px"></i></span></td></tr></table></div></div></div>',
      replace: true,
      scope: {
        images: "="
      },
      link: function ($scope) {
        //对图片绑定点击事件
        $scope.currentImage = {};
        $scope.currentIndex = 0;
        $scope.browseImage = function (index) {
          $scope.isOpen = true;
          $scope.currentIndex = index;
          $scope.currentImage = $scope.images[$scope.currentIndex];
        };
        $scope.prevImage = function () {
          if ($scope.currentIndex > 0) {
            $scope.currentIndex = $scope.currentIndex - 1;
            $scope.currentImage = $scope.images[$scope.currentIndex];
          }
        };
        $scope.nextImage = function () {
          if ($scope.currentIndex < $scope.images.length) {
            $scope.currentIndex = $scope.currentIndex + 1;
            $scope.currentImage = $scope.images[$scope.currentIndex];
          }
        };
        $scope.hide = function () {
          $scope.isOpen = false;
        }
      }
    }
  }

  function Mover(title, parent) {
    this.obj = title;
    this.startx = 0;
    this.starty;
    this.startLeft;
    this.startTop;
    this.mainDiv = title.parentNode.parentNode;
    if (parent) {
      this.mainDiv = parent;
    }
    var that = this;
    this.isDown = false;
    this.movedown = function (e) {
      e = e ? e : window.event;
      if (!window.captureEvents) {
        this.setCapture();
      }  //事件捕获仅支持ie
//            函数功能：该函数在属于当前线程的指定窗口里设置鼠标捕获。一旦窗口捕获了鼠标，
//            所有鼠标输入都针对该窗口，无论光标是否在窗口的边界内。同一时刻只能有一个窗口捕获鼠标。
//            如果鼠标光标在另一个线程创建的窗口上，只有当鼠标键按下时系统才将鼠标输入指向指定的窗口。
//            非ie浏览器 需要在document上设置事件
      e.preventDefault();
      that.isDown = true;
      that.startx = e.clientX;
      that.starty = e.clientY;

      that.startLeft = parseInt(that.mainDiv.style.left);
      that.startTop = parseInt(that.mainDiv.style.top);
    };
    this.move = function (e) {
      e = e ? e : window.event;
      if (that.isDown && e.which > 0) {
        that.mainDiv.style.left = e.clientX - (that.startx - that.startLeft) + "px";
        that.mainDiv.style.top = e.clientY - (that.starty - that.startTop) + "px";
      }
    };
    this.moveup = function () {
      that.isDown = false;
      if (!window.captureEvents) {
        this.releaseCapture();
      } //事件捕获仅支持ie
    };
    this.obj.onmousedown = this.movedown;
    this.obj.onmousemove = this.move;
    this.obj.onmouseup = this.moveup;

    //非ie浏览器
    document.addEventListener("mousemove", this.move, true);
  }
})();
//支持可拖动

/**
 * Created by songjian on 2017/3/10.
 * @desc 全局的loading提示
 */
(function () {
    var hdLoading = document.createElement('hd-loading');
    document.body.appendChild(hdLoading);

    angular.module('hd.loading', [])
      .config(["$httpProvider",function ($httpProvider) {
          $httpProvider.interceptors.push('loadInterceptor');
      }]).factory('loadInterceptor', ['$q', '$rootScope', 'hdLoading','hdTip', function ($q, $rootScope, hdLoading,hdTip) {
          var httpInterceptor = {
              'responseError': function (response) {
                  hdLoading.hide();
                  if (response.status == 401) {
                      //var url = location.href.split("#")[0];
                      //location.href = url;
                      window.top.location.replace(window.top.location.origin+ window.top.location.pathname+window.top.location.search);
                      return $q.reject(response);
                  } else if (response.status == 403) {
                      hdTip.tip("您没有权限,请联系管理员","error");
                      return $q.reject(response);
                  } else if(response.status == 500){
                      hdTip.tip("服务器出错，请联系管理员","error");
                      return $q.reject(response);
                  }
                  return response;
              },
              'response': function (response) {
                  if(response.config.noLoading){
                  }else{
                      hdLoading.hide();
                  }
                  return response;
              },
              'request': function (request) {
                  if(request.noLoading){
                  }else{
                      hdLoading.show();
                  }

                  return request;
              }
          };
          return httpInterceptor;
      }])
      .directive('hdLoading', hdLoadingDirective)
      .service('hdLoading', hdLoadingService);


    hdLoadingDirective.$inject = ['hdLoading'];
    function hdLoadingDirective(provider) {
        return {
            restrict: 'AE',
            transclude: true,
            template:'<div ng-show="provider.isShow" style="z-index: 999;position: absolute"><div style="background: #FFF;opacity: 0;position: fixed;width: 100%;height: 100%;left: 0;top: 0;"></div><div style="position: fixed;left: 50%;top: 50%;text-align: center"><img style="width: 40px" src="data:image/gif;base64,R0lGODlhPAA8ALMIALa1tUBAQNHPzyEhIX9/f2JiYpuZmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxOWZkYjFiZi02NTc4LTBhNDEtYTMyYy01ZGNmMDEyZTY2NjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjJDRjM3NTA0MDRBMTFFNzgxRkRFQTExOUQwREVGQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjJDRjM3NEY0MDRBMTFFNzgxRkRFQTExOUQwREVGQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTlmZGIxYmYtNjU3OC0wYTQxLWEzMmMtNWRjZjAxMmU2NjYyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE5ZmRiMWJmLTY1NzgtMGE0MS1hMzJjLTVkY2YwMTJlNjY2MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAUUAAgALAAAAAA8ADwAAAT/EMlJq70nn8u7/50mbmBpgqN2ruyUim1cvqpsc3R271VO8p2BcIB6fQRIQWzIJIaMnKRUuWoOizrPNFm1Xnlb6cn73YW5JrIQeEaO1ex21wqUnFnkOuLeYuopYn+Cg4SFhoeIiYqLjI2OHgGRAY8UAJYAFJKak46XnpgIm5KPn5ehoqOMpZ6oqYurl62RjbCWspyvtaeipKsSrb2lma6UnpTHyMnKy8zNzh4F0QWFBtUGLdLZ03rW3dcn2tJ/3tbg4eJA5N0m5+g86uUl7dF18NXs8/X25uHj6ivtQBAYSAAEPGzuOhBcWPDDOkQMCTqLuLAZRYnMLg60qHEixWcXBp9JqKgnAgAh+QQFFAAIACwAAAAAPAA8AAAE/xDJSau9I4/Lu/+dJm5gaYKjdq7slIptXL6qbHN0du9VTvKdgDCAen0OyENsyCSGjJykVLlqDos6zzRZtV55W+nJ+92FuSayEHhGjtXsdtcKlJxZ5Dri3mLqKWJ/goOEhYaHiImKi4yNjh4FkQWPFAKWAhSSmpOOl56YCJuSj5+XoaKjjKWeqKmLq5etkY2wlrKcr7WnoqSrEq29pZmulJ6Ux8jJysvMzc4eBNEEhQDVAC3S2dN61t3XJ9rSf97W4OHiQOTdJufoPOrlJe3RdfDV7PP19ubh4+or7UAYGGgABDxs7joQXFjwwzpEDAk6i7iwGUWJzC4OtKhxIsVnFwafSaioJwIAIfkEBRQACAAsAAAAADwAPAAABP8QyUmrvSGHy7v/nSZuYGmCo3au7JSKbVy+qmxzdHbvVU7ynYKwgHp9BshBbMgkhoycpFS5ag6LOs80WbVeeVvpyfvdhbkmshB4Ro7V7HbXCpScWeQ64t5i6ilif4KDhIWGh4iJiouMjY4eBJEEjxQHlgcUkpqTjpeemAibko+fl6Gio4ylnqipi6uXrZGNsJaynK+1p6KkqxKtvaWZrpSelMfIycrLzM3OHgbRBoUC1QIt0tnTetbd1yfa0n/e1uDh4kDk3Sbn6Dzq5SXt0XXw1ezz9fbm4ePqK+1AABgIAAQ8bO46EFxY8MM6RAwJOou4sBlFicwuDrSocSLFZxcGn0moqCcCACH5BAUUAAgALAAAAAA8ADwAAATpEMlJq70ll8u7/50mbmBpgqN2ruyUim1cvqpsc3R271VO8h2CkIB6fQLIQGzIJIaMnKRUuWoOizrPNFm1Xnlb6cn73YW5JrIQeEaO1ex21wqUnFnkOuLeYuopYn+Cg4SFhoeIiYqLjI2OHgaRBo8UA5YDFJKak46XnpgIm5KPn5ehoqOMpZ6oqYurl62RjbCWspyvtaeipKsSrb2lma6UnpTHyMnKy8zNzskH0QfPEtLW087X0tna28zd3svg0c3j2N/diQLrAiDgh+zx7R/W6vLrzvfxzfrs/P3zlgEMKFDfs37UEOzTEwEAIfkEBRQACAAsAAAAADwAPAAABP8QyUmrvSSTy7v/nSZuYGmCo3au7JSKbVy+qmxzdHbvVU7yHYPQgHp9CshCbMgkhoycpFS5ag6LOs80WbVeeVvpyfvdhbkmshB4Ro7V7HbXCpScWeQ64t5i6ilif4KDhIWGh4iJiouMjY4eAJEAjxQBlgEUkpqTjpeemAibko+fl6Gio4ylnqipi6uXrZGNsJaynK+1p6KkqxKtvaWZrpSelMfIycrLzM3OHgLRAoUD1QMt0tnTetbd1yfa0n/e1uDh4kDk3Sbn6Dzq5SXt0XXw1ezz9fbm4ePqK+1AHBh4AAQ8bO46EFxY8MM6RAwJOou4sBlFicwuDrSocSLFZxcGn0moqCcCACH5BAUUAAgALAAAAAA8ADwAAAT/EMlJq70mm8u7/50mbmBpgqN2ruyUim1cvqpsc3R271VO8h2AEIB6fQhIQmzIJIaMnKRUuWoOizrPNFm1Xnlb6cn73YW5JrIQeEaO1ex21wqUnFnkOuLeYuopYn+Cg4SFhoeIiYqLjI2OHgKRAo8UBZYFFJKak46XnpgIm5KPn5ehoqOMpZ6oqYurl62RjbCWspyvtaeipKsSrb2lma6UnpTHyMnKy8zNzh4H0QeFAdUBLdLZ03rW3dcn2tJ/3tbg4eJA5N0m5+g86uUl7dF18NXs8/X25uHj6ivtQAwYOAAEPGzuOhBcWPDDOkQMCTqLuLAZRYnMLg60qHEixWcXBp9JqKgnAgAh+QQFFAAIACwAAAAAPAA8AAAE/xDJSau9IIPLu/+dJm5gaYKjdq7slIptXL6qbHN0du9VTvIdgVCAen0MSENsyCSGjJykVLlqDos6zzRZtV55W+nJ+92FuSayEHhGjtXsdtcKlJxZ5Dri3mLqKWJ/goOEhYaHiImKi4yNjh4HkQePFASWBBSSmpOOl56YCJuSj5+XoaKjjKWeqKmLq5etkY2wlrKcr7WnoqSrEq29pZmulJ6Ux8jJysvMzc4eA9EDhQXVBS3S2dN61t3XJ9rSf97W4OHiQOTdJufoPOrlJe3RdfDV7PP19ubh4+or7UAEGBgABDxs7joQXFjwwzpEDAk6i7iwGUWJzC4OtKhxIsVnFwafSaioJwIAIfkEBRQACAAsAAAAADwAPAAABP8QyUmrvSKLy7v/nSZuYGmCo3au7JSKbVy+qmxzdHbvVU7ynYPwgHp9AEhAbMgkhoycpFS5ag6LOs80WbVeeVvpyfvdhbkmshB4Ro7V7HbXCpScWeQ64t5i6ilif4KDhIWGh4iJiouMjY4eA5EDjxQGlgYUkpqTjpeemAibko+fl6Gio4ylnqipi6uXrZGNsJaynK+1p6KkqxKtvaWZrpSelMfIycrLzM3OHgHRAYUE1QQt0tnTetbd1yfa0n/e1uDh4kDk3Sbn6Dzq5SXt0XXw1ezz9fbm4ePqK+1AFBhYAAQ8bO46EFxY8MM6RAwJOou4sBlFicwuDrSocSLFZxcGn0moqCcCADs="><div style="text-align:center;margin-top: 5px">努力加载中请稍后...</div></div></div>',
            replace: true,
            link: function ($scope) {
                $scope.provider = provider;
            }
        }
    }

    function hdLoadingService() {
        var requestTotal=0;
        var self = this;
        self.isShow = false;
        this.show = function () {
            requestTotal++;
            self.isShow = true;
        };
        this.hide = function () {
            requestTotal--;
            if(requestTotal==0){
                self.isShow = false;
            }
        };
    }
})();
/**
 * Created by songjian on 2017/5/10.
 * @desc  单选框控件
 */
(function () {
  angular.module('hd.radio', [])
    .directive('hdRadio',hdRadioDirective);

  function hdRadioDirective(){
    return {
      restrict: 'AE',
      template: '<div class="hdRadio"><input type="radio" ng-model="model" ng-value="radioValue" name="{{raidoName}}" ng-disabled="disabled||disabled2"><label ></label></div>',
      replace: true,
      require: '?ngModel',
      scope:{
        disabled:'=ngDisabled'
      },
      link: function ($scope, element, attrs,ngModel) {
        $scope.disabled2 = true;
        if (attrs.disabled == undefined) {
          $scope.disabled2 = false;
        }
        $scope.raidoName = attrs.name;
        $scope.radioValue = attrs.value;
        var note = attrs.note;

        if(attrs.value==="false"){
          $scope.radioValue = false;
        }else if(attrs.value==="true"){
          $scope.radioValue = true;
        }
        var timestamp = hdUtils.getUuid();
        element.find("input").attr("id","hd-radio-"+timestamp);
        element.find("label").attr("for","hd-radio-"+timestamp);

        // 补充文字
        // if (element.attr('note') && element.attr('note') != '') {
        if (note != '') {
          element.after('<label note></label>');
          // element.next().text(element.attr('note'));
          element.next().text(note);
          element.next().css('padding', '0px 4px');
          element.next().attr("for","hd-radio-"+timestamp);
        }
        element.find("label").css('cursor', 'pointer');
        element.next().css('cursor', 'pointer');


        ngModel.$render = function() {
          $scope.model = ngModel.$viewValue;
        };
        element.find("input").on("change",function(){
          if($(this).val()==="false"){
            ngModel.$setViewValue(false);
          }else if($(this).val()==="true"){
            ngModel.$setViewValue(true);
          }else{
            ngModel.$setViewValue($(this).val());
          }

        });
      }
    }
  }
})();
/**
 * Created by songjian on 2017/5/10.
 * @desc  多选框控件
 */
(function () {
  angular.module('hd.checkbox', [])
    .directive('hdCheckbox',hdCheckboxDirective);

  function hdCheckboxDirective(){
    return {
      restrict: 'AE',
      template: '<div class="hdCheck"><input type="checkbox" ng-model="model"  name="{{checkboxName}}" ng-disabled="disabled||disabled2"><label ></label></div>',
      replace: true,
      require: ['?ngModel'],
      scope:{
        disabled:'=ngDisabled'
      },
      compile: function(element, attrs, transcludeFn) {
        element.find("input").attr("ng-true-value",attrs.ngTrueValue);
        element.find("input").attr("ng-false-value",attrs.ngFalseValue);
        return function ($scope, element, attrs,ctrls) {
          var ngModel = ctrls[0];
          $scope.disabled2 = true;
          if (attrs.disabled == undefined) {
            $scope.disabled2 = false;
          }
          $scope.trueValue = attrs.ngTrueValue;
          $scope.falseValue = attrs.ngFalseValue;
          $scope.checkboxName = attrs.name;

          var timestamp = hdUtils.getUuid();
          element.find("input").attr("id","hd-checkbox-"+timestamp);
          element.find("label").attr("for","hd-checkbox-"+timestamp);

          // 补充文字
          if (attrs.note && attrs.note != '') {
            element.after('<label note></label>');
            element.next().text(attrs.note);
            element.next().css('padding', '0px 4px');
            element.next().attr("for","hd-checkbox-"+timestamp);
          }
          element.find("label").css('cursor', 'pointer');
          element.next().css('cursor', 'pointer');

          ngModel.$render = function() {
            $scope.model = ngModel.$viewValue;
          };
          $scope.$watch("model",function(){
            ngModel.$setViewValue($scope.model);
          });
        };
      }
    }
  }
})();
/**
 * Created by songjian on 2017/3/7.
 * @desc  搜索框控件
 */

(function () {
    angular.module('hd.searchInput', [])
        .directive('hdSearchInput', function () {
            return {
                restrict: 'AE',
                // template: '<div class="hd-search-input"><input class="hd-search-input-content" placeholder="{{placeholder}}"/><div class="hd-search-input-right"><button class="hd-search-input-right-del" ng-click="clear()"><i class="fa fa-times"></i></button><button class="hd-search-input-right-search" ng-click="searchBtnClick()"><i class="fa fa-search"></i></button></div></div>',
                /*template: ''
                    +'<table hdSearch cellspacing="0" cellpadding="0">'
                    +'  <tr>'
                    +'    <td hdI><input placeholder="{{placeholder}}"></td>'
                    +'    <td hdC><button ng-click="clear()"><i class="iconfont icon-guanbi"></i></button></td>'
                    +'    <td hdS><button ng-click="searchBtnClick()"><i class="iconfont icon-fangdajing"></i></button></td>'
                    +'  </tr>'
                    +'</table>',*/
                template: ''
                +'<div hdSearch>'
                    +'  <input placeholder="{{placeholder}}">'
                    +'  <button hdC ng-click="clear()"><i class="iconfont icon-guanbi"></i></button>'
                    +'  <button hdS btnMain="m1" ng-click="searchBtnClick()"><i class="iconfont icon-fangdajing"></i></button>'
                    +'</div>',
                replace: true,
                require: '?ngModel',
                scope: {
                    searchBtnClick: "&"
                },
                link: function ($scope, element, attrs,ngModel) {

                    $scope.placeholder = attrs.placeholder;
                    $scope.clear = function () {
                        element.find("input").val("");
                        ngModel.$setViewValue("");
                    };
                    ngModel.$render = function() {
                        element.find("input").val( ngModel.$viewValue || '');
                    };
                    element.find("input").on("change",function(){
                        ngModel.$setViewValue($(this).val());
                    });
                }
            }
        });
})();
/**
 * Created by songjian on 2017/3/7.
 * @desc  时间选择器控件
 */
(function () {
  angular.module('hd.dateInput', [])
    .directive('hdDateButton', ["$filter", function () {
      return {
        restrict: 'AE',
        template: '<div class="hdDate hdDateNoDate"><input type="button"/></div>',
        replace: true,
        require: "?ngModel",
        scope: {
          disabled: '=ngDisabled',
          hdDateInputChange: "&"
        },
        link: function ($scope, element, attrs, ngModel) {
          var id = "hd-date-" + hdUtils.getUuid();
          var $input= element.find('input');
          $input.attr('id', id);
          var cfg = {
            istoday: false,
            isclear: false,
            issure: true,
            elem: '#' + id, //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
            format: "YYYY-MM", // 分隔符可以任意定义，该例子表示只显示年月
            choose: function (datas) { //选择日期完毕的回调
              ngModel.$setViewValue(datas);
              $scope.$apply();
              if ($scope.hdDateInputChange) {
                $scope.hdDateInputChange();
              }
            }
          };
          $input.click(function () {
            laydate(cfg);
            $("#laydate_y").click();
            $(".laydate_yms").hide().show();
            $("#laydate_box").show();
            $("#laydate_box").addClass("hdDateNoDate");
            $("#laydate_ok").text("关闭");


            var cancleEvent = function(event){
              event.stopPropagation();
              return false;
            };
            $(".laydate_top_mask").unbind("click",cancleEvent).click(cancleEvent);
          });
          ngModel.$render = function () {
            $input.val(ngModel.$viewValue);
          };
        }
      }
    }])

    .directive('hdDateInput', ["$filter", function ($filter) {
      return {
        restrict: 'AE',
        template: '<div class="hdDate"><i class="iconfont icon-riqi"></i><input type="text" ng-disabled="disabled||disabled2"/></div>',
        replace: true,
        require: "?ngModel",
        scope: {
          disabled: '=ngDisabled',
          hdDateInputChange: "&"
        },
        link: function ($scope, element, attrs, ngModel) {
          var format = 'YYYY-MM-DD';
          if (attrs.hdDateInputIsTime) {
            format = format + " hh:mm:ss";
          }

          var id = "hd-dateInput-" + hdUtils.getUuid();
          element.find("input").attr('id', id);
          var cfg = {
            istoday: true,
            isclear: false,
            issure: false,
            elem: '#' + id, //目标元素。由于laydate.js封装了一个轻量级的选择器引擎，因此elem还允许你传入class、tag但必须按照这种方式 '#id .class'
            format: format, // 分隔符可以任意定义，该例子表示只显示年月
            istime: attrs.hdDateInputIsTime,
            choose: function (datas) { //选择日期完毕的回调
              ngModel.$setViewValue(datas);
              $scope.$apply();
              if ($scope.hdDateInputChange) {
                $scope.hdDateInputChange();
              }
            }
          };

          if (attrs.hdDateInputMax) {
            cfg.max = attrs.hdDateInputMax;
          }
          if (attrs.hdDateInputMin) {
            cfg.min = attrs.hdDateInputMin;
          }

          //判断是否可用
          $scope.disabled2 = true;
          if (attrs.disabled == undefined) {
            $scope.disabled2 = false;
          } else {
            element.click(function () {
              $("#laydate_box").removeClass("hdDateNoDate");
              $("#laydate_ok").text("确认");
              $('.laydate_yms').css('display', "");
              laydate(cfg);
            });
          }
          $scope.$watch("disabled", function (newValue) {
            if (newValue) {
              element.unbind();
            } else {
              element.click(function () {
                $("#laydate_box").removeClass("hdDateNoDate");
                $("#laydate_ok").text("确认");
                $('.laydate_yms').css('display', "");
                laydate(cfg);
              });
            }
          });


          ngModel.$render = function () {
            $(element[0]).find("input").val(ngModel.$viewValue);
            $input.change();
          };

          function JQValidDateTime(sDateTime) {
            //如果日期为空，返回false
            if (sDateTime == null) {
              return false;
            }
            var arrDateTime = sDateTime.split(" ");
            //把开始时间日期部分拆分为 YYYY 与 MM 与 DD
            var arrDate = arrDateTime[0].split("-");
            if(arrDate.length<3){
              return false;
            }
            if(arrDate[0].length!=4||arrDate[0]<1900||arrDate[0]>2099){
              return false;
            }
            if(arrDate[1].length!=2){
              return false;
            }
            if(arrDate[2].length!=2){
              return false;
            }
            //如果带有 HH24:MI
            var arrTime = null;
            if (arrDateTime[1] != null) {
              //把开始时间时间部分拆分为 HH24 与 MM 与 MI
              arrTime = arrDateTime[1].split(":");
            }
            //转化js 日期格式
            var result = null;
            try {
              if (arrTime == null) {
                //生成 短日期（YYYY.MM.DD）
                result = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]);
              } else {
                //生成 长日期（YYYY.MM.DD HH24:MI）
                result = new Date(arrDate[0], arrDate[1] - 1, arrDate[2], arrTime[0], arrTime[1], arrTime[2]);
              }
            } catch (e) {
              //如果生成日期出错了，返回
              return false;
            }
            //如果生成的日期的 年 <> 输入日期的 年 返回false
            if (arrDate[0] != result.getFullYear()) {
              return false;
            }
            //如果生成的日期的 月<> 输入日期的 月 返回false
            if (arrDate[1] != result.getMonth() + 1) {
              return false;
            }
            //如果生成的日期的 日<> 输入日期的 日 返回false
            if (arrDate[2] != result.getDate()) {
              return false;
            }
            if (arrDateTime[1] != null) {
              //如果生成的日期的 时 <> 输入日期的 时 返回false
              if (arrTime[0] != result.getHours()) {
                return false;
              }
              //如果生成的日期的 分 <> 输入日期的 分 返回false
              if (arrTime[1] != result.getMinutes()) {
                return false;
              }
            }
            return true;
          }


          var $input = element.find("input");
          $input.change(function () {

            if (JQValidDateTime($input.val())) {
              ngModel.$setViewValue($input.val());
              return;
            }
            $input.val("");
            ngModel.$setViewValue("");
          });

        }
      }
    }]);


  /**

   @Name : layDate v1.1 日期控件
   @Author: 贤心
   @Date: 2014-06-25
   @QQ群：176047195
   @Site：http://sentsin.com/layui/laydate

   */

  ;
  !function (win) {

//全局配置，如果采用默认均不需要改动
    var config = {
      path: '', //laydate所在路径
      skin: 'default', //初始化皮肤
      format: 'YYYY-MM-DD', //日期格式
      min: '1900-01-01 00:00:00', //最小日期
      max: '2099-12-31 23:59:59', //最大日期
      isv: false,
      init: true
    };

    var angularObj = null;

    var Dates = {}, doc = document, creat = 'createElement', byid = 'getElementById', tags = 'getElementsByTagName';
    var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];


//主接口
    win.laydate = function (options) {
      options = options || {};
      try {
        as.event = win.event ? win.event : laydate.caller.arguments[0];
      } catch (e) {
      }
      ;
      Dates.run(options);
      return laydate;
    };

    laydate.v = '1.1';
    laydate.Dates = Dates;
//获取组件存放路径
    Dates.getPath = (function () {
      var js = document.scripts, jsPath = js[js.length - 1].src;
      return config.path ? config.path : jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    }());

    Dates.use = function (lib, id) {
      //var link = doc[creat]('link');
      //link.type = 'text/css';
      //link.rel = 'stylesheet';
      //link.href = Dates.getPath + lib + as[5];
      //id && (link.id = id);
      //doc[tags]('head')[0].appendChild(link);
      //link = null;
    };

    Dates.trim = function (str) {
      str = str || '';
      return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
    };

//补齐数位
    Dates.digit = function (num) {
      return num < 10 ? '0' + (num | 0) : num;
    };

    Dates.stopmp = function (e) {
      e = e || win.event;
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
      return this;
    };

    Dates.each = function (arr, fn) {
      var i = 0, len = arr.length;
      for (; i < len; i++) {
        if (fn(i, arr[i]) === false) {
          break
        }
      }
    };

    Dates.hasClass = function (elem, cls) {
      elem = elem || {};
      return new RegExp('\\b' + cls + '\\b').test(elem.className);
    };

    Dates.addClass = function (elem, cls) {
      elem = elem || {};
      Dates.hasClass(elem, cls) || (elem.className += ' ' + cls);
      elem.className = Dates.trim(elem.className);
      return this;
    };

    Dates.removeClass = function (elem, cls) {
      elem = elem || {};
      if (Dates.hasClass(elem, cls)) {
        var reg = new RegExp('\\b' + cls + '\\b');
        elem.className = elem.className.replace(reg, '');
      }
      return this;
    };

//清除css属性
    Dates.removeCssAttr = function (elem, attr) {
      var s = elem.style;
      if (s.removeProperty) {
        s.removeProperty(attr);
      } else {
        s.removeAttribute(attr);
      }
    };

//显示隐藏
    Dates.shde = function (elem, type) {
      elem.style.display = type ? 'none' : 'block';
    };

//简易选择器
    Dates.query = function (node) {
      if (node && node.nodeType === 1) {
        if (node.tagName.toLowerCase() !== 'input') {
          throw new Error('选择器elem错误');
        }
        return node;
      }

      var node = (Dates.trim(node)).split(' '), elemId = doc[byid](node[0].substr(1)), arr;
      if (!elemId) {
        return;
      } else if (!node[1]) {
        return elemId;
      } else if (/^\./.test(node[1])) {
        var find, child = node[1].substr(1), exp = new RegExp('\\b' + child + '\\b');
        arr = []
        find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
        Dates.each(find, function (ii, that) {
          exp.test(that.className) && arr.push(that);
        });
        return arr[0] ? arr : '';
      } else {
        arr = elemId[tags](node[1]);
        return arr[0] ? elemId[tags](node[1]) : '';
      }
    };

//事件监听器
    Dates.on = function (elem, even, fn) {
      elem.attachEvent ? elem.attachEvent('on' + even, function () {
        fn.call(elem, win.even);
      }) : elem.addEventListener(even, fn, false);
      return Dates;
    };

//阻断mouseup
    Dates.stopMosup = function (evt, elem) {
      if (evt !== 'mouseup') {
        Dates.on(elem, 'mouseup', function (ev) {
          Dates.stopmp(ev);
        });
      }
    };

    Dates.run = function (options) {
      var S = Dates.query, elem, devt, even = as.event, target;
      try {
        target = even.target || even.srcElement || {};
      } catch (e) {
        target = {};
      }
      elem = options.elem ? S(options.elem) : target;

      as.elemv = /textarea|input/.test(elem.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';

      // by dsj 设置传入的初始化日期
      if (('init' in options ? options.init : config.init) && (!elem[as.elemv])) {
        if (options.defaultDate != null) {
          elem[as.elemv] = options.defaultDate;
        } else {
          //elem[as.elemv] = laydate.now(null, options.format || config.format);
        }
      }

      if (even && target.tagName) {
        if (!elem || elem === Dates.elem) {
          return;
        }
        Dates.stopMosup(even.type, elem);
        Dates.stopmp(even);
        Dates.view(elem, options);
        Dates.reshow();
      } else {
        devt = options.event || 'click';
        Dates.each((elem.length | 0) > 0 ? elem : [elem], function (ii, that) {
          Dates.stopMosup(devt, that);
          Dates.on(that, devt, function (ev) {
            Dates.stopmp(ev);
            if (that !== Dates.elem) {
              Dates.view(that, options);
              Dates.reshow();
            }
          });
        });
      }

      chgSkin(options.skin || config.skin)
    };

    Dates.scroll = function (type) {
      type = type ? 'scrollLeft' : 'scrollTop';
      return doc.body[type] | doc.documentElement[type];
    };

    Dates.winarea = function (type) {
      return document.documentElement[type ? 'clientWidth' : 'clientHeight']
    };

//判断闰年
    Dates.isleap = function (year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };

//检测是否在有效期
    Dates.checkVoid = function (YY, MM, DD) {
      var back = [];
      YY = YY | 0;
      MM = MM | 0;
      DD = DD | 0;
      if (YY < Dates.mins[0]) {
        back = ['y'];
      } else if (YY > Dates.maxs[0]) {
        back = ['y', 1];
      } else if (YY >= Dates.mins[0] && YY <= Dates.maxs[0]) {
        if (YY == Dates.mins[0]) {
          if (MM < Dates.mins[1]) {
            back = ['m'];
          } else if (MM == Dates.mins[1]) {
            if (DD < Dates.mins[2]) {
              back = ['d'];
            }
          }
        }
        if (YY == Dates.maxs[0]) {
          if (MM > Dates.maxs[1]) {
            back = ['m', 1];
          } else if (MM == Dates.maxs[1]) {
            if (DD > Dates.maxs[2]) {
              back = ['d', 1];
            }
          }
        }
      }
      return back;
    };

//时分秒的有效检测
    Dates.timeVoid = function (times, index) {
      if (Dates.ymd[1] + 1 == Dates.mins[1] && Dates.ymd[2] == Dates.mins[2]) {
        if (index === 0 && (times < Dates.mins[3])) {
          return 1;
        } else if (index === 1 && times < Dates.mins[4]) {
          return 1;
        } else if (index === 2 && times < Dates.mins[5]) {
          return 1;
        }
      } else if (Dates.ymd[1] + 1 == Dates.maxs[1] && Dates.ymd[2] == Dates.maxs[2]) {
        if (index === 0 && times > Dates.maxs[3]) {
          return 1;
        } else if (index === 1 && times > Dates.maxs[4]) {
          return 1;
        } else if (index === 2 && times > Dates.maxs[5]) {
          return 1;
        }
      }
      if (times > (index ? 59 : 23)) {
        return 1;
      }
    };

//检测日期是否合法
    Dates.check = function () {
      var reg = Dates.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g, '\\d+\\').replace(/\\$/g, '');
      var exp = new RegExp(reg), value = Dates.elem[as.elemv];
      var arr = value.match(/\d+/g) || [], isvoid = Dates.checkVoid(arr[0], arr[1], arr[2]);
      if (value.replace(/\s/g, '') !== '') {
        if (!exp.test(value)) {
          Dates.elem[as.elemv] = '';
          Dates.msg('日期不符合格式，请重新选择。');
          return 1;
        } else if (isvoid[0]) {
          Dates.elem[as.elemv] = '';
          Dates.msg('日期不在有效期内，请重新选择。');
          return 1;
        } else {
          isvoid.value = Dates.elem[as.elemv].match(exp).join();
          arr = isvoid.value.match(/\d+/g);
          if (arr[1] < 1) {
            arr[1] = 1;
            isvoid.auto = 1;
          } else if (arr[1] > 12) {
            arr[1] = 12;
            isvoid.auto = 1;
          } else if (arr[1].length < 2) {
            isvoid.auto = 1;
          }
          if(!arr[2]){
            arr[2] = 1;
            isvoid.auto = 1;
          }else if (arr[2] < 1) {
            arr[2] = 1;
            isvoid.auto = 1;
          } else if (arr[2] > Dates.months[(arr[1] | 0) - 1]) {
            arr[2] = 31;
            isvoid.auto = 1;
          } else if (arr[2].length < 2) {
            isvoid.auto = 1;
          }
          if (arr.length > 3) {
            if (Dates.timeVoid(arr[3], 0)) {
              isvoid.auto = 1;
            }
            ;
            if (Dates.timeVoid(arr[4], 1)) {
              isvoid.auto = 1;
            }
            ;
            if (Dates.timeVoid(arr[5], 2)) {
              isvoid.auto = 1;
            }
            ;
          }
          if (isvoid.auto) {
            Dates.creation([arr[0], arr[1] | 0, arr[2] | 0], 1);
          } else if (isvoid.value !== Dates.elem[as.elemv]) {
            Dates.elem[as.elemv] = isvoid.value;
          }
        }
      }
    };

//生成日期
    Dates.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    Dates.viewDate = function (Y, M, D) {
      if(!D){
        D=1;
      }
      var S = Dates.query, log = {}, De = new Date();
      Y < (Dates.mins[0] | 0) && (Y = (Dates.mins[0] | 0));
      Y > (Dates.maxs[0] | 0) && (Y = (Dates.maxs[0] | 0));

      De.setFullYear(Y, M, D);
      log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

      Dates.months[1] = Dates.isleap(log.ymd[0]) ? 29 : 28;

      De.setFullYear(log.ymd[0], log.ymd[1], 1);
      log.FDay = De.getDay();

      log.PDay = Dates.months[M === 0 ? 11 : M - 1] - log.FDay + 1;
      log.NDay = 1;

      //渲染日
      Dates.each(as.tds, function (i, elem) {
        var YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
        elem.className = '';
        if (i < log.FDay) {
          elem.innerHTML = DD = i + log.PDay;
          Dates.addClass(elem, 'laydate_nothis');
          MM === 1 && (YY -= 1);
          MM = MM === 1 ? 12 : MM - 1;
        } else if (i >= log.FDay && i < log.FDay + Dates.months[log.ymd[1]]) {
          elem.innerHTML = DD = i - log.FDay + 1;
          if (i - log.FDay + 1 === log.ymd[2]) {
            Dates.addClass(elem, as[2]);
            log.thisDay = elem;
          }
        } else {
          elem.innerHTML = DD = log.NDay++;
          Dates.addClass(elem, 'laydate_nothis');
          MM === 12 && (YY += 1);
          MM = MM === 12 ? 1 : MM + 1;
        }

        if (Dates.checkVoid(YY, MM, DD)[0]) {
          Dates.addClass(elem, as[1]);
        }

        Dates.options.festival && Dates.festival(elem, MM + '.' + DD);
        elem.setAttribute('y', YY);
        elem.setAttribute('m', MM);
        elem.setAttribute('d', DD);
        YY = MM = DD = null;
      });

      Dates.valid = !Dates.hasClass(log.thisDay, as[1]);
      Dates.ymd = log.ymd;

      //锁定年月
      as.year.value = Dates.ymd[0] + '年';
      as.month.value = Dates.digit(Dates.ymd[1] + 1) + '月';

      //定位月
      Dates.each(as.mms, function (i, elem) {
        var getCheck = Dates.checkVoid(Dates.ymd[0], (elem.getAttribute('m') | 0) + 1);
        if (getCheck[0] === 'y' || getCheck[0] === 'm') {
          Dates.addClass(elem, as[1]);
        } else {
          Dates.removeClass(elem, as[1]);
        }
        Dates.removeClass(elem, as[2]);
        getCheck = null
      });
      Dates.addClass(as.mms[Dates.ymd[1]], as[2]);

      //定位时分秒
      log.times = [
        Dates.inymd[Dates.elemIndexMap.hour] | 0 || 0,
        Dates.inymd[Dates.elemIndexMap.minute] | 0 || 0,
        Dates.inymd[Dates.elemIndexMap.second] | 0 || 0
      ];
      Dates.each(new Array(3), function (i) {
        Dates.hmsin[i].value = Dates.digit(Dates.timeVoid(log.times[i], i) ? Dates.mins[i + 3] | 0 : log.times[i] | 0);
      });

      //确定按钮状态
      Dates[Dates.valid ? 'removeClass' : 'addClass'](as.ok, as[1]);
    };

//节日
    Dates.festival = function (td, md) {
      var str;
      switch (md) {
        case '1.1':
          str = '元旦';
          break;
        case '3.8':
          str = '妇女';
          break;
        case '4.5':
          str = '清明';
          break;
        case '5.1':
          str = '劳动';
          break;
        case '6.1':
          str = '儿童';
          break;
        case '9.10':
          str = '教师';
          break;
        case '10.1':
          str = '国庆';
          break;
      }
      ;
      str && (td.innerHTML = str);
      str = null;
    };

//生成年列表
    Dates.viewYears = function (YY) {
      var S = Dates.query, str = '';
      Dates.each(new Array(14), function (i) {
        if (i === 7) {
          str += '<li ' + (parseInt(as.year.value) === YY ? 'class="' + as[2] + '"' : '') + ' y="' + YY + '">' + YY + '年</li>';
        } else {
          str += '<li y="' + (YY - 7 + i) + '">' + (YY - 7 + i) + '年</li>';
        }
      });
      S('#laydate_ys').innerHTML = str;
      Dates.each(S('#laydate_ys li'), function (i, elem) {
        if (Dates.checkVoid(elem.getAttribute('y'))[0] === 'y') {
          Dates.addClass(elem, as[1]);
        } else {
          Dates.on(elem, 'click', function (ev) {
            Dates.stopmp(ev).reshow();
            Dates.viewDate(this.getAttribute('y') | 0, Dates.ymd[1], Dates.ymd[2]);

            // dsj ALPS-2018 选择年后, 界面显示更新
            Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]], true);
          });
        }
      });
    };

    Dates.getEachElementIndex = function (format) {
      var components = {};
      var currentIndex = 0;
      format.replace(/YYYY|MM|DD|hh|mm|ss/g, function (str, index) {
        if (str === 'YYYY') {
          components['year'] = currentIndex++;
        } else if (str === 'MM') {
          components['month'] = currentIndex++;
        } else if (str === 'DD') {
          components['day'] = currentIndex++;
        } else if (str === 'hh') {
          components['hour'] = currentIndex++;
        } else if (str === 'mm') {
          components['minute'] = currentIndex++;
        } else if (str === 'ss') {
          components['second'] = currentIndex++;
        }
        return "";
      });
      return components;
    };

//初始化面板数据
    Dates.initDate = function (format) {
      var S = Dates.query, log = {}, De = new Date();
      var ymd = Dates.elem[as.elemv].match(/\d+/g) || [];
      var elemIndexMap = Dates.getEachElementIndex(format);
      Dates.elemIndexMap = elemIndexMap;
      if (ymd.length < 3) {
        ymd = Dates.options.start.match(/\d+/g) || [];
        if (ymd.length < 3) {
          ymd = [De.getFullYear(), De.getMonth() + 1, De.getDate()];
        }
      }
      Dates.inymd = ymd;
      Dates.viewDate(ymd[elemIndexMap.year], ymd[elemIndexMap.month] - 1, ymd[elemIndexMap.day]);
    };

//是否显示零件
    Dates.iswrite = function () {
      var S = Dates.query, log = {
        time: S('#laydate_hms')
      };
      Dates.shde(log.time, !Dates.options.istime);
      Dates.shde(as.oclear, !('isclear' in Dates.options ? Dates.options.isclear : 1));
      Dates.shde(as.otoday, !('istoday' in Dates.options ? Dates.options.istoday : 1));
      Dates.shde(as.ok, !('issure' in Dates.options ? Dates.options.issure : 1));
    };

//方位辨别
    Dates.orien = function (obj, pos) {
      //by dsj 调整页面的左右位置，避免被左右遮挡
      var iCalLeft, iCalScrollWidth, iCalObjWidth;
      iCalObjWidth = 245;
      iCalScrollWidth = parseFloat(document.body.scrollWidth);

      var tops, rect = Dates.elem.getBoundingClientRect();
      obj.style.left = rect.left + (pos ? 0 : Dates.scroll(1)) + 'px';

      //by dsj 调整页面的左右位置，避免被左右遮挡
      iCalLeft = parseFloat(obj.style.left);
      if (iCalLeft + iCalObjWidth > iCalScrollWidth) {
        obj.style.left = (iCalLeft - (iCalLeft + iCalObjWidth - iCalScrollWidth)) + 'px';
      }


      if (rect.bottom + obj.offsetHeight / 1.5 <= Dates.winarea()) {
        tops = rect.bottom - 1;
      } else {
        tops = rect.top > obj.offsetHeight / 1.5 ? rect.top - obj.offsetHeight + 1 : Dates.winarea() - obj.offsetHeight;
      }
      obj.style.top = Math.max(tops + (pos ? 0 : Dates.scroll()), 1) + 'px';
    };

//吸附定位
    Dates.follow = function (obj) {
      if (Dates.options.fixed) {
        obj.style.position = 'fixed';
        Dates.orien(obj, 1);
      } else {
        obj.style.position = 'absolute';
        Dates.orien(obj);
      }
    };

//生成表格
    Dates.viewtb = (function () {
      var tr, view = [], weeks = ['日', '一', '二', '三', '四', '五', '六'];
      var log = {}, table = doc[creat]('table'), thead = doc[creat]('thead');
      thead.appendChild(doc[creat]('tr'));
      log.creath = function (i) {
        var th = doc[creat]('th');
        th.innerHTML = weeks[i];
        thead[tags]('tr')[0].appendChild(th);
        th = null;
      };

      Dates.each(new Array(6), function (i) {
        view.push([]);
        tr = table.insertRow(0);
        Dates.each(new Array(7), function (j) {
          view[i][j] = 0;
          i === 0 && log.creath(j);
          tr.insertCell(j);
        });
      });

      table.insertBefore(thead, table.children[0]);
      table.id = table.className = 'laydate_table';
      tr = view = null;
      return table.outerHTML.toLowerCase();
    }());

//渲染控件骨架
    Dates.view = function (elem, options) {
      var S = Dates.query, div, log = {};
      options = options || elem;

      Dates.elem = elem;
      Dates.options = options;
      Dates.options.format || (Dates.options.format = config.format);
      Dates.options.start = Dates.options.start || '';
      Dates.mm = log.mm = [Dates.options.min || config.min, Dates.options.max || config.max];
      Dates.mins = log.mm[0].match(/\d+/g);
      Dates.maxs = log.mm[1].match(/\d+/g);

      if (!Dates.box) {
        div = doc[creat]('div');
        div.id = as[0];
        div.className = as[0];
        div.style.cssText = 'position: absolute;';
        div.setAttribute('name', 'laydate-v' + laydate.v);

        div.innerHTML = log.html = '<div class="laydate_top">'
          + '<div class="laydate_ym laydate_y" id="laydate_YY">'
          + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
          + '<input id="laydate_y" readonly><label></label>'
          + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
          + '<div class="laydate_yms">'
          + '<a class="laydate_tab laydate_chtop"><cite></cite></a>'
          + '<ul id="laydate_ys"></ul>'
          + '<a class="laydate_tab laydate_chdown"><cite></cite></a>'
          + '</div>'
          + '</div>'
          + '<div class="laydate_ym laydate_m" id="laydate_MM">'
          + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>'
          + '<input id="laydate_m" readonly><label></label>'
          + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>'
          + '<div class="laydate_yms" id="laydate_ms">' + function () {
            var str = '';
            Dates.each(new Array(12), function (i) {
              str += '<span m="' + i + '">' + Dates.digit(i + 1) + '月</span>';
            });
            return str;
          }() + '</div>'
          + '</div>'
          + '<div class="laydate_top_mask"></div></div>'

          + Dates.viewtb

          + '<div class="laydate_bottom">'
          + '<ul id="laydate_hms">'
          + '<li class="laydate_sj">时间</li>'
          + '<li><input readonly>:</li>'
          + '<li><input readonly>:</li>'
          + '<li><input readonly></li>'
          + '</ul>'
          + '<div class="laydate_time" id="laydate_time"></div>'
          + '<div class="laydate_btn">'
          + '<a id="laydate_clear">清空</a>'
          + '<a id="laydate_today">今天</a>'
          + '<a id="laydate_ok">确认</a>'
          + '</div>'
          + (config.isv ? '<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v' + laydate.v + '</a>' : '')
          + '</div>';
        doc.body.appendChild(div);
        Dates.box = S('#' + as[0]);
        Dates.events();
        div = null;
      } else {
        Dates.shde(Dates.box);
      }
      Dates.follow(Dates.box);
      options.zIndex ? Dates.box.style.zIndex = options.zIndex : Dates.removeCssAttr(Dates.box, 'z-index');
      Dates.stopMosup('click', Dates.box);

      Dates.initDate(options.format);
      Dates.iswrite();
      Dates.check();
    };

//隐藏内部弹出元素
    Dates.reshow = function () {
      Dates.each(Dates.query('#' + as[0] + ' .laydate_show'), function (i, elem) {
        Dates.removeClass(elem, 'laydate_show');
      });
      return this;
    };

//关闭控件
    Dates.close = function () {
      Dates.reshow();
      Dates.shde(Dates.query('#' + as[0]), 1);
      Dates.elem = null;
    };

//转换日期格式
    Dates.parse = function (ymd, hms, format) {
      ymd = ymd.concat(hms); // [year, month, day, hour, minute, second]
      format = format || (Dates.options ? Dates.options.format : config.format);
      return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function (str, index) {
        var pos = -1;
        if (str === 'YYYY') {
          pos = 0;
        } else if (str === 'MM') {
          pos = 1;
        } else if (str === 'DD') {
          pos = 2;
        } else if (str === 'hh') {
          pos = 3;
        } else if (str === 'mm') {
          pos = 4;
        } else if (str === 'ss') {
          pos = 5;
        }
        return Dates.digit(ymd[pos]);
      });
    };

//返回最终日期
    Dates.creation = function (ymd, hide) {
      var S = Dates.query, hms = Dates.hmsin;
      var getDates = Dates.parse(ymd, [hms[0].value, hms[1].value, hms[2].value]);
      Dates.elem[as.elemv] = getDates;
      typeof Dates.options.choose === 'function' && Dates.options.choose(getDates);
      if (!hide) {
        Dates.close();
        // typeof Dates.options.choose === 'function' && Dates.options.choose(getDates);
      }
    };

//事件
    Dates.events = function () {
      var S = Dates.query, log = {
        box: '#' + as[0]
      };

      Dates.addClass(doc.body, 'laydate_body');

      as.tds = S('#laydate_table td');
      as.mms = S('#laydate_ms span');
      as.year = S('#laydate_y');
      as.month = S('#laydate_m');

      //显示更多年月
      Dates.each(S(log.box + ' .laydate_ym'), function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          Dates.stopmp(ev).reshow();
          Dates.addClass(this[tags]('div')[0], 'laydate_show');
          if (!i) {
            log.YY = parseInt(as.year.value);
            Dates.viewYears(log.YY);
          }
        });
      });

      Dates.on(S(log.box), 'click', function () {
        Dates.reshow();
      });

      //切换年
      log.tabYear = function (type) {
        if (type === 0) {
          Dates.ymd[0]--;
        } else if (type === 1) {
          Dates.ymd[0]++;
        } else if (type === 2) {
          log.YY -= 14;
        } else {
          log.YY += 14;
        }
        if (type < 2) {
          Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
          Dates.reshow();
        } else {
          Dates.viewYears(log.YY);
        }
      };
      Dates.each(S('#laydate_YY .laydate_tab'), function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          Dates.stopmp(ev);
          log.tabYear(i);

          // dsj ALPS-2018 选择年后, 界面显示更新
          Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]], true);
        });
      });


      //切换月
      log.tabMonth = function (type) {
        if (type) {
          Dates.ymd[1]++;
          if (Dates.ymd[1] === 12) {
            Dates.ymd[0]++;
            Dates.ymd[1] = 0;
          }
        } else {
          Dates.ymd[1]--;
          if (Dates.ymd[1] === -1) {
            Dates.ymd[0]--;
            Dates.ymd[1] = 11;
          }
        }
        Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
      };
      Dates.each(S('#laydate_MM .laydate_tab'), function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          Dates.stopmp(ev).reshow();
          log.tabMonth(i);

          // dsj ALPS-2018 选择月, 界面显示更新
          Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]], true);
        });
      });

      //选择月
      Dates.each(S('#laydate_ms span'), function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          Dates.stopmp(ev).reshow();
          if (!Dates.hasClass(this, as[1])) {
            Dates.viewDate(Dates.ymd[0], this.getAttribute('m') | 0, Dates.ymd[2]);

            // dsj ALPS-2018 选择月, 界面显示更新
            Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]], true);
          }
        });
      });

      //选择日
      Dates.each(S('#laydate_table td'), function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          if (!Dates.hasClass(this, as[1])) {
            Dates.stopmp(ev);
            Dates.creation([this.getAttribute('y') | 0, this.getAttribute('m') | 0, this.getAttribute('d') | 0]);
          }
        });
      });

      //清空
      as.oclear = S('#laydate_clear');
      Dates.on(as.oclear, 'click', function () {
        Dates.elem[as.elemv] = '';
        Dates.close();
      });

      //今天
      as.otoday = S('#laydate_today');
      Dates.on(as.otoday, 'click', function () {
        var now = new Date();
        // 2016-09-23 18:20:54 修复选中今天choose方法得不到数据
        Dates.creation([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
        //Dates.elem[as.elemv] = laydate.now(0,Dates.options.format);
        //Dates.creation([Dates.ymd[0], Dates.ymd[1]+1, Dates.ymd[2]]);
      });

      //确认
      as.ok = S('#laydate_ok');
      Dates.on(as.ok, 'click', function () {
        if (Dates.valid) {
          Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
        }
      });

      //选择时分秒
      log.times = S('#laydate_time');
      Dates.hmsin = log.hmsin = S('#laydate_hms input');
      log.hmss = ['小时', '分钟', '秒数'];
      log.hmsarr = [];

      //生成时分秒或警告信息
      Dates.msg = function (i, title) {
        var str = '<div class="laydte_hsmtex">' + (title || '提示') + '<span>×</span></div>';
        if (typeof i === 'string') {
          str += '<p>' + i + '</p>';
          Dates.shde(S('#' + as[0]));
          Dates.removeClass(log.times, 'laydate_time1').addClass(log.times, 'laydate_msg');
        } else {
          if (!log.hmsarr[i]) {
            str += '<div id="laydate_hmsno" class="laydate_hmsno">';
            Dates.each(new Array(i === 0 ? 24 : 60), function (i) {
              str += '<span>' + i + '</span>';
            });
            str += '</div>'
            log.hmsarr[i] = str;
          } else {
            str = log.hmsarr[i];
          }
          Dates.removeClass(log.times, 'laydate_msg');
          Dates[i === 0 ? 'removeClass' : 'addClass'](log.times, 'laydate_time1');
        }
        Dates.addClass(log.times, 'laydate_show');
        log.times.innerHTML = str;
      };

      log.hmson = function (input, index) {
        var span = S('#laydate_hmsno span'), set = Dates.valid ? null : 1;
        Dates.each(span, function (i, elem) {
          if (set) {
            Dates.addClass(elem, as[1]);
          } else if (Dates.timeVoid(i, index)) {
            Dates.addClass(elem, as[1]);
          } else {
            Dates.on(elem, 'click', function (ev) {
              if (!Dates.hasClass(this, as[1])) {
                input.value = Dates.digit(this.innerHTML | 0);

                // dsj ALPS-2018 选择时/分/秒后, 界面显示更新
                Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]], true);
              }
            });
          }
        });
        Dates.addClass(span[input.value | 0], 'laydate_click');
      };

      //展开选择
      Dates.each(log.hmsin, function (i, elem) {
        Dates.on(elem, 'click', function (ev) {
          Dates.stopmp(ev).reshow();
          Dates.msg(i, log.hmss[i]);
          log.hmson(this, i);
        });
      });

      Dates.on(doc, 'mouseup', function () {
        var box = S('#' + as[0]);
        if (box && box.style.display !== 'none') {
          Dates.check() || Dates.close();
        }
      }).on(doc, 'keydown', function (event) {
        event = event || win.event;
        var codes = event.keyCode;

        //如果在日期显示的时候按回车
        if (codes === 13 && Dates.elem) {
          Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
        }
      });
    };

    Dates.init = (function () {
      Dates.use('need');
      Dates.use(as[4] + config.skin, as[3]);
      Dates.skinLink = Dates.query('#' + as[3]);
    }());

//重置定位
    laydate.reset = function () {
      (Dates.box && Dates.elem) && Dates.follow(Dates.box);
    };

//返回指定日期
    laydate.now = function (timestamp, format) {
      var De = new Date((timestamp | 0) ? function (tamp) {
        return tamp < 86400000 ? (+new Date + tamp * 86400000) : tamp;
      }(parseInt(timestamp)) : +new Date);
      return Dates.parse(
        [De.getFullYear(), De.getMonth() + 1, De.getDate()],
        [De.getHours(), De.getMinutes(), De.getSeconds()],
        format
      );
    };

//皮肤选择
    laydate.skin = chgSkin;

//内部函数
    function chgSkin(lib) {
      //Dates.skinLink.href = Dates.getPath + as[4] + lib + as[5];
    };
  }(window);
})();
/**
 * Created by songjian on 2016/5/18.
 * @ 开关控件
 */
(function () {
    angular.module('hd.switch',[])
        .directive('hdSwitch', hdSwitchFunc);
    function hdSwitchFunc() {
        return {
            restrict: 'AE',
            replace: true,
            require:["?ngModel"],
            transclude: true,
            scope:{
                disabled:'=ngDisabled'
            },
            template: '<div class="hdSwitch"><input type="checkbox" ng-model="model" name="{{checkboxName}}"/><label></label></div>',
            compile: function(element, attrs) {
                element.find("input").attr("ng-true-value",attrs.ngTrueValue);
                element.find("input").attr("ng-false-value",attrs.ngFalseValue);
                return function ($scope, element, attrs,ctrls) {
                    var ngModel = ctrls[0];
                    $scope.trueValue = attrs.ngTrueValue;
                    $scope.falseValue = attrs.ngFalseValue;
                    $scope.checkboxName = attrs.name;

                    var timestamp = hdUtils.getUuid();
                    element.find("input").attr("id","hdSwitchInput-"+timestamp);
                    element.find("label").attr("for","hdSwitchInput-"+timestamp);

                    ngModel.$render = function() {
                        $scope.model = ngModel.$viewValue;
                    };
                    $scope.$watch("model",function(){
                        ngModel.$setViewValue($scope.model);
                    });
                };
            }
        }
    }
})();


/**
 * Created by ckj on 2017/7/3.
 */
(function () {
    angular.module('hd.page',[])
        .directive('hdPage', function () {
            return {
                restrict: 'AE',
                template:'<div class="pagination"><ul class="page" maxshowpageitem="5" pagelistcount="10" id="page"></ul><select style="display: inherit;height: 24px;width: 50px"><option>10</option><option>30</option><option>50</option></select><span class="sum" style="position: relative;top: -26px;"><span id="allTotal">0</span> <span class="jump">跳转至<input class="pageCount" maxlength="4" id="whichPage" hdFix="0" hdMin="1" onkeypress="return window.hdUtils.digitChk(this)" onchange="window.hdUtils.digitLmt(this)">页<button btnPage id="confirmId" onclick="return (!isNaN($(\'input[class=pageCount]\').val()))">确定</button></span></span></div>',
                replace: true,
                scope:{
                    "listcount":"@",
                    "ispagetoone":"@"
                },
                link: function (scope, element,attr) {
                    /**
                     * 每页的点击事件
                     * @param currentNum
                     */
                    function eachPageEvent(currentNum,pageSize,id) {
                        scope.$parent.eachPageEvent(currentNum,pageSize,id);
                    }
                    if(attr.id){
                        element.find('ul').attr('id','').attr('id',attr.id);
                    }
                    //分页初始化
                    if(attr.id){
                        element.find('#'+attr.id).initPage(0,1,eachPageEvent,false);
                    }else{
                        element.find('#page').initPage(0,1,eachPageEvent,false);//兼容上个版本
                    }
                    /**
                     * 监听点击搜索(为了修复先点击到非第一页，然后直接点击搜索，由于总条数没变化，所以下面的change事件无法触发)
                     */
                    scope.$watch('ispagetoone',function (newValue,oldValue) {
                        if(newValue != oldValue){
                            if(attr.id){
                                element.find('#'+attr.id).setNewTotal(scope.listcount);
                            }else{
                                element.find('#page').setNewTotal(scope.listcount);
                            }
                        }
                    });
                    /**
                     * 监听总条数变化
                     */
                    scope.$watch('listcount',function (newValue,oldValue) {
                        console.log(newValue+"-----"+oldValue);
                        if(newValue != oldValue){
                            if(attr.id){
                                element.find('#'+attr.id).setNewTotal(newValue);
                            }else{
                                element.find('#page').setNewTotal(newValue);
                            }
                        }
                    });
                }
            };
        })
})();
$.fn.extend({
  "initPage":function(listCount,currentPage,fun,isCallback){
    page.classArr.push($(this).selector);//收集实例化对象
    page.classArr[$(this).selector] = 1;//初始化选中第一页
    page.classArr[$(this).selector + 'page'] = listCount;//记录总条数
    page.classArr[$(this).selector + 'fun'] = fun;//记录各自的回调方法
    page.classArr[$(this).selector + 'callback'] = isCallback;//记录各自的是否实例化
    page.classArr[$(this).selector + 'pageChange'] = 10;
    console.log(page.classArr);
    var maxshowpageitem = $(this).attr("maxshowpageitem");//最大显示标签页个数
    if(maxshowpageitem!=null&&maxshowpageitem>0&&maxshowpageitem!=""){
      page.maxshowpageitem = maxshowpageitem;
    }
    var pagelistcount = $(this).attr("pagelistcount");//每页请求的条数
    if(pagelistcount!=null&&pagelistcount>0&&pagelistcount!=""){
      page.pagelistcount = pagelistcount;
    }
    //总条数处理
    if(page.classArr[$(this).selector + 'page']<0){
      page.classArr[$(this).selector + 'page'] = 0;
    }
    //初始化默认页处理
    if(parseInt(page.classArr[$(this).selector])<=0){
      page.classArr[$(this).selector]=1;
    }
  },
  "setNewTotal":function (total,flag) {
    page.classArr[$(this).selector + 'page'] = parseInt(total);//记录总条数
    // page.classArr[$(this).selector] = 1;
    if(!flag){
      page.isFirst = 1;
    }

    // page.newTotal = parseInt(total);
    $(this).siblings('span').children().eq(1).children().eq(1).unbind('click');
    page.setPageListCount($(this),null,null, page.classArr[$(this).selector + 'fun'],page.classArr[$(this).selector + 'callback']);

    page.initConfirmEvent($(this),null,null,page.classArr[$(this).selector + 'fun']);

    page.initPageChangeEvent($(this),page.classArr[$(this).selector + 'fun']);
  },
  "setFirstSelect":function () {
    page.isFirst = 1;
  }
});
var  page = {
  "isFirst":"",
  "classArr":[],
  // "maxshowpageitem":5,//最多显示的页码个数
  "pagelistcount":10,//每一页显示的内容条数
  /**
   * 初始化分页界面
   * @param listCount 列表总量
   */
  "initWithUl":function(target,listCount,currentPage){
    var pageCount = 1;
    if(page.classArr[$(target).selector + 'page']>=0){
      pageCount = page.classArr[target.selector + 'page']%parseInt(page.classArr[target.selector + 'pageChange'])>0?parseInt(page.classArr[target.selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange']))+1:parseInt(page.classArr[target.selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange']));
    }
    var appendStr = page.getPageListModel(target,pageCount,parseInt(page.classArr[target.selector]));
    target.html(appendStr);
  },
  /**
   * 设置列表总量和当前页码
   * @param listCount 列表总量
   * @param currentPage 当前页码
   */
  "setPageListCount":function(target,listCount,currentPage,fun,isCallback){

    page.classArr[$(target).selector + 'page'] = parseInt(page.classArr[$(target).selector + 'page']);
    page.initWithUl(target,page.classArr[$(target).selector + 'page'],parseInt(page.classArr[target.selector]));
    target.siblings('span').children().eq(0).text("共"+page.classArr[$(target).selector + 'page']+"条");
    page.initPageEvent(target,page.classArr[$(target).selector + 'page'],fun);
    if(page.classArr[target.selector + 'callback']){
      console.log(page.classArr);
      fun(parseInt(page.classArr[target.selector]),page.classArr[$(target).selector + 'pageChange'],target.selector);
      target.siblings('span').children().eq(1).children().eq(0).val('');
      page.classArr[target.selector + 'callback'] = false;
    }

  },
  /**
   * li的点击事件
   * @param target
   * @param listCount
   * @param fun
   */
  "initPageEvent":function(target,listCount,fun){
    target.children('li[class="pageItem"]').on("click",function(){
      page.isFirst = '';
      page.classArr[target.selector] = $(this).attr("page-data");
      console.log(page.classArr[target.selector]);
      page.classArr[target.selector + 'callback'] = true;
      page.setPageListCount(target,page.classArr[$(target).selector + 'page'],$(this).attr("page-data"),fun,true);

    });
  },
  /**
   * 确定事件
   * @param target
   * @param listCount
   * @param currentPage
   * @param fun
   */
  "initConfirmEvent":function (target,listCount,currentPage,fun) {
    target.siblings('span').children().eq(1).children().eq(1).bind("click",function () {
      var reg = new RegExp("^[0-9]*$");
      var inputValue = target.siblings('span').children().eq(1).children().eq(0).val();
      if(inputValue && reg.test(inputValue)){
        if(parseInt(page.classArr[$(target).selector + 'page'])%parseInt(page.classArr[target.selector + 'pageChange']) == 0){
          if(parseInt(inputValue) <=0 || parseInt(inputValue) > (parseInt(page.classArr[$(target).selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange'])))){
            target.siblings('span').children().eq(1).children().eq(0).val((parseInt(page.classArr[$(target).selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange']))));
            page.isFirst = '';
            page.classArr[target.selector + 'callback'] = true;
            page.classArr[target.selector] = parseInt(target.siblings('span').children().eq(1).children().eq(0).val());
            page.setPageListCount(target,page.classArr[$(target).selector + 'page'],parseInt(target.siblings('span').children().eq(1).children().eq(0).val()),fun,true);
          }else{
            page.isFirst = '';
            page.classArr[target.selector + 'callback'] = true;
            page.classArr[target.selector] = parseInt(inputValue);
            page.setPageListCount(target,page.classArr[$(target).selector + 'page'],parseInt(inputValue),fun,true);
          }
        }else{
          if(parseInt(inputValue) <=0 || parseInt(inputValue) > (parseInt(page.classArr[$(target).selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange'])))+1){
            target.siblings('span').children().eq(1).children().eq(0).val((parseInt(page.classArr[$(target).selector + 'page']/parseInt(page.classArr[target.selector + 'pageChange'])))+1);
            page.isFirst = '';
            page.classArr[target.selector + 'callback'] = true;
            page.classArr[target.selector] = parseInt(target.siblings('span').children().eq(1).children().eq(0).val());
            page.setPageListCount(target,page.classArr[$(target).selector + 'page'],parseInt(target.siblings('span').children().eq(1).children().eq(0).val()),fun,true);
          }else{
            page.isFirst = '';
            page.classArr[target.selector + 'callback'] = true;
            page.classArr[target.selector] = parseInt(inputValue);
            page.setPageListCount(target,page.classArr[$(target).selector + 'page'],parseInt(inputValue),fun,true);
          }
        }
      }else{
        page.isFirst = '';
        page.classArr[target.selector + 'callback'] = true;
        page.classArr[target.selector] = 1;
        page.setPageListCount(target,page.classArr[$(target).selector + 'page'],parseInt(inputValue),fun,true);
      }

    })
  },
  /**
   * 初始化pageChange事件
   */
  "initPageChangeEvent":function (target,fun) {
    target.siblings('select').bind('change',function () {
      $(target).siblings('span').children().eq(1).children().eq(1).unbind('click');
      page.isFirst = 1;
      page.classArr[target.selector + 'callback'] = true;
      page.classArr[$(target).selector + 'pageChange'] = target.siblings('select').val();

      page.setPageListCount(target,null,null, page.classArr[$(target).selector + 'fun'],page.classArr[$(target).selector + 'callback']);

      page.initConfirmEvent(target,null,null,page.classArr[$(target).selector + 'fun']);
      if(page.classArr[target.selector + 'callback']){
        fun(parseInt(page.classArr[target.selector]),page.classArr[$(this).selector + 'pageChange'],target.selector);
        target.siblings('span').children().eq(1).children().eq(0).val('');
        page.classArr[target.selector + 'callback'] = false;
        console.log(target.siblings('select').val());
      }

    });

  },
  /**
   * 渲染
   * @param target
   * @param pageCount
   * @param currentPage
   * @returns {string}
   */
  "getPageListModel":function(target,pageCount,currentPage){
    var prePage = parseInt(page.classArr[target.selector])-1;
    var nextPage = parseInt(page.classArr[target.selector])+1;
    var prePageClass ="pageItem";
    var nextPageClass = "pageItem";
    if(prePage<=0){
      prePageClass="pageItemDisable";
    }
    if(nextPage>pageCount){
      nextPageClass="pageItemDisable";
    }
    var appendStr ="";
    appendStr+="<li class='"+prePageClass+"' page-data='"+prePage+"' page-rel='prepage'>&lt;</li>";
    var showPageNum = parseInt(page.maxshowpageitem);
    if(pageCount<showPageNum){
      showPageNum = pageCount;
    };
    var minus=(3<=(pageCount+1))?3:(pageCount+1);
    if(page.isFirst == 1){
      page.classArr[target.selector] = 1;
    }
    for(var k=1;k<minus;k++){
      var itemPageClass = "pageItem";
      if(k==parseInt(page.classArr[target.selector])){
        itemPageClass = "pageItemActive";
      }
      appendStr+="<li class='"+itemPageClass+"' page-data='"+k+"' page-rel='itempage'>"+k+"</li>";
    }
    var isOmit=true;

    if(parseInt(page.classArr[target.selector])>=2){
      var itemPageClass = "pageItem";
      var preCurrentPage=parseInt(page.classArr[target.selector])-1;
      var nextCurrentPage=parseInt(page.classArr[target.selector])+1;
      if(preCurrentPage>=3){
        if(preCurrentPage>3){
          appendStr+="<li >...</li>";
        }
        appendStr+="<li class='"+itemPageClass+"' page-data='"+preCurrentPage+"' page-rel='itempage'>"+preCurrentPage+"</li>";
      }
      if((2<parseInt(page.classArr[target.selector]))&&(parseInt(page.classArr[target.selector])<=pageCount)){

        appendStr+="<li class='pageItemActive' page-data='"+currentPage+"' page-rel='itempage'>"+parseInt(page.classArr[target.selector])+"</li>";
      }
      if((2<nextCurrentPage)&&(nextCurrentPage<pageCount)){
        appendStr+="<li class='"+itemPageClass+"' page-data='"+nextCurrentPage+"' page-rel='itempage'>"+nextCurrentPage+"</li>";
        if(nextCurrentPage<(pageCount-1)){
          appendStr+="<li >...</li>";
        }
        isOmit=false;
      }

    }
    if((parseInt(page.classArr[target.selector])<(pageCount-1))&&isOmit){
      appendStr+="<li >...</li>";
    }
    if(pageCount>=3&&parseInt(page.classArr[target.selector])<pageCount){
      appendStr+="<li class='"+nextPageClass+"' page-data='"+pageCount+"' page-rel='lastpage'>"+pageCount+"</li>";
    }
    appendStr+="<li class='"+nextPageClass+"' page-data='"+nextPage+"' page-rel='nextpage'>&gt;</li>";

    return appendStr;

  }
};
/**
 * Created by dsj on 2017/7/28.
 */



/*
 * hdMultiple 控件初始化
 * 参数: hdId 实例名称, 即返回对象数组的名称
 * 可提取内容: hdMultipleObj.hdID, 例如传入的hdId='instanceId', 则可取值: hdMultipleObj.instanceId.list
 * */
var initHdMultiple = function (hdId) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');

    // 创建全局变量
    if (window.hdMultipleObj == null) {
      window.hdMultipleObj = {};
      window.hdMultipleObjText = {};
    }

    // 初始化 数据结构对象
    delete hdMultipleObj[hdId];
    hdMultipleObj[hdId] = {"list": [], "initList": []};

    // 初始化 选择显示对象
    delete hdMultipleObjText[hdId];
    if (comObj.find('option').attr('initText') == null || comObj.find('option').attr('initText') == '') {
      comObj.find('option').attr('initText', comObj.find('option').text())
    }
    hdMultipleObjText[hdId] = {"title": comObj.find('option').attr('initText'), "list": []};

    // select框的显示信息初始化
    comObj.find('option').text(hdMultipleObjText[hdId].title);
    comObj.find('select').attr('title', hdMultipleObjText[hdId].title);

    // 绑定select框, 指定命名, 允许开发人员实际应用时, 可以继续进行click的其他事件
    comObj.find('select').unbind('click.hdMultipleContentToggle');
    comObj.find('select').bind('click.hdMultipleContentToggle', function () {
      hdMultipleContentToggle(hdId)
    });

    // 绑定select控件失去焦点事件, 失去焦点后, 列表框消失
    comObj.find('select').attr('hover', 'in');

    // 失去焦点事件
    comObj.find('select').unbind('blur.hdMultiple');
    comObj.find('select').bind('blur.hdMultiple', function () {
      hdMultipleContentHide(hdId)
    });

    // 按键事件
    comObj.find('select').unbind('keydown.hdMultiple');
    comObj.find('select').bind('keydown.hdMultiple', function() {
      return hdMultipleSearchKeyDown(hdId);
    });

    // 绑定select控件的键盘事件, enter 和 space 等同 点击
    comObj.find('select').unbind('keypress.hdMultiple');
    comObj.find('select').bind('keypress.hdMultiple', function () {
      if (event.keyCode == '13' || event.keyCode == '32') {
        $(this).click();
        return false;
      }
    });

    // 绑定控件的移入移出事件, 当鼠标不在控件中, 点击一下后, 列表框消失
    comObj.unbind('mouseover');
    comObj.unbind('mouseout');
    comObj.bind('mouseover', function () {
      comObj.find('select').attr('hover', 'in');
    });
    comObj.bind('mouseout', function () {
      comObj.find('select').attr('hover', 'out');
    });

    // 绑定全选, 清除选择
    comObj.find('a[checkAll]').unbind('click');
    comObj.find('a[checkNone]').unbind('click');
    comObj.find('a[checkAll]').bind('click', function () {
      hdMultipleCheckBatch(hdId, true)
    });
    comObj.find('a[checkNone]').bind('click', function () {
      hdMultipleCheckBatch(hdId, false)
    });

    // 初始化以选项目的数字
    comObj.find('span').text('0');

    // 如果有初始化的值
    if (arguments[1] != null) {
      var initObj = arguments[1];
      for (var i = 0; i < initObj.length; i++) {
        hdMultipleObj[hdId].initList.push(initObj[i])
      }
    }

    // 等angular渲染完成后处理 选项 的绑定
    setTimeout("hdMultipleBindTr('" + hdId + "')", 10);
  }
  catch (err) {
    if (console) console.error('hdMultiple.initHdMultiple err:' + err.message);
  }
};

// 选项的绑定
var hdMultipleBindTr = function (hdId) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');

    // checkBox框的初始化
    comObj.find('input[type=checkbox]').each(function () {
      this.checked = false;
    });

    comObj.find('tr[itemObj]').removeClass('singleSelect');
    comObj.find('tr[itemObj]').each(function () {
      // 绑定 click
      $(this).unbind('click');
      $(this).bind('click', function () {
        hdMultipleCheck(hdId, $(this))
      });

      // 绑定 mouseover 样式
      $(this).unbind('mouseover mouseout');
      $(this).bind('mouseover', function () {
        $(this).addClass('getHover');
      });
      $(this).bind('mouseout', function () {
        $(this).removeClass('getHover');
      });

      // 处理初始化值
      for (var i = 0; i < hdMultipleObj[hdId].initList.length; i++) {
        // angular 的数组对象会自动增加 $$hashKey 属性, 删除, 否则判断不正常
        if (hdMultipleObj[hdId].initList[i].$$hashKey) {
          delete hdMultipleObj[hdId].initList[i].$$hashKey;
        }
        // 比较, 赋值 : 数据准备, 因为数组的成员可能是对象, 也可能是字符串(数字)
        var sValue = '';
        if (hdMultipleObj[hdId].initList[i] instanceof Object) {
          sValue = JSON.stringify(hdMultipleObj[hdId].initList[i])
        }
        else {
          sValue = hdMultipleObj[hdId].initList[i];
        }
        // 比较, 赋值
        if (sValue == $(this).attr('itemObj')) {
          hdMultipleCheck(hdId, $(this));
        }
      }
    });

    // 如果 下拉选择控件是"只读"的
    if (comObj.attr('readonly') != null) {
      // 去掉项目的点击事件
      comObj.find('tr[itemObj]').unbind('click');

      // 去掉"全选", "全否"
      comObj.find('a').hide();
    }

    // 如果是单选
    if (comObj.attr('single') != null) {
      // 去掉项目的复选框
      comObj.find('tr[itemObj]').find('td:first').hide();

      // 去掉 "全选"
      comObj.find('a[checkAll]').hide();
    }

    // 如果有限制具体的复选数量, 则去掉 "全选"
    if (comObj.attr('maxCount') && !isNaN(comObj.attr('maxCount')) && comObj.attr('maxCount') > 0 && comObj.attr('maxCount') < comObj.find('tr[itemObj]').length) {
      // 去掉 "全选"
      comObj.find('a[checkAll]').hide();
    }

    // 是否需要搜索框
    if (comObj.attr('needSearch') != null) {
      // 如果控件不存在搜索框, 则 插入
      if (comObj.find('input[hdMultipleSearch]').length == 0) {
        var searObj = '<div hdMultipleSearch>'
          + '<input type="text" hdMultipleSearch maxlength="32" >'
          + '<i class="iconfont icon-fangdajing"></i>'
          + '</div>';
        comObj.find('div[hdMultipleContent]').prepend(searObj);
      }

      // 失去焦点事件
      comObj.find('select').unbind('blur.hdMultiple');
      comObj.find('input[hdMultipleSearch]').unbind('blur');
      comObj.find('input[hdMultipleSearch]').bind('blur', function () {
        hdMultipleContentHide(hdId)
      });

      // 按键事件
      comObj.find('select').unbind('keydown.hdMultiple');
      comObj.find('input[hdMultipleSearch]').unbind('keydown.hdMultiple');
      comObj.find('input[hdMultipleSearch]').bind('keydown.hdMultiple', function() {
        return hdMultipleSearchKeyDown(hdId);
      });

      // 修改值事件
      comObj.find('input[hdMultipleSearch]').bind('input propertychang', function() {
        hdMultipleSearchBefore(hdId);
      });
    }
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleBindTr err:' + err.message);
  }
};

/*
 * hdMultiple 控件中选择或取消一个项目的操作
 * */
var hdMultipleCheck = function (hdId, obj) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');

    // 判断是否有多选的输入限制
    if (comObj.attr('maxCount') && !isNaN(comObj.attr('maxCount')) && comObj.attr('maxCount') > 0) {
      if (hdMultipleObj[hdId].list.length >= comObj.attr('maxCount')) {
        if (!obj.find('input[type=checkbox]').get(0).checked) {
          return false;
        }
      }
    }

    // 如果是单选
    if (comObj.attr('single') != null) {
      hdMultipleObj[hdId].list = [];
      hdMultipleObjText[hdId].list = [];

      try {
        if (!isNaN(obj.attr('itemObj'))) {
          hdMultipleObj[hdId].list.push(obj.attr('itemObj'));
        }
        else {
          hdMultipleObj[hdId].list.push(JSON.parse(obj.attr('itemObj')));
        }
      }
      catch (e) {
        hdMultipleObj[hdId].list.push(obj.attr('itemObj'));
      }
      hdMultipleObjText[hdId].list.push(obj.find('td[text]').text());

      // 显示文字处理
      hdMultipleCheckText(hdId);

      // 颜色
      comObj.find('tr[itemObj]').removeClass('singleSelect');
      obj.addClass('singleSelect');

      // 位置
      comObj.find('div[hdmultiplelist]').get(0).scrollTop = (comObj.find('tr[itemObj]:not(.notFound)').index(obj) - 5) * 28

      // 隐藏
      comObj.find('select').attr('hover','out');
      hdMultipleContentHide(hdId);
      return true;
    }


    // 复选框打勾或取消
    obj.find('input[type=checkbox]').get(0).checked = !obj.find('input[type=checkbox]').get(0).checked;

    // 如果已选中, 则数组中增加 (选项如果不是对象, 则认为是字符串)
    if (obj.find('input[type=checkbox]').is(':checked')) {
      try {
        if (!isNaN(obj.attr('itemObj'))) {
          hdMultipleObj[hdId].list.push(obj.attr('itemObj'));
        }
        else {
          hdMultipleObj[hdId].list.push(JSON.parse(obj.attr('itemObj')));
        }
      }
      catch (e) {
        hdMultipleObj[hdId].list.push(obj.attr('itemObj'));
      }
      hdMultipleObjText[hdId].list.push(obj.find('td[text]').text());
    }
    // 如果已取消, 则数组中删除
    else {
      for (var i = 0; i < hdMultipleObj[hdId].list.length; i++) {
        // 数据准备, 因为数组的成员可能是对象, 也可能是字符串(数字)
        var sValue = '';
        if (hdMultipleObj[hdId].list[i] instanceof Object) {
          sValue = JSON.stringify(hdMultipleObj[hdId].list[i])
        }
        else {
          sValue = hdMultipleObj[hdId].list[i]
        }
        // 比较, 删除
        if (sValue == obj.attr('itemObj')) {
          hdMultipleObj[hdId].list.splice(i, 1);
          hdMultipleObjText[hdId].list.splice(i, 1);
          break;
        }
      }
    }

    // 显示文字处理
    hdMultipleCheckText(hdId);
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleCheck err:' + err.message);
  }
};

/*
 * hdMultiple 控件中选择或取消全部项目的操作
 * */
var hdMultipleCheckBatch = function (hdId, operType) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');
    var sValue, sClearList = [];

    // 选择框的处理
    // comObj.find('input[type=checkbox]').each(function () {
    comObj.find('tr[itemObj]:not(.notFound)').find('input[type=checkbox]').each(function () {
      this.checked = operType;
    });

    // 数据结构对象的处理: 先全部清空
    comObj.find('tr[itemObj]:not(.notFound)').each(function() {
      // 找到需要删除的数据对象编号
      for (var i=0; i < hdMultipleObj[hdId].list.length; i++) {
        if (hdMultipleObj[hdId].list[i] instanceof Object) {
          sValue = JSON.stringify(hdMultipleObj[hdId].list[i])
        }
        else {
          sValue = hdMultipleObj[hdId].list[i]
        }
        if (sValue == $(this).attr('itemObj')) {
          sClearList.push(i);
        }
      }

      // 根据编号, 删除数据对象
      for (var i=0; i < sClearList.length; i++) {
        hdMultipleObj[hdId].list.splice(sClearList[i], 1);
        hdMultipleObjText[hdId].list.splice(sClearList[i], 1);
      }
    });

    // 数据结构对象的处理: 如果全选, 再全部加上 (选项如果不是对象, 则认为是字符串)
    if (operType) {
      // comObj.find('tr[itemObj]').each(function () {
      comObj.find('tr[itemObj]:not(.notFound)').each(function() {
        try {
          if (!isNaN($(this).attr('itemObj'))) {
            hdMultipleObj[hdId].list.push($(this).attr('itemObj'));
          }
          else {
            hdMultipleObj[hdId].list.push(JSON.parse($(this).attr('itemObj')));
          }
        }
        catch (e) {
          hdMultipleObj[hdId].list.push($(this).attr('itemObj'));
        }
        hdMultipleObjText[hdId].list.push($(this).find('td[text]').text());
      });
    }

    // 显示文字处理
    hdMultipleCheckText(hdId);
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleCheckBatch err:' + err.message);
  }
};

// 显示文字处理: 修改下拉框中第一个Option的内容; 已选择的数量
var hdMultipleCheckText = function (hdId) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');
    var textCount = hdMultipleObjText[hdId].list.length;

    // 已选择的数量
    // comObj.find('div[hdMultipleCtrl]').find('span').text(hdMultipleObjText[hdId].list.length);
    comObj.find('span').text(textCount);

    // option内容显示变更
    var sOptionText = '已选择：';
    for (var i = 0; i < textCount; i++) {
      sOptionText = sOptionText + hdMultipleObjText[hdId].list[i].toString() + '；';
    }

    // 如果没有任何选择, 则显示内容恢复初始, 否则显示内容的变更
    if (textCount == 0) {
      comObj.find('option').text(hdMultipleObjText[hdId].title);
      comObj.find('select').attr('title', hdMultipleObjText[hdId].title);
    }
    else {
      comObj.find('option').text(sOptionText);
      comObj.find('select').attr('title', sOptionText);
    }
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleCheckText err:' + err.message);
  }
};

/*
 *  hdMultiple 控件中点击下拉框
 *  显示 或 隐藏列表项目
 * */
var hdMultipleContentToggle = function (hdId) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');

    comObj.find('select').attr('disabled', 'true');
    comObj.find('div[hdMultipleContent]').toggle();
    comObj.find('select').removeAttr('disabled');

    if (comObj.find('input[hdMultipleSearch]').length == 0) {
      comObj.find('select').focus();
    }
    else {
      comObj.find('input[hdMultipleSearch]').focus();
    }

    // 如果是复选, 位置: 最顶上; 单选, 位置: 选择的行
    if (comObj.attr('single') == null) {
      comObj.find('div[hdmultiplelist]').get(0).scrollTop = 0;
    }
    else {
      comObj.find('div[hdmultiplelist]').get(0).scrollTop = (comObj.find('tr[itemObj]:not(.notFound)').index(comObj.find('.singleSelect')) - 5) * 28
    }

    if (comObj.find('div[hdMultipleContent]').css('display') == 'none') {

      // select 得到焦点, 搜索框清空
      comObj.find('select').focus();
      hdMultipleSearchStartClear(hdId);

      // 回调函数
      if (angular.element(comObj.get(0)).scope().hdMultipleCallBack != null) {
        angular.element(comObj.get(0)).scope().hdMultipleCallBack(hdId);
      }
    }
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleContentToggle err:' + err.message);
  }
};

// hdMultiple 控件, 当不在控件区域内点击, 则隐藏
var hdMultipleContentHide = function (hdId) {
  try {
    var comObj = $('div[hdMultiple=' + hdId + ']');

    if (comObj.find('select').attr('hover') == 'out') {
      if (comObj.find('div[hdMultipleContent]').css('display') != 'none') {
        comObj.find('div[hdMultipleContent]').hide();

        // select 得到焦点, 搜索框清空
        comObj.find('select').focus();
        hdMultipleSearchStartClear(hdId);

        // 回调函数
        if (angular.element(comObj.get(0)).scope().hdMultipleCallBack != null) {
          angular.element(comObj.get(0)).scope().hdMultipleCallBack(hdId);
        }
      }
    }
    else {
      if (comObj.find('input[hdMultipleSearch]').length == 0) {
        comObj.find('select').focus();
      }
      else {
        comObj.find('input[hdMultipleSearch]').focus();
      }
    }
  }
  catch (err) {
    if (console) console.error('hdMultiple.hdMultipleContentHide err:' + err.message);
  }
};

// todo 控件键盘事件 滚动 显示的对象向上, 向下
var hdMultipleSearchKeyDown = function (hdId) {
  var comObj = $('div[hdMultiple=' + hdId + ']');
  var curLine, curLineNext, curLinePrev;
  var key_up = 38, key_down = 40, key_space = 32, key_enter = 13, key_left = 37, key_right = 39, key_tab = 9;

  if (event.keyCode != key_up &&
    event.keyCode != key_down &&
    event.keyCode != key_enter &&
    event.keyCode != key_tab) {
    return true;
  }

  curLine = comObj.find('.getHover');

  // 回车
  if (event.keyCode == key_enter) {
    // 如果有选中行, 则模拟点击, 否则 过
    if (curLine.length > 0) {
      curLine.click();
      return false;
    }
    else {
      return true;
    }
  }

  // tab
  if (event.keyCode == key_tab) {
    comObj.find('select').attr('hover', 'out');
    if (comObj.find('input[hdMultipleSearch]').length > 0) {
      comObj.find('select').focus();
    }
    return true;
  }


  // 下面是移动了
  if (comObj.find('div[hdMultipleContent]').css('display') == 'none') {
    return false;
  }

  // 如果目前没有获得焦点的行, 则默认"显示"的第一行为获得焦点行
  if (curLine.length == 0) {
    comObj.find('tr[itemObj]:not(.notFound)').first().addClass('getHover');
    return false;
  }

  // 如果还是没有, 则返回
  if (curLine.length == 0) {
    return false;
  }

  // 得到上一行/下一行的对象
  curLineNext = curLine.nextAll('tr:not(.notFound)').first();
  curLinePrev = curLine.prevAll('tr:not(.notFound)').first();


  // 向下
  if (event.keyCode == key_down && curLineNext.length > 0) {
    curLineNext.addClass('getHover');
    curLine.removeClass('getHover');
    comObj.find('div[hdmultiplelist]').get(0).scrollTop = (comObj.find('tr[itemObj]:not(.notFound)').index(curLine) - 5) * 28
    return false;
  }
  // 向上
  if (event.keyCode == key_up && curLinePrev.length > 0) {
    curLinePrev.addClass('getHover');
    curLine.removeClass('getHover');
    comObj.find('div[hdmultiplelist]').get(0).scrollTop = (comObj.find('tr[itemObj]:not(.notFound)').index(curLine) - 7) * 28
    return false;
  }
};

// 搜索前置, 启动定时器
var hdMultipleSearchBefore = function (hdId) {
  if (hdMultipleObj[hdId].timeOut != null) {
    clearTimeout(hdMultipleObj[hdId].timeOut);
  }
  hdMultipleObj[hdId].timeOut = setTimeout('hdMultipleSearchStart("' + hdId + '")', 300);
};

// 搜索开始
var hdMultipleSearchStart = function (hdId) {
  var comObj = $('div[hdMultiple=' + hdId + ']');
  var lineStr = '';
  var textStr = '';

  // 清理定时器
  delete hdMultipleObj[hdId].timeOut;

  // 开始搜索, 只搜索显示部分
  if (comObj.find('input[hdMultipleSearch]').length > 0) {
    // 去掉移动上的焦点
    comObj.find('tr[itemObj]').removeClass('getHover');

    // 字符串匹配, 没找到的隐藏, 找到的显示, 并对于匹配的内容加背景
    comObj.find('tr[itemObj]').each(function () {
      lineStr = $(this).find('td[text]').text();
      textStr = comObj.find('input[hdMultipleSearch]').val();

      if (lineStr.indexOf(textStr) < 0) {
        $(this).addClass('notFound')
      }
      else {
        lineStr = lineStr.replace(textStr, '<strong>' + textStr + '</strong>');
        $(this).find('td[text]').html(lineStr);
        $(this).removeClass('notFound');
      }
    })
  }
};

// 搜索清除
var hdMultipleSearchStartClear = function (hdId) {
  var comObj = $('div[hdMultiple=' + hdId + ']');
  var lineStr = '';

  comObj.find('input[hdMultipleSearch]').val('');
  comObj.find('tr[itemObj]').removeClass('notFound');
  comObj.find('tr[itemObj]').removeClass('getHover');

  comObj.find('tr[itemObj]').each(function () {
    lineStr = $(this).find('td[text]').text();
    $(this).find('td[text]').html(lineStr);
  })


};
/**
 * Created by dsj on 2017/7/28.
 *
 1.树形单选框  singleCheck
 1.1 可以指定具体哪些节点可以点击 对象属性: isValue
 1.2 点击后, 下拉框隐藏, select 显示内容, 触发callBack

 2.树形单选列表  singleList
 2.1 可以指定具体哪些节点可以点击 对象属性: isValue
 2.2 点击后, 触发callBack
 2.3 宽/高100%, 自带纵向滚动条
 2.4 提供更多的如: 编辑/ 删除等自定义操作, 调用 exCallBack

 3.树形复选框  multipleCheck (multipleCheckRecursion 待继承)
 3.1 可以指定具体哪些节点可以点击 对象属性: isValue
 3.2 点击后, 勾选, select 显示内容
 3.3 离开焦点后, 下拉框隐藏, 触发callBack

 4.树形复选列表  multipleList(multipleListRecursion 待继承)
 4.1 可以指定具体哪些节点可以点击 对象属性: isValue
 4.2 点击后, 勾选,  触发callBack
 4.3 宽/高100%, 自带纵向滚动条
 4.4 提供更多的如: 编辑/ 删除等自定义操作, 调用 exCallBack

 树形复选列表, 带继承关系特征说明
 --- 点击后, 勾选,  触发callBack, 所有子节点跟随当前节点的选择; 所有父节点的选择状态, 收到影响
 *
 * /


 /*
 * inithdTreeform 控件初始化
 * 参数:
 *  1. hdId 实例名称, 即返回对象数组的名称
 *  2. formType 树控件类型: multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck
 *  3. itemObj 树形的数组对象
 *  4. initItemObj 树形初始选中的对象
 *  5. operObj 操作按钮(仅对于List有用)
 *
 * 可提取内容: hdTreeformObj.hdID, 例如传入的hdId='instanceId', 则可取值: hdTreeformObj.instanceId
 * */
var inithdTreeform = function (hdId, formType, itemObj /*, initItemObj, operObj*/) {
  try {
    var comObj = $('div[hdTreeform=' + hdId + ']');
    // 参数1: 判断
    if (comObj.length == 0) {
      // if (console) console.error('hdTreeform.inithdTreeform err:初始化参数hdId错误!');
      return false;
    }

    // 参数2: 类型判断
    var sFormType = 'multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck;';
    formType = formType.toLowerCase();
    if (sFormType.toLowerCase().indexOf(formType) < 0) {
      if (console) console.error('hdTreeform.inithdTreeform err:初始化参数formType错误!');
      return false;
    }

    // 参数3
    var treeObj = null, initObj = null, operButton = null;
    treeObj = JSON.stringify(itemObj);
    treeObj = JSON.parse(treeObj);

    // 参数4
    if (arguments[3] != null) {
      initObj = JSON.stringify(arguments[3]);
      initObj = JSON.parse(initObj);
    }

    // 参数5
    if (arguments[4] != null) {
      operButton = JSON.stringify(arguments[4]);
      operButton = JSON.parse(operButton);
    }

    // 创建全局变量
    if (window.hdTreeformObj == null) {
      window.hdTreeformObj = {};
      window.hdTreeformObjText = {};
    }

    // 初始化 数据结构对象
    delete hdTreeformObj[hdId];
    hdTreeformObj[hdId] = {"list": [], "initList": []};

    // 初始化 选择显示对象
    delete hdTreeformObjText[hdId];
    if (comObj.find('option').attr('initText') == null || comObj.find('option').attr('initText') == '') {
      comObj.find('option').attr('initText',  comObj.find('option').text())
    }
    hdTreeformObjText[hdId] = {"title": comObj.find('option').attr('initText'), "list": []};


    // select框的显示信息初始化
    comObj.find('option').text(hdTreeformObjText[hdId].title);
    comObj.find('select').attr('title', hdTreeformObjText[hdId].title);

    // 绑定select框
    comObj.find('select').unbind('click');
    comObj.find('select').bind('click', function () {
      hdTreeformBoxToggle(hdId)
    });

    // 绑定select控件失去焦点事件, 失去焦点后, 列表框消失
    comObj.find('select').attr('hover', 'in');
    comObj.find('select').unbind('blur');
    comObj.find('select').bind('blur', function () {
      hdTreeformBoxHide(hdId)
    });

    // 绑定select控件的键盘事件, enter 和 space 等同 点击
    comObj.find('select').unbind('keypress');
    comObj.find('select').bind('keypress', function(){
      if (event.keyCode == '13' || event.keyCode == '32') {
        $(this).click();
        return false;
      }
    });

    // 绑定控件的移入移出事件, 当鼠标不在控件中, 点击一下后, 列表框消失
    comObj.unbind('mouseover');
    comObj.unbind('mouseout');
    comObj.bind('mouseover', function () {
      comObj.find('select').attr('hover', 'in');
    });
    comObj.bind('mouseout', function () {
      comObj.find('select').attr('hover', 'out');
    });

    // 绑定全展开, 全收起
    comObj.find('a[expandAll]').unbind('click');
    comObj.find('a[expandNone]').unbind('click');
    comObj.find('a[expandAll]').bind('click', function () {
      hdleafToggleBatch(hdId, true)
    });
    comObj.find('a[expandNone]').bind('click', function () {
      hdleafToggleBatch(hdId, false)
    });

    // 绑定全选, 清除选择
    comObj.find('a[checkAll]').unbind('click');
    comObj.find('a[checkNone]').unbind('click');
    comObj.find('a[checkAll]').bind('click', function () {
      hdTreeformCheckBatch(hdId, true)
    });
    comObj.find('a[checkNone]').bind('click', function () {
      hdTreeformCheckBatch(hdId, false)
    });


    // 树形内容初始化
    hdTreeRender(hdId, formType, treeObj, operButton);

    // 选项的绑定
    hdTreeformBindItem(hdId, formType);

    // 选项的初始化选中值设置
    if (initObj != null) {
      for (var i = 0; i < initObj.length; i++) {
        // angular 的数组对象会自动增加 $$hashKey 属性, 删除, 否则判断不正常
        delete initObj[i].$$hashKey;
        delete initObj[i].icon;
        delete initObj[i].isValue;

        hdTreeformObj[hdId].initList.push(initObj[i])
      }

      hdTreeformInitValue(hdId, formType);
    }


    // 如果 下拉选择控件是"只读"的
    if (comObj.attr('readonly')) {
      // 去掉项目的点击事件
      comObj.find('div[leafItem]').unbind('click');

      // 去掉"全选", "全否"
      comObj.find('a[checkAll]').hide();
      comObj.find('a[checkNone]').hide();
    }

    // 不同类型的复选框的控制 multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck
    if (formType.indexOf('single') >= 0) {
      // 去掉"全选", "全否"
      comObj.find('div[hdTreeformCtrl=check]').hide();
    }

    // 如果是列表, 则去掉不必要的元素
    if (formType.indexOf('list') >= 0) {
      // 去掉 select
      comObj.find('select').hide();

      // 解除隐藏的绑定
      comObj.unbind('mouserover');
      comObj.unbind('mouseout');

      // 下拉内容一直显示
      comObj.find('div[hdTreeform]').css('height','100%');
      comObj.find('div[hdTreeformBox]').show();
      comObj.find('div[hdTreeformBox]').css('position', 'relative');
      comObj.find('div[hdTreeformBox]').css('z-index', '0');
      comObj.find('div[hdTreeformBox]').css('box-shadow', 'none');
      comObj.find('div[hdTreeformBox]').css('height','100%');
      comObj.find('div[hdTreeformRoot]').css('max-height','100%');
      comObj.find('div[hdTreeformRoot]').css('height','100%');
    }

  }
  catch(err) {
    if (console) console.error('hdTreeform.inithdTreeform err:' + err.message);
  }
};


// 树形内容初始化
var hdTreeRender = function(hdId, formType, treeObj, operButton) {
  var comObj = $('div[hdTreeform=' + hdId + ']');
  var leafTemplate = '<div leaf="initId" leafParent="">'
    + '<div leafFlag><i></i></div>'
    + '<div leafOper></div>'
    + '<div leafItem>'
    + '<div leafItemMult canBindCheck></div>'
    + '<div leafItemIcon canBindCheck></div>'
    + '<div leafItemText canBindCheck></div>'
    + '</div>'
    + '</div>';

  // 初始化 tree 根容器
  comObj.find('div[hdTreeformRoot]').html('');

  for (var i = 0; i < treeObj.length; i++) {
    // angular 的数组对象会自动增加 $$hashKey 属性, 删除, 否则判断不正常
    if (treeObj[i].$$hashKey) {
      delete treeObj[i].$$hashKey;
    }

    // 默认容器收缩的
    var leafParent = null, leaf = null;
    var isRoot = false;

    // 找到父容器. 如果没有父容器, 则指定父容器为根容器
    leafParent = comObj.find("div[leaf='" + treeObj[i].pId + "']");
    if (leafParent.length == 0) {
      leafParent = comObj.find('div[hdTreeformRoot]');
      isRoot = true;
    }
    // 在父容器下, 插入新的项目容器
    leafParent.append(leafTemplate);

    // 设置项目容器的内容
    leaf = $("div[leaf=initId]");
    leaf.attr('leaf', treeObj[i].id);
    leaf.attr('leafParent', treeObj[i].pId);
    leaf.find('div[leafItemText]').text(treeObj[i].name);

    // 设置图标 , 如果有用户自定义的图片则应用, 图标的数据从数据对象中删除
    if (treeObj[i].icon) {
      leaf.find('div[leafItemIcon]').append(treeObj[i].icon);
      leaf.find('div[leafItemIcon]').css('width', '20px');
      delete treeObj[i].icon
    }

    // 设置是否有效 , 如果有用户自定义的是否有效, 是否有效的数据从数据对象中删除, 默认有效
    if (treeObj[i].isValue != null) {
      leaf.attr('isValue', treeObj[i].isValue);
      delete treeObj[i].isValue
    }
    else{
      leaf.attr('isValue', true);
    }

    // 复选: 添加复选框
    leaf.find('div[leafItemMult]').append('<div class="hdCheck"><input type="checkbox"><label></label></div>');
    leaf.find('div[leafItemMult]').css('width', '20px');

    // 不同类型的复选框的控制 multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck
    if (formType.indexOf('single') >= 0) {
      leaf.find('div[leafItemMult]').find('div[class="hdCheck"]').hide();
      leaf.find('div[leafItemMult]').css('width', '1px');
    }



    // 绑定数据对象
    leaf.attr('itemObj', JSON.stringify(treeObj[i]));

    // 父容器不是根容器的项目, 默认收缩, 设置父容器可扩展
    if (!isRoot) {
      // 本容器隐藏
      leaf.hide();

      // 父容器设置 可扩展 Falg
      leaf.parent().find('i').first().removeClass();
      leaf.parent().find('i').first().addClass('iconfont icon-xiangyousanjiaoxian');

      // 绑定父容器 可扩展 Falg 事件
      leaf.parent().find('div[leafFlag]').first().unbind('click.falg');
      leaf.parent().find('div[leafFlag]').first().bind('click.falg', function () {
        hdleafToggle($(this))
      });
    }

    // 绑定按钮
    if (operButton != null && leaf.attr('isValue') == 'true') {
      for (var j=0; j<operButton.length; j++) {
        // 添加元素
        if (operButton[j].icon != null && operButton[j].icon != '') {
          leaf.find('div[leafOper]').append('<a no="' + j + '" title="' + operButton[j].text + '">' + operButton[j].icon + '</a>');
        }
        else {
          leaf.find('div[leafOper]').append('<a no="' + j + '" title="' + operButton[j].text + '">' + operButton[j].text + '</a>');
        }

        // 绑定事件
        leaf.find('div[leafOper]').children('a[no="' + j + '"]').bind('click', function(){
          hdTreeformEx(hdId, $(this));
        })

      }

      leaf.find('div[leafItemText]').css('padding-right', j * 25);
    }
  }
};

var hdTreeformEx = function (hdId, obj) {
  var comObj = $('div[hdTreeform=' + hdId + ']');
  var leaf = obj.parent().parent();

  // 回调函数
  if (angular.element(comObj.get(0)).scope().hdTreeformCallBackEx != null) {
    angular.element(comObj.get(0)).scope().hdTreeformCallBackEx(hdId, obj.attr('no'), JSON.parse(leaf.attr('itemObj')));
  }
};

// leaf的项目可扩展 Flag 事件
var hdleafToggle = function(obj) {
  var leaf = obj.parent();

  // 滑动显示/隐藏
  leaf.find("div[leafParent=" + leaf.attr('leaf') + "]").fadeToggle(100);

  // 设置 Flag 显示
  if (obj.find('i').hasClass('icon-xiangyousanjiaoxian')) {
    obj.find('i').removeClass('icon-xiangyousanjiaoxian');
    obj.find('i').addClass('icon-xialasanjiao1-copy-copy');
    return;
  }
  if (obj.find('i').hasClass('icon-xialasanjiao1-copy-copy')) {
    obj.find('i').removeClass('icon-xialasanjiao1-copy-copy');
    obj.find('i').addClass('icon-xiangyousanjiaoxian');
    return;
  }
};

// leaf的项目全展开和收起
var hdleafToggleBatch = function(hdId, operType) {
  var comObj = $('div[hdTreeform=' + hdId + ']');

  // 滑动显示/隐藏
  comObj.find('div[leaf]').each(function() {
    if (operType) {
      if ($(this).parent('div[leaf]').length != 0 ) $(this).fadeIn(100);

      // 设置 Flag 显示
      if ( $(this).find('div[leafFlag]').find('i').first().hasClass('iconfont')) {
        $(this).find('div[leafFlag]').find('i').first().removeClass('icon-xiangyousanjiaoxian');
        $(this).find('div[leafFlag]').find('i').first().addClass('icon-xialasanjiao1-copy-copy');
      }
    }
    else {
      if ($(this).parent('div[leaf]').length != 0 ) $(this).fadeOut(100);

      // 设置 Flag 不显示
      if ( $(this).find('div[leafFlag]').find('i').first().hasClass('iconfont')) {
        $(this).find('div[leafFlag]').find('i').first().removeClass('icon-xialasanjiao1-copy-copy');
        $(this).find('div[leafFlag]').find('i').first().addClass('icon-xiangyousanjiaoxian');
      }
    }
  });
};


// 选项的绑定
var hdTreeformBindItem = function(hdId, formType) {
  try {
    var comObj =  $('div[hdTreeform=' + hdId + ']');

    // 复选 checkBox框的初始化
    comObj.find('input[type=checkbox]').each(function () {
      this.checked = false;
    });


    // 绑定
    comObj.find('div[leafItem]').unbind('click');
    comObj.find('div[leafItem]').bind('click', function () {
      hdTreeformCheck(hdId, formType, $(this))
    });

  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformBindItem err:' + err.message);
  }
};

// 选项的初始化选中值设置, 如果是选中的, 则父节点展开
var hdTreeformInitValue = function(hdId, formType) {
  var comObj =  $('div[hdTreeform=' + hdId + ']');

  comObj.find('div[leafItem]').each(function () {
    // 复选: 如果已经由于集成的原因被打勾了,略过
    if ($(this).find('input[type=checkbox]').first().is(':checked')) {
      return true; // 相当与continue
    }

    for (var i = 0; i < hdTreeformObj[hdId].initList.length; i++) {
      // 比较, 赋值
      if (JSON.stringify(hdTreeformObj[hdId].initList[i]) == $(this).parent().attr('itemObj')) {
        hdTreeformCheck(hdId, formType, $(this));
      }
    }
  });

  comObj.find('div[leaf]').each(function () {
    // 复选: 如果已经被打勾了, 则父节点展开
    if ($(this).find('input[type=checkbox]').is(':checked')) {
      $(this).parent().children('div[leaf]').show();
      if ($(this).parent().find('div[leafFlag]').find('i').first().hasClass('icon-xiangyousanjiaoxian')) {
        $(this).parent().find('div[leafFlag]').find('i').first().removeClass('icon-xiangyousanjiaoxian');
        $(this).parent().find('div[leafFlag]').find('i').first().addClass('icon-xialasanjiao1-copy-copy');
      }
    }
  });
};

/*
 * hdTreeform 控件中选择或取消一个项目的操作
 * */
var hdTreeformCheck = function (hdId, formType, obj) {
  try {
    // 内置: 复选: 遍历所有的子对象 , 自对象的勾选跟随父对象
    function recursionSub(hdId, leafObj, isChecked) {
      leafObj.find('div[leafParent=' + leafObj.attr('leaf') + ']').each(function () {
        recursionSub(hdId, $(this), isChecked);
      });

      // 复选: 复选框打勾或取消
      leafObj.find('div[class=hdCheck]').first().removeAttr('disabled');
      leafObj.find('input[type=checkbox]').first().get(0).checked = isChecked;

      // 设置数据
      setData(hdId, leafObj);
    }

    // 内置: 复选: 遍历所有的父对象
    function recursionParent(hdId, leafObj, checkType /*false: 不选, abstract: 虚选, true: 真选*/) {
      // 父节点不存在, 则停止
      var leafObjParent = leafObj.parent('div[leaf="' + leafObj.attr('leafParent') + '"]');
      if (leafObjParent.length == 0) {
        return;
      }

      var isCheckAll = leafObj.find('input[type=checkbox]').first().is(':checked') && leafObj.find('div[class=hdCheck]').first().attr('disabled') != 'disabled';
      var isCheckAny = leafObj.find('input[type=checkbox]').first().is(':checked');
      var isCheckType = false;


      // 得到同胞们的选择情况 (如果是虚选中的, 则认为 isCheckAll = false)
      leafObj.siblings('div[leaf]').each(function(){
        isCheckAny = isCheckAny || $(this).find('input[type=checkbox]').first().is(':checked');
        isCheckAll = isCheckAll && $(this).find('input[type=checkbox]').first().is(':checked') && ($(this).find('div[class=hdCheck]').first().attr('disabled') != 'disabled')
      });

      if (isCheckAny) {
        isCheckType = 'abstract';
      }
      if (isCheckAll) {
        isCheckType = true;
      }

      // 选择方式
      if (isCheckType == false) {
        leafObjParent.find('div[class=hdCheck]').first().removeAttr('disabled');
        leafObjParent.find('input[type=checkbox]').first().get(0).checked = false;
      }
      if (isCheckType == 'abstract') {
        leafObjParent.find('div[class=hdCheck]').first().attr('disabled', 'disabled');
        leafObjParent.find('input[type=checkbox]').first().get(0).checked = true;
      }
      if (isCheckType == true) {
        leafObjParent.find('div[class=hdCheck]').first().removeAttr('disabled');
        leafObjParent.find('input[type=checkbox]').first().get(0).checked = true;
      }

      // 递归 父节点
      recursionParent(hdId, leafObjParent, isCheckType);

      // 设置数据
      // 不同类型的复选框的控制 multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck
      if (formType.indexOf('recursion') > 0) {
        setData(hdId, leafObjParent);
      }
    }

    // 内置: 单选: 清除数据
    function clearData(hdId) {
      hdTreeformObj[hdId].list = [];
      hdTreeformObjText[hdId].list = [];

      // 颜色
      comObj.find('div[leafItem]').css('background-color', '');

      // 勾选取消
      comObj.find('input[type=checkbox]').each(function() {
        this.checked = false;
      });
    }

    // 内置: 设置数据
    function setData(hdId, leafObj) {
      // 如果是"无价值", 就可以返回了
      if (leafObj.attr('isValue') != 'true') {
        return
      }

      // 先从数组中删除, 避免重复
      for (var i = 0; i < hdTreeformObj[hdId].list.length; i++) {
        // 比较, 删除
        if (JSON.stringify(hdTreeformObj[hdId].list[i]) == leafObj.attr('itemObj')) {
          // 数据
          hdTreeformObj[hdId].list.splice(i, 1);
          hdTreeformObjText[hdId].list.splice(i, 1);

          break;
        }
      }

      // 如果已选中, 则数组中增加
      if (leafObj.find('input[type=checkbox]').first().is(':checked')) {
        // 数据
        hdTreeformObj[hdId].list.push(JSON.parse(leafObj.attr('itemObj')));
        hdTreeformObjText[hdId].list.push(leafObj.find('div[leafItemText]').first().text());

        // 颜色
        if (formType.indexOf('single') >= 0) {
          leafObj.children('div[leafItem]').css('background-color', '#D9EDF7');
        }
      }
    }

    // 得到 leaf 对象
    var comObj =  $('div[hdTreeform=' + hdId + ']');
    var leaf = obj.parent();

    // 复选: 复选框打勾或取消
    // 单选: 其他全部取消, 当前节点如果 isValue 则选中
    // 不同类型的复选框的控制 multipleCheckRecursion; multipleListRecursion; multipleCheck; multipleList; singleList; singleCheck
    if (formType.indexOf('single') >= 0) {
      clearData(hdId);
    }

    // 复选框打勾或取消
    obj.find('div[class=hdCheck]').first().removeAttr('disabled');
    obj.find('input[type=checkbox]').get(0).checked = !obj.find('input[type=checkbox]').get(0).checked;


    // 设置数据
    setData(hdId, leaf);

    // 遍历所有的子对象 , 自对象的勾选跟随父对象
    if (formType.indexOf('recursion') >= 0) {
      recursionSub(hdId, leaf, obj.find('input[type=checkbox]').get(0).checked);


      // 遍历所有的父对象
      recursionParent(hdId, leaf, obj.find('input[type=checkbox]').get(0).checked);
    }

    // 显示文字处理
    hdTreeformCheckText(hdId);

    // 如果有值, 并有回调函数 则回调函数
    if (leaf.attr('isValue') == 'true') {
      // 单选, 非列表, 隐藏下拉框
      if (formType.indexOf('single') >= 0 && formType.indexOf('list') < 0) {
        comObj.find('div[hdTreeformBox]').hide();
      }

      // 回调函数
      if (angular.element(comObj.get(0)).scope().hdTreeformCallBackItem != null) {
        angular.element(comObj.get(0)).scope().hdTreeformCallBackItem(hdId,
          JSON.parse(leaf.attr('itemObj')),
          leaf.find('input[type=checkbox]').first().is(':checked'));
      }
    }
  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformCheck err:' + err.message);
  }
};

/*
 * hdTreeform 控件中选择或取消全部项目的操作
 * */
var hdTreeformCheckBatch = function (hdId, operType) {
  try {
    var comObj = $('div[hdTreeform=' + hdId + ']');

    // 选择框的处理
    comObj.find('div[class=hdCheck]').removeAttr('disabled');
    comObj.find('input[type=checkbox]').each(function () {
      this.checked = operType;
    });

    // 数据结构对象的处理: 先全部清空
    hdTreeformObj[hdId].list = [];
    hdTreeformObjText[hdId].list = [];


    // 数据结构对象的处理: 如果全选, 再全部加上
    if (operType) {
      comObj.find('div[leaf]').each(function () {
        // 如果是"无价值",就不操作数据
        if ($(this).attr('isValue') == 'true') {
          hdTreeformObj[hdId].list.push(JSON.parse($(this).attr('itemObj')));
          hdTreeformObjText[hdId].list.push($(this).find('div[leafItemText]').first().text());
        }
      });
    }

    // 显示文字处理
    hdTreeformCheckText(hdId);
  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformCheckBatch err:' + err.message);
  }
};

// 显示文字处理: 修改下拉框中第一个Option的内容; 已选择的数量
var hdTreeformCheckText = function (hdId) {
  try {
    var comObj = $('div[hdTreeform=' + hdId + ']');
    var textCount = hdTreeformObjText[hdId].list.length;

    // 已选择的数量
    comObj.find('span').text(textCount);

    // option内容显示变更
    var sOptionText = '已选择：';
    for (var i = 0; i < textCount; i++) {
      sOptionText = sOptionText + hdTreeformObjText[hdId].list[i].toString() + '；';
    }

    // 如果没有任何选择, 则显示内容恢复初始, 否则显示内容的变更
    if (textCount == 0) {
      comObj.find('option').text(hdTreeformObjText[hdId].title);
      comObj.find('select').attr('title', hdTreeformObjText[hdId].title);
    }
    else {
      comObj.find('option').text(sOptionText);
      comObj.find('select').attr('title', sOptionText);
    }
  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformCheckText err:' + err.message);
  }
};

/*
 *  hdTreeform 控件中点击下拉框
 *  显示 或 隐藏列表项目
 * */
var hdTreeformBoxToggle = function (hdId) {
  try {
    var comObj = $('div[hdTreeform=' + hdId + ']');

    comObj.find('select').attr('disabled', 'true');
    comObj.find('div[hdTreeformBox]').toggle();
    comObj.find('select').removeAttr('disabled');

    comObj.find('select').focus();

    if (comObj.find('div[hdTreeformBox]').css('display') == 'none') {

      // 复选: 
      // 回调函数
      if (angular.element(comObj.get(0)).scope().hdTreeformCallBack != null) {
        angular.element(comObj.get(0)).scope().hdTreeformCallBack(hdId);
      }
    }
  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformBoxToggle err:' + err.message);
  }
};

// hdTreeform 控件, 当不在控件区域内点击, 则隐藏
var hdTreeformBoxHide = function (hdId) {
  try {
    var comObj = $('div[hdTreeform=' + hdId + ']');

    if (comObj.find('select').attr('hover') == 'out') {
      if (comObj.find('div[hdTreeformBox]').css('display') != 'none') {
        comObj.find('div[hdTreeformBox]').hide();

        // 复选:
        // 回调函数
        if (angular.element(comObj.get(0)).scope().hdTreeformCallBack != null) {
          angular.element(comObj.get(0)).scope().hdTreeformCallBack(hdId);
        }
      }
    }
    else {
      comObj.find('select').focus();
    }
  }
  catch(err) {
    if (console) console.error('hdTreeform.hdTreeformBoxHide err:' + err.message);
  }
};
/**
 * Created by dsj on 2017/8/28.
 */
window.hdInputSearchForSetTimeout = 0;

/*
 * Created by dsj on 2017/08/17.
 * Reference WEBUI-141
 * 初始化
 * 参数:
 * 1. hdId 必选, 实例ID , 目前只支持Input输入框
 * 2. letters 可选, 默认1, 意义: 输入第几个字母, 开始执行回调函数
 * 3. millsecond 可选, 默认300, 意义: 输入后停顿多久, 开始调用回调函数
 * */
function initHdInputSearch(hdId) {
  var letters = 1, millsecond = 300;

  // 初始绑定 hdInputSearchBefore
  var jqueryObj = $('input[hdInputSearch=' + hdId + ']');

  // 参数的判断1
  if (!jqueryObj.length || jqueryObj.length == 0) return false;
  // 参数的判断2
  if (arguments[1] != null && !isNaN(arguments[1])) letters = arguments[1];
  // 参数的判断1
  if (arguments[2] != null && !isNaN(arguments[2])) millsecond = arguments[2];


  // 绑定输入的调用函数 和 按键事件
  jqueryObj.each(function () {
    $(this).unbind('input.hdInputSearch propertychang.hdInputSearch keydown.hdInputSearch');
    $(this).bind('input.hdInputSearch propertychang.hdInputSearch', function () {
      hdInputSearchBefore($(this), letters, millsecond, hdId);
    });
    $(this).bind('keydown.hdInputSearch', function () {
      return hdInputSearchKeyDown($(this), hdId);
    });


  });
}

// 按键事件
function hdInputSearchKeyDown(jqueryObj, hdId) {
  var comObj = $('div[hdInputSearch=' + hdId + ']');

  var curLine, curLineNext, curLinePrev;
  var key_up = 38, key_down = 40, key_space = 32, key_enter = 13, key_left = 37, key_right = 39, key_tab = 9;

  if (event.keyCode != key_up &&
    event.keyCode != key_down &&
    event.keyCode != key_enter &&
    event.keyCode != key_tab) {
    return true;
  }

  curLine = comObj.find('.getHover');

  // 回车
  if (event.keyCode == key_enter) {
    // 如果有选中行, 则模拟点击, 否则 过
    if (curLine.length > 0) {
      curLine.click();
      return false;
    }
    else {
      // 绑定angular的函数
      if (angular.element(jqueryObj.get(0)).scope().hdInputSearchEnter != null) {
        angular.element(jqueryObj.get(0)).scope().hdInputSearchEnter(jqueryObj, hdId);
      }

      // 隐藏
      hdInputSearchHideOnly(jqueryObj, hdId);
      return false;
    }
  }

  if (event.keyCode == key_down && curLine.length == 0) {
    curLine = comObj.find('tr').first();
    curLine.addClass('getHover');
    return true;
  }
  curLineNext = curLine.next();
  curLinePrev = curLine.prev();

  // 向下
  if (event.keyCode == key_down && curLineNext.length > 0) {
    curLineNext.addClass('getHover');
    curLine.removeClass('getHover');
    comObj.get(0).scrollTop = (comObj.find('tr').index(curLine) - 3) * curLineNext.get(0).clientHeight
    return false;
  }
  // 向上
  if (event.keyCode == key_up) {
    if (curLinePrev.length > 0) {
      curLinePrev.addClass('getHover');
      curLine.removeClass('getHover');
      comObj.get(0).scrollTop = (comObj.find('tr').index(curLine) - 5) * curLinePrev.get(0).clientHeight
    }
    else {
      curLine.removeClass('getHover');
    }
    return false;
  }

}


// 开始输入
function hdInputSearchBefore(jqueryObj, letters, millsecond, hdId) {
  var comObj = $('div[hdInputSearch=' + hdId + ']');

  // 既然开始输入正常字符了. 那么原值清空
  hdInputSearchClear(jqueryObj, hdId);

  // 清除已有的延时
  if (hdInputSearchForSetTimeout != 0) {
    clearTimeout(hdInputSearchForSetTimeout);
    hdInputSearchForSetTimeout = 0;
  }

  // 字符串长度判断
  if (jqueryObj.val().length < letters) {
    hdInputSearchHideOnly(jqueryObj, hdId);
    return false;
  }

  // 延时执行开始
  hdInputSearchForSetTimeout = setTimeout(function () {
    hdInputSearchStart(jqueryObj, hdId)
  }, millsecond);
}

// hdInputSearch 控件 开始回调
function hdInputSearchStart(jqueryObj, hdId) {
  hdInputSearchForSetTimeout = 0;

  // 回调函数
  if (angular.element(jqueryObj.get(0)).scope().hdInputSearchStart != null) {
    angular.element(jqueryObj.get(0)).scope().hdInputSearchStart(jqueryObj, hdId);
  }

  // 开始绑定
  setTimeout(function () {
    hdInputSearchBind(jqueryObj, hdId)
  }, 50);
}

// hdInputSearch 控件 绑定选项
function hdInputSearchBind(jqueryObj, hdId) {
  var comObj = $('div[hdInputSearch=' + hdId + ']');

  // 初始化一下父节点
  var jqueryParentObj = jqueryObj.parent();
  var sPosition = jqueryParentObj.css('position');
  if (sPosition == 'inherit' || sPosition == 'initial' || sPosition == 'static') {
    jqueryParentObj.css('position', 'relative');
  }

  // 将组件加入父节点
  jqueryParentObj.append(comObj);

  // 绑定父节点的移入移出事件, 当鼠标不在父节点中, 点击一下后, 列表框消失
  jqueryParentObj.unbind('mouseover.hdInputSearch mouseout.hdInputSearch');
  jqueryParentObj.bind('mouseover.hdInputSearch', function () {
    comObj.attr('hover', 'in');
  });
  jqueryParentObj.bind('mouseout', function () {
    comObj.attr('hover', 'out');
  });

  // 失去焦点事件
  jqueryObj.unbind('blur.hdInputSearch');
  jqueryObj.bind('blur.hdInputSearch', function () {
    hdInputSearchHide(jqueryObj, hdId)
  });

  // 绑定额外行的点击事件
  if (comObj.find('tr[hdInputSearchExFun]').length > 0) {
    comObj.find('tr[hdInputSearchExFun]').unbind('click.hdInputSearch');
    comObj.find('tr[hdInputSearchExFun]').bind('click.hdInputSearch', function () {

      // 隐藏
      hdInputSearchHideOnly(jqueryObj, hdId);

      // 绑定angular的函数
      if (angular.element(jqueryObj.get(0)).scope().hdInputSearchExFun != null) {
        angular.element(jqueryObj.get(0)).scope().hdInputSearchExFun(jqueryObj, hdId);
      }
    });
  }

  // 绑定每行的点击事件
  //comObj.find('tr[itemObj]').unbind('click');
  comObj.off("click.hdInputSearch", 'tr[itemObj]');
  comObj.on("click.hdInputSearch",'tr[itemObj]',function(){
    hdInputSearchCheck(jqueryObj, $(this), hdId);
  });
  //comObj.find('tr[itemObj]').bind('click.hdInputSearch', function () {
  //
  //});

  // 显示控件, 判断位置
  comObj.show();
  comObj.css('top', 'auto');
  if (comObj.get(0).getBoundingClientRect().top + comObj.get(0).getBoundingClientRect().height > document.documentElement.clientHeight) {
    comObj.css('top', 5 - comObj.get(0).getBoundingClientRect().height)
  }

  // 清空焦点样式
  comObj.find('tr').removeClass('getHover');
}

// hdInputSearch 控件 选中
function hdInputSearchCheck(jqueryObj, checkObj, hdId) {
  var comObj = $('div[hdInputSearch=' + hdId + ']');

  // 赋值
  jqueryObj.attr('itemObj', checkObj.attr('itemObj'));

  // 隐藏
  hdInputSearchHideOnly(jqueryObj, hdId);

  // 绑定angular的函数
  if (angular.element(jqueryObj.get(0)).scope().hdInputSearchCheckOne != null) {
    angular.element(jqueryObj.get(0)).scope().hdInputSearchCheckOne(jqueryObj, hdId);
  }
}

function hdInputSearchClear(jqueryObj, hdId) {
  // 赋值
  jqueryObj.attr('itemObj', '');
}

// hdInputSearch 控件, 当不在控件区域内点击, 则隐藏
function hdInputSearchHide(jqueryObj, hdId) {
  try {
    var comObj = $('div[hdInputSearch=' + hdId + ']');
    var jqueryParentObj = jqueryObj.parent();

    if (comObj.attr('hover') == 'out') {
      jqueryObj.unbind('blur.hdInputSearch');
      jqueryParentObj.unbind('mouseover.hdInputSearch mouseout.hdInputSearch');
      comObj.attr('hover', 'out');
      comObj.hide();

      // 绑定angular的函数
      if (angular.element(jqueryObj.get(0)).scope().hdInputSearchCheckNone != null) {
        angular.element(jqueryObj.get(0)).scope().hdInputSearchCheckNone(jqueryObj, hdId);
      }
    }
    else {
      jqueryObj.focus();
    }
  }
  catch (err) {
    if (console) console.error('hdInputSearch.hdInputSearchHide err:' + err.message);
  }
}

// hdInputSearch 控件, 直接隐藏
function hdInputSearchHideOnly(jqueryObj, hdId) {
  try {
    var comObj = $('div[hdInputSearch=' + hdId + ']');
    var jqueryParentObj = jqueryObj.parent();

    jqueryObj.unbind('blur.hdInputSearch');
    jqueryParentObj.unbind('mouseover.hdInputSearch mouseout.hdInputSearch');
    comObj.attr('hover', 'out');
    comObj.hide();
  }
  catch (err) {
    if (console) console.error('hdInputSearch.hdInputSearchHideOnly err:' + err.message);
  }
}
/**
 * Created by dsj on 2017/8/30.
 */
// WEBUI-135 ALPS-3109
/*
 *  Created by dsj on 2017/08/17.
 *  Reference: WEBUI-135 ALPS-3109
 *  通用的判断
 *  commonVerify(@@作用域ID@@)
 *    如果 @@作用域ID@@ 不存在, 则默认作用域为 $('body')
 *  目前主要提供"必填"/"身份证号码规范"的判断
 *
 * */
function commonVerify(scopeId) {
  var verifyPass = true;
  var verifyStr = '';

  // 确定检查的范围
  var verifyScope = $('body');
  if (scopeId != null && $('#' + scopeId).length > 0) {
    verifyScope = $('#' + scopeId);
  }

  // 必填的判断
  verifyScope.find('[hdMust]').each(function(){
    var componentObj = $(this);
    var isPass = false;

    if ($(this).get(0).getBoundingClientRect().width == 0) {
      isPass = true;
      return;
    }

    // 指令的单选框, 复选框的判断, 同名的有任何一个通过, 即符合
    if (($(this).hasClass('hdRadio') || $(this).hasClass('hdCheck')) && $(this).get(0).tagName != 'INPUT') {
      componentObj = componentObj.find('input');
      verifyScope.find('input[name="' + componentObj.attr('name') + '"]').each(function(){
        if ($(this).get(0).checked) {
          isPass = true;
          return;
        }
      });
    }
    // 指令的日期框的判断,
    else if ($(this).hasClass('hdDate') && $(this).get(0).tagName != 'INPUT') {
      componentObj = componentObj.find('input');
      if (componentObj.val() != '') {
        isPass = true;
      }
    }
    // 多选下拉框,
    else if ($(this).attr('hdMultiple') != null) {
      componentObj = componentObj.find('select');
      if (window.hdMultipleObj[$(this).attr('hdMultiple')].list.length > 0) {
        isPass = true;
      }
    }
    // 树形组件
    else if ($(this).attr('hdTreeform') != null) {
      componentObj = componentObj.find('select');
      if (window.hdTreeformObj[$(this).attr('hdTreeform')].list.length > 0) {
        isPass = true;
      }
    }
    // 原始的单选框, 复选框的判断, 同名的有任何一个通过, 即符合
    else if ($(this).get(0).type == 'radio' || $(this).get(0).type == 'checkbox') {
      verifyScope.find('input[name="' + $(this).attr('name') + '"]').each(function(){
        if ($(this).get(0).checked) {
          isPass = true;
          return;
        }
      });
    }
    // 可编辑的DIV
    else if ($(this).attr('contenteditable') != null && $(this).get(0).tagName == 'DIV') {
      if ($(this).html() != '') {
        isPass = true;
      }
    }
    // input/textarea/select 控件是否输入的判断
    else{
      if ($(this).val() != '') {
        isPass = true;
      }
    }

    // 提示的文字 根据不同的可输入控件变化
    if ('text/textarea/password/'.indexOf($(this).get(0).type) >= 0) {
      verifyStr = '请输入' + $(this).attr('hdMust');
    }
    else {
      verifyStr = '请选择' + $(this).attr('hdMust');
    }

    // 判断必填内容
    if (!isPass) {
      // 构造提示对象
      commonVerifyTipCreate($(this), componentObj, verifyStr);

      // 至提示第一个找到的
      verifyPass = false;
      return false;
    }
  });

  if (!verifyPass) return verifyPass;

  // 身份证的判断
  verifyScope.find('[hdIdCard]').each(function() {
    var str = window.hdUtils.idCardValid($(this).val());
    if (str != '') {
      // 构造提示对象
      verifyStr = str;
      commonVerifyTipCreate($(this), $(this), verifyStr);

      // 至提示第一个找到的
      verifyPass = false;
      return false;
    }
  });

  return verifyPass;
}

// 构造提示对象的界面
/*
 *  Created by dsj on 2017/08/17.
 *  Reference: WEBUI-135 ALPS-3109
 *  通用的判断
 *  commonVerifyTipCreate(@@提示的对象@@, @@获得焦点对象@@, @@提示文字@@)
 *  一般 @@提示的对象@@ = @@获得焦点对象@@
 * */
function commonVerifyTipCreate(jqueryObj, focusObj, tipText) {
  // 获得焦点
  if (focusObj.css('visibility') == 'hidden') {
    focusObj.css('visibility', 'visible');
    focusObj.focus();
    focusObj.css('visibility', 'hidden');
  }
  focusObj.focus();

  // 提示对象的定义
  var tipHTML, tipObj;

  // 提示对象的HTML
  $('div[commonVerifyTipObj]').remove();
  tipHTML = ''
    + '<div commonVerifyTipObj style="min-width: 90px;position: fixed; z-index: 9999;">'
    + '<span style="width: 100%; height: 26px; padding: 6px 10px 4px 10px;'
    + ' background-color: #fff7ec; border: 1px solid #ffd248; border-radius: 2px; white-space: nowrap;'
    + ' font-size: 12px; line-height: 26px;">'
    + tipText
    + '</span>'
    + '<img style="position:absolute; z-index: 1; top: 23px; left: 20px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUMxQjlEMDc4MjQzMTFFNzhEMEZCRDBGMkFDN0FENjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUMxQjlEMDg4MjQzMTFFNzhEMEZCRDBGMkFDN0FENjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQzFCOUQwNTgyNDMxMUU3OEQwRkJEMEYyQUM3QUQ2NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzFCOUQwNjgyNDMxMUU3OEQwRkJEMEYyQUM3QUQ2NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjDICqwAAACgSURBVHjaYvz//c00BgaGTAb8YDoTw514AYZv13ArAcndiednYvj/N4Ph+cRHDL9fYioCiYHk/v/NZGJQXfKJ4d/XSIanXX8Z/n1DKAKxwWJAOaAaJrCg6pJjQN0tDM8ngFRAMIgNEgPJAQELkkXNQPe4MbxaZAl123GwGBQwAn2NUHo7RgFIXoTy9IGmPUAovOSB7oUokDgQL0UWBAgwADAkRwuppuGkAAAAAElFTkSuQmCC">'
    + '</div>';

  // 提示对象的创建
  $('body').append(tipHTML);

  // 设置提示位置
  tipObj = $('div[commonVerifyTipObj]');
  tipObj.css('top', jqueryObj.get(0).getBoundingClientRect().top -32);
  tipObj.css('left', jqueryObj.get(0).getBoundingClientRect().left);

  // 监控位置的变化, 一旦位置变化(滚动, 窗口大小变化), 就隐藏
  if (window.varCommonVerifyInterval != null ){
    clearInterval(window.varCommonVerifyInterval);
    window.varCommonVerifyInterval = null;
  }
  window.varCommonVerifyInterval = setInterval(function() {
    if ( parseFloat(jqueryObj.get(0).getBoundingClientRect().top -32).toFixed(0) != parseFloat(tipObj.css('top')).toFixed(0)
      || parseFloat(jqueryObj.get(0).getBoundingClientRect().left).toFixed(0) != parseFloat(tipObj.css('left')).toFixed(0))
    {
      commonVerifyTipClear();
    }
    if (jqueryObj.get(0).getBoundingClientRect().width == 0) {
      commonVerifyTipClear();
    }
  }, 10);


  // 定时3秒, 自动隐藏提示
  if (window.varCommonVerifyTimeOut != null ){
    clearTimeout(window.varCommonVerifyTimeOut);
    window.varCommonVerifyTimeOut = null;
  }
  window.varCommonVerifyTimeOut = setTimeout('commonVerifyTipClear()', 3000);
}

// 销毁提示对象
function commonVerifyTipClear() {
  if (window.varCommonVerifyInterval != null ){
    clearInterval(window.varCommonVerifyInterval);
    window.varCommonVerifyInterval = null;
  }

  $('div[commonVerifyTipObj]').remove();
  clearTimeout(window.varCommonVerifyTimeOut);
  window.varCommonVerifyTimeOut = null;
}

/**
 * Created by songjian on 2017/9/11.
 */
(function () {
  angular.module('hd.autoFocus', [])
    .directive('hdAutoFocus', ["$timeout", function ($timeout) {
      return {
        scope:{
          hdAutoFocus:"@"
        },
        link: function (scope, element) {
          scope.hdAutoFocus = false;
          $timeout(function () {
            if(!scope.hdAutoFocus){
                return;
            }
            if (element.find('input').length) {
              element.find('input')[0].focus();
            } else if (element.find('textarea').length) {
              element.find('textarea')[0].focus();
            } else {
              element[0].focus();
            }
          });
        }
      }
    }])
})();