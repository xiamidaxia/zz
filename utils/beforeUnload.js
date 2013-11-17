/**
 *
 * @author by liuwencheng
 * @date 2013-6-1
 *
 */
define(function(require, exports){
    exports.bind = function(msg){
        if (require('jquery').browser.msie) return
        window.onbeforeunload = function(e){
            return msg || "内容还未保存!"
            e.preventDefault()
            e.stopPropagation()
        }
    }

    exports.unbind = function(){
        window.onbeforeunload = null;
    }
})
