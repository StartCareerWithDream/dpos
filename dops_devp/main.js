/**
 * Created by songjian on 2017/4/14.
 */
(function(){
  var extAngularUiViewRender= function () {
    var $iframe=getAppIframe();
    $iframe.attr("src","main.html");
    window.dposAngularIframe = $iframe;
  };

  var getAppIframe = (function () {
    var _iframe = null;
    return function () {
      if (!_iframe) {
        _iframe = document.createElement('iframe');
        $(_iframe).css("width", "100%").css("height", "100%")
          .css("position", "absolute").css("z-index", 100).css("border", "none");
        document.getElementById("dpos-angular").appendChild(_iframe);
      }
      return $(_iframe);
    }
  })();
  window.extAngularUiViewRender = extAngularUiViewRender;

})();