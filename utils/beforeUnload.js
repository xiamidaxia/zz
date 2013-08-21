/**
 *
 * @author by liuwencheng
 * @date 2013-6-1
 *
 */
define(function(require, exports){
    exports.bind = function(msg){
        window.onbeforeunload = function(){
            return msg || "内容还未保存!"
        }
    }

    exports.unbind = function(){
        window.onbeforeunload = null;
    }
})
