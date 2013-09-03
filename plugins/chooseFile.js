/**
 * 上传文件插件
 * @author by liuwencheng
 * @date 2013-9-2
 */
define(function(require,exports) {
    "use strict"
    var $ = require('jquery')

    var tpl = '<input type="file" class="none" {{attr}}/>'

    $.fn.extend({
        /**
         * 选择文件
         * @param {Function} 文件选择完的时候的回调
         * @param {String} 需要添加的一些属性
         */
        chooseFile: function (fn, attr) {
            var $file = $(tpl.replace("{{attr}}", attr)).appendTo(document.body)
            $file.change(fn)
            $file.click() //触发
        }

    })

})