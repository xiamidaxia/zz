/**
 *
 * @author by liuwencheng
 * @date 2013-6-1
 *
 */
define(function(require, exports){
    var sys = require('zz/utils/utils').sys
    exports.bind = function(msg){
        if (sys.IE) return
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
