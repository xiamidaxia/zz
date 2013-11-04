/**
 * loading弹窗
 * @author by liuwencheng
 * @date 2013-10-11
 * @example
 *              var loading = require('zz/ui/loading')
 *              var curLoad = loading('正在加载中。。。')
 *              curLoad.close() //关闭
 */
define(function(require,exports) {
    "use strict"
    var Dialog = require('./Dialog')

    return function (msg){
        var infoDlg = new Dialog({
            "hasTitle": false,
            "hasClose": false,
            "hasFoot": false,
            "hasMask": true,
            "innerHTML": "<p class='ui-loading-msg'><i></i>"+msg+"</p>",
            "className": "ui-loading",
            isAnim: false
        })
        infoDlg.open()
        return infoDlg
    }

})