/**
 * Created by songjian on 2017/3/7.
 */

(function () {
    angular.module('hd.tab',[])

        .directive('hdTab',function(){
            return {
                restrict : 'A',
                template:'<ul class="{{tabStyle}}" ng-transclude></ul>',
                replace: true,
                require:"?ngModel",
                scope:{
                },
                transclude: true,
                link: function ($scope, element, attrs,ngModel) {
                    $scope.tabStyle=attrs.class;
                    ngModel.$render = function() {
                        element.find("li").removeClass("hd-tab-active");
                        element.find("li[value='"+ngModel.$viewValue+"']").addClass("hd-tab-active");
                    };
                    element.find('li').click(function(){
                        $(this).addClass("hd-tab-active").siblings().removeClass("hd-tab-active");
                        ngModel.$setViewValue($(this).attr("value"));
                    });
                }
            }
        });
})();