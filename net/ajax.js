/**
 * 封装
 * @author by liuwencheng
 * @date 14-4-25
 */
define(function(require, exports) {
    "use strict"
    var $ = require('jquery')
    var extend = require('zz/utils/objs').extend
    /**
     * opts:
     *  - url {String}
     *  - type {String}         "post" | "get"
     *  - data {Object | Ignore}
     *  - done {Function | Ignore}
     *  - fail {Function | Ignore}
     *  - always {Function | Ignore}
     */
    function ajax(opts) {
        if (!opts.url) throw new Error('ajax缺少参数url')
        if (!opts.type) throw new Error("ajax缺少参数type")
        var _opts = {
            error: function() {
                opts.fail && opts.fail({code: 500, data: {}, msg: "出错了, 请重试或联系客服~~"})
            },
            success: function(json) {
                if (json && json.code === 200) {
                    if (!json.data) json.data = {}
                    opts.done && opts.done(json)
                } else {
                    if (!json) json = {}
                    if (!json.msg) json.msg = "出错了，请重试或联系客服~~"
                    opts.fail && opts.fail(json)
                }
            },
            complete: opts.always || function(){}
        }
        $.ajax(extend({},opts,_opts))
    }

    return ajax
})