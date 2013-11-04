/**
 * info弹窗
 * @author by liuwencheng
 * @date 2013-7-25
 */
define(function(require,exports) {
    "use strict"
    var SHOW_TIME = 1000
    var Dialog = require('./Dialog')

    return function (msg, type, duration){
        var infoDlg = new Dialog({
            "hasTitle": false,
            "hasClose": false,
            "hasFoot": false,
            "hasMask": true,
            "innerHTML": "<p class='ui-info-msg' style='padding: 30px 50px;font-size:16px;'><i></i>"+msg+"</p>",
            "className": "ui-info",
            isAnim: false
        })
        infoDlg.open()
        type = type || "success" //todo
        setTimeout(function(){infoDlg.close()}, duration || SHOW_TIME)
        return infoDlg;
    }
})
