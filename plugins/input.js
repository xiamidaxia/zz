/**
 * 监听textarea,input的及时输入
 *
 * @author by liuwencheng
 * @date 2013-6-24
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
                var data = this.data('_setInputArgs')
                var that = this.unInput()
                setTimeout(function() {
                    that.val(val)
                    that.onInput.apply(that, data)
                }, 0)
            } else {
                this.val(val)
            }
        }
	});
});


