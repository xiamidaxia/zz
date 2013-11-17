/**
 *
 * 可视窗口
 *
 * @author by liuwencheng
 * @date 2013-6-18
 *
 */
define(function (require, exports) {
    "use strict"
    require('jquery.tmpl')

    var objs = require('zz/utils/objs')
    var Class = require('zz/core/Class')

    var Widget = Class()
        .defState('CLOSE','OPEN','DISPOSE','CREATE')
        //静态属性
        .attr({
            DEFAULT_OPTS: {
                $target: null
            },   //默认操作
            TMPL: ""            //模版
        })
        .init(function (opts) {
            this._opts = objs.extend({},this.DEFAULT_OPTS,opts) //配置
        })
        .method({
            updateOpts: function(opts){
                objs.extend(this._opts, opts)
                return this
            },
            _create: function() {
                this.triggerState('CREATE')
            },
            _bindEvent: function() {
            },
            _unBindEvent: function() {
            },
            open: function() {
                this.triggerState('OPEN')
            },
            close: function() {
                this.triggerState('CLOSE')
            },
            dispose:  function() {
                this.triggerState('DISPOSE')
                this.destroy()
            }
        })
    return Widget
})