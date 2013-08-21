/**
 * alert弹窗
 * @author by liuwencheng
 * @date 2013-7-25
 */
define(function(require,exports) {
    "use strict"
    var Dialog = require('./Dialog')
    //var alertTmpl = '<div class=\'ui-tipbox ui-tipbox-warning\'>\n    <div class=\'ui-tipbox-icon\'>\n        <i class="iconfont" title="警告"></i>\n    </div>\n    <div class=\'ui-tipbox-content\'>\n        <p class=\'ui-tipbox-explain\'>{{msg}}</p>\n    </div>\n</div>'

    return function (msg){
        var alertDlg = new Dialog({
            "hasTitle": false,
            "hasClose": false,
            "innerHTML": "<p class='ui-alert-msg'>"+msg+"</p>",
            "className": "ui-alert",
            "footBtns": {
                "close": "确定"
            },
            isAnim: false
        })
        alertDlg.open()
    }
})