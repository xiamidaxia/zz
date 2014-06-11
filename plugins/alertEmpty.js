/**
 * 输入区不可以为空的提示动画
 *
 *
 *	var $ = require("jquery");
 *	require("zz/plugin/alertEmpty");
 *	
 *	var $text = $("#textarea");
 *	var value = $text.val().trim();
 *
 *	if (value == ""|| value == $text.attr("placeholder")) {
 *	    $("#textarea").alertEmpty();
 *	}
 *
 */

define(function(require, exports){
	var $ = require("jquery");
	$.fn.alertEmpty = function(){
		var that = this;
		that.css("backgroundColor", "#ffeeee");
	   	setTimeout(function(){that.css("backgroundColor","")},100);
	   	setTimeout(function(){that.css("backgroundColor","#ffeeee")},200);
	   	setTimeout(function(){that.css("backgroundColor","")},300);
		return this;
	};
})
