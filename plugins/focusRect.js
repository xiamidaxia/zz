/**
 * 闪动边框
 *
 * @author by liuwencheng
 * @date 2013-10-21
 */
define(function(require,exports) {
    "use strict"

    var $ = require("jquery");
    $.fn.focusRect = function(noInterval){
        var that = this
        var focusRectData = {}
        if (this.data('focusRectData')) return this //已经有了
        this.data('focusRectData', focusRectData)
        this.css('border', "2px solid red")
        function anim() {
            setTimeout(function(){that.data('focusRectData') && that.css("borderColor","transparent")},100);
            setTimeout(function(){that.data('focusRectData') && that.css("borderColor","red")},300);
            setTimeout(function(){that.data('focusRectData') && that.css("borderColor","transparent")},600);
            setTimeout(function(){that.data('focusRectData') && that.css("borderColor","red")},900);
        }
        anim()
        if (!noInterval) {
            focusRectData.intervalId = setInterval(anim, 1000)
        }
        return this
    };
    $.fn.unFocusRect = function() {
        var data
        if (data = this.data('focusRectData')) {
            data.intervalId && clearInterval(data.intervalId)
            this.css('border', "")
            this.removeData('focusRectData')
        }
        return this
    }

})