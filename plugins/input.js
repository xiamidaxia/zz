/**
 * 监听textarea,input的及时输入, 兼容IE
 *
 * @author by liuwencheng
 * @date 2013-6-24
 *
 * @update 2014-6-5 添加onDelayInput
 *
 */

define(function(require) {
	var $ = require('jquery')
    var eventType
    //if (sys.IE6 || sys.IE7 || sys.IE8) {
    //if (sys.LowIE) {
        
    var isLowIE = (/\bMSIE [67]\.0\b/.test(navigator.userAgent)) ? true : false
    if (isLowIE) {
        eventType = 'propertychange'
    }else {
        eventType = 'input'
    }

	$.fn.extend({
        /**
         * @example
         * $elem.onInput(function(e) {
         *      //每次内容改变的触发回调
         * })
         *
         */
		onInput: function() {
		    var args = Array.prototype.slice.call(arguments)
            this.data('_setInputArgs', args.slice())
		    args.unshift(eventType)
            return this.on.apply(this,args)
		},
		unInput: function() {
            var args = Array.prototype.slice.call(arguments)
            args.unshift(eventType)
            this.removeData('_setInputArgs')
		    return this.off.apply(this,args)
        },
        /**
         * 在监听input事件的情况下动态改变其值，防止在低版本IE浏览器下循环触发
         */
        setInputVal: function(val){
            if (isLowIE && this.data('_setInputArgs')) {
                var args = this.data('_setInputArgs')
                var that = this.unInput()
                setTimeout(function() {
                    var step
                    that.val(val)
                    if (step = that.data('delayStep')) {
                        that.onDelayInput.apply(that, args.push(step))
                    } else {
                        that.onInput.apply(that, args)
                    }
                }, 0)
            } else {
                this.val(val)
            }
        },
        /**
         * @param {Function} fn
         * @param {Number | Ignore} step
         * @returns {$}
         */
        onDelayInput: function(fn, step) {
            step = step || 1500
            var _start = (new Date).getTime()
            var _timeout
            var self = this
            var _wrapFn = function() {
                var _cur = (new Date).getTime()
                var args = Array.prototype.slice.call(arguments)
                if (_cur - _start > step) {
                    clearTimeout(_timeout)
                    _timeout = null
                    fn.apply(self, args)
                    _start = _cur
                } else {
                    if (_timeout) clearTimeout(_timeout)
                    //过了step延迟时间如果用户一直没有输入则触发timeout
                    _timeout = setTimeout(function() {
                        fn.apply(self, args)
                        _start = _cur
                    }, step)
                }
            }
            this.data("delayStep", step)
            return this.onInput(_wrapFn)
        }
	});
});


