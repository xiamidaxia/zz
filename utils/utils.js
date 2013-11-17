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
     * 像素转毫米
     * @param {Number}
     * @param {Number || Ignore} 指定dpi
     */
    exports.px2mm = function(num, dpi){
        return num / ( (dpi || exports.getDPI()) / 25.4 )
    }
    /**
     * 像素转毫米
     * @param {Number}
     * @param {Number || Ignore} 指定dpi
     */
    exports.mm2px = function(num, dpi){
        return num / (25.4 / (dpi || exports.getDPI()))
    }
    /**
     * 判断浏览器
      */
/*    exports.sys = (function (ua) {
        var s = {};
        s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
        s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
        s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
        s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
        s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
        s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
        s.LowIE = s.IE6 || s.IE7 || s.IE8;
        return s
    })(navigator.userAgent.toLowerCase());*/
    /**
     *
     */
    exports.pxToInt = function(any){
        return parseInt(any || 0)
    }
    /**
     * 图片高宽适应父类高宽
     * @param {Number}
     * @param {Number}
     * @param {Number}
     * @param {Number}
     * @return {Array} [newWidth, newHeight,ratio] ratio为与原尺寸的比例
     */
    exports.ratioImg = function(imgWidth, imgHeight, parentWidth, parentHeight){
        var ratioX = parentWidth / imgWidth
        var ratioY = parentHeight / imgHeight
        var ratio =  (ratioX < ratioY) ? ratioX : ratioY
        /** 如果超过父类高宽 **/
        if (ratio < 1) {
            return [imgWidth * ratio, imgHeight * ratio, ratio]
        /** 如果不超过返回原图 **/
        } else {
            return [imgWidth, imgHeight, 1]
        }
    }
})