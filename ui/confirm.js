/**
 * confirm弹窗
 * @author by liuwencheng
 * @date 2013-7-25
 */
define(function(require,exports) {
    "use strict"
    var Dialog = require('./Dialog')

    /**
     * @param {String} 消息
     * @param {Function} 确定按钮的回调
     * @param {Function || Ignore} 取消按钮的回调
     */
    return function (msg, callback_ok, callback_cancel){
        var confirmDlg = (new Dialog({
            "hasTitle": false,
            "hasClose": false,
            "innerHTML": "<p class='ui-confirm-msg'>"+msg+"</p>",
            "className": "ui-confirm",
            "footBtns": {
                "confirm": "确定",
                "close": "取消"
            },
            "actions": {
                "confirm": function(){
                    callback_ok.call(this)
                    this.close()
                },
                "close": function() {
                    callback_cancel && callback_cancel.call(this)
                    this.close()
                }
            },
            isAnim: false
        }))
        confirmDlg.open()
    }
})