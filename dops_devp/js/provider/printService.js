/**
 * Created by songjian on 2017/6/14.
 * 提供打印服务
 */
(function () {
  angular.module('dposApp')
    .provider('hdPrint', [function () {

      function getPrintServicePort() {
        var protocol = window.top.location.protocol;
        try {
          if (protocol === "https:") {
            return window.top.java.getLodopHttpsPort();
          } else {
            return window.top.java.getLodopHttpPort();
          }
        } catch (e) {
          return 0;
        }
      }

      this.$get = ["hdTip", function (hdTip) {
        var print ={
          loadSuccess: false, // 打印服务加载状态
          port: 0, // 打印服务端口

          getLodopLicense: function () {
            return {
              license: 'C39C29F13F51663659E8EF09F3B92BAA',
              licenseA: 'C94CEE276DB2187AE6B65D56B3FC2848'
            };
          },
          /**
           * 加载打印服务
           */
          load: function (callback) {
            var me = this;
            if (window.location.href.toLocaleLowerCase().indexOf('://localhost') != -1) {//测试
              me.port = 8000;
            }else{
              me.port=getPrintServicePort();
            }

            $.getScript((window.location.protocol + '//localhost:' + me.port) + '/CLodopfuncs.js?priority='
              + Date.now(), function () {
              me.loadSuccess = true;
              if (callback) {
                callback(true)
              }
            });
          },

          getLodop: function () {
            var lodop = getCLodop();
            var license = this.getLodopLicense();
            lodop.SET_LICENSES("", license.license, license.licenseA, "");
            return lodop;
          },

          /**
           * 判断打印机是否加载成功
           *
           * @returns {boolean}
           */
          isLoadSuccess: function () {
            return this.loadSuccess;
          },

          getPort: function () {
            return this.port;
          },
          /**
           * 将data以tpl形式打印出来 模板tpl中的变量固定为data
           *
           */
          print: function (tpl, order, printer) {
            var me = this;
            if (me.loadSuccess) {
              try {
                lodop = me.getLodop();
                if (lodop.webskt && lodop.webskt.readyState === 1) {
                  eval(tpl);
                  if (printer) {
                    lodop.SET_PRINTER_INDEXA(printer);
                  }
                  lodop.SET_PRINT_MODE('RESELECT_PRINTER', true);
                  lodop.PRINT();
                  return true;
                }
              } catch (e) {
                alert(e)
              }
            }
            hdTip.tip('打印机加载失败', 'error');
            return false;
          },
          /**
           * 将data以tpl形式打印出来 模板tpl中的变量固定为data 打印前选择打印机
           */
          printA: function (tpl, order, printer) {
            var me = this;
            if (me.loadSuccess) {
              try {
                lodop = me.getLodop();
                if (lodop.webskt && lodop.webskt.readyState === 1) {
                  eval(tpl);
                  if (printer) {
                    lodop.SET_PRINTER_INDEXA(printer);
                  }
                  lodop.SET_PRINT_MODE('RESELECT_PRINTER', true);
                  lodop.PRINTA();
                  return true;
                }
              } catch (e) {
                alert(e)
              }
            }
            hdTip.tip('打印机加载失败', 'error');
            return false;
          },

          /**
           * 打印预览
           */
          preview: function (tpl, order, printer) {
            var me = this;
            if (me.loadSuccess) {
              try {
                lodop = me.getLodop();
                console.log(lodop.webskt.readyState);
                if (lodop.webskt && lodop.webskt.readyState === 1) {
                  eval(tpl);
                  if (printer) {
                    lodop.SET_PRINTER_INDEXA(printer);
                  }
                  lodop.PREVIEW();
                  return true;
                }
              } catch (e) {
                alert(e)
              }
            }
            hdTip.tip('打印机加载失败', 'error');
            return false;
          },

          /**
           * 获取所有打印机列表
           */
          getPrinters: function () {
            var me = this, printers = [];
            try {
              var lodop = me.getLodop();
              var count = lodop.GET_PRINTER_COUNT();
              for (var i = 0; i < count; i++) {
                printers.push({
                  index: i,
                  name: lodop.GET_PRINTER_NAME(i)
                })
              }
            } catch (e) {
              alert(e)
            }
            return printers;
          },

          addQrCode: function (top, left, size, text) {
            if (typeof(left) == 'string') {
              left = '\"' + left + '\"';
            }
            if (typeof(size) == 'string') {
              size = '\"' + width + '\"';
            }
            if (typeof(text) == 'string') {
              text = '\"' + text + '\"';
            }
            return hdUtils.string.format('lodop.ADD_PRINT_BARCODE({0}, {1}, {2}, {3}, "QRCode", {4});', top,
              left, size, size, text);
          },
          addHtmlElement: function (top, left, width, height, text, align, encode) {
            if (!align) {
              align = 'left';
            }
            if (encode) {
              text = hdUtils.string.htmlEncode(text);
            }
            var div = '<body style=\\"background-color:white;\\">'
              + '<div style=\\"text-align:{0};font-size:9pt;background-color:white;word-wrap:break-word;word-break:break-all;height:100%;border:solid 0 white;\\">{1}</div>'
              + '<body>';
            text = hdUtils.string.format(div, align, text);

            if (typeof(left) == 'string') {
              left = '\"' + left + '\"';
            }
            if (typeof(width) == 'string') {
              width = '\"' + width + '\"';
            }
            if (typeof(text) == 'string') {
              text = '\"' + text + '\"';
            }
            return hdUtils.string.format('lodop.ADD_PRINT_HTM({0}, {1}, {2}, {3}, {4});', top, left, width,
              height, text);
          },
          addTextElement: function (top, left, width, height, text, align, encode, fontName) {
            var result = '';
            if (encode) {
              text = hdUtils.string.htmlEncode(text);
            }
            var isNumeric = $.isNumeric(text);
            if (typeof(left) == 'string') {
              left = '\"' + left + '\"';
            }
            if (typeof(width) == 'string') {
              width = '\"' + width + '\"';
            }
            if (typeof(text) == 'string') {
              text = '\"' + text + '\"';
            }
            result += hdUtils.string.format('lodop.ADD_PRINT_TEXT({0}, {1}, {2}, {3}, {4});', top, left, width,
              height, text);


            if (align == 'right') {
              result += 'lodop.SET_PRINT_STYLEA(0,\"Alignment\",3);';
            } else if (align == 'center') {
              result += 'lodop.SET_PRINT_STYLEA(0,\"Alignment\",2);';
            }
            if (isNumeric) {
              result += hdUtils.string.format('lodop.SET_PRINT_STYLEA(0,\"FontName\",{0});', '\"微软雅黑\"');
              result += hdUtils.string.format('lodop.SET_PRINT_STYLEA(0,\"FontSize\",{0});', 8);
            }
            return result;
          },
          /**
           * 根据指令cmd打开钱箱
           */
          openCashDrawer: function (cmd) {
            var me = this;
            if (!cmd) {
              cmd = SessionMgr.getPosCfg().cashDrawerCmd;
            }
            if (me.loadSuccess) {
              try {
                lodop = me.getLodop();
                if (lodop.webskt && lodop.webskt.readyState === 1) {
                  lodop.SEND_PRINT_RAWDATA(eval('String.fromCharCode(' + cmd + ')'));
                  return true;
                }
              } catch (e) {
              }
            }
            hdTip.tip('打印机加载失败', 'error');
            return false;
          }
        };
        print.load();
        return print
      }]
    }]);
})();

