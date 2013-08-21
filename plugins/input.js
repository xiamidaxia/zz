/**
 * 监听textarea,input的及时输入
 *
 * @author by liuwencheng
 * @date 2013-6-24
 *
 */

define(function(require) {
	var $ = require('jquery')
	    ,sys = require('zz/utils/utils').sys
    var eventType
    if($.browser.msie && $.browser.version<9) {
    //if (sys.IE6 || sys.IE7 || sys.IE8) {
        eventType = 'propertychange'
    }else {
        eventType = 'input'
    }

	$.fn.extend({
		onInput: function() {
		    var args = Array.prototype.slice.call(arguments)
		    args.unshift(eventType)
            $(this).on.apply(this,args)
            return this
		},
		unInput: function() {
            var args = Array.prototype.slice.call(arguments)
            args.unshift(eventType)
		    return this.off.apply(this,args)
		    return this
        }
	});
});


