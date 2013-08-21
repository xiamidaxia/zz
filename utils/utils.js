/**
 * 一些工具
 * @author by liuwencheng
 * @date 2013-6-3
 */
define(function(require,exports) {
    "use strict"

    /**
     * 获取url问号后边的变量相对应的值
     */
    exports.getUrlData = function(val){
        var reg = new RegExp("(^|&)"+val+"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        return r!=null ? decodeURI(r[2]) : '';
    }
    /**
     * 获取屏幕dpi
     */
    exports.getDPI = function() {
        var arrDPI = new Array();
        if (window.screen.deviceXDPI != undefined) {
            return window.screen.deviceXDPI
            //arrDPI[0] = window.screen.deviceXDPI;
            //arrDPI[1] = window.screen.deviceYDPI;
        }
        else {
            var tmpNode = document.createElement("DIV");
            tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
            document.body.appendChild(tmpNode);
            arrDPI[0] = parseInt(tmpNode.offsetWidth);
            //arrDPI[1] = parseInt(tmpNode.offsetHeight);
            tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI[0]; //只计算宽dpi
    }
    /**
     * 判断浏览器
      */
    exports.sys = (function (ua) {
        var s = {};
        s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
        s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
        s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
        s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
        s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
        s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
        return s;
    })(navigator.userAgent.toLowerCase());
    /**
     *
     */
    exports.pxToInt = function(any){
        return parseInt(any || 0)
    }
})