/**
 * 将元素滚动到视图
 *
 * @author zhangpeng
 * @date 2012-11-26
 *
 * @update by liuwecheng 增加强制滚动isForce
 */

define(function(require, exports) {
    require('jquery.easing')
	var $ = require('jquery');

	// 可考虑独立出来
	function scrollTo(value, time, type) {
		var el = $.browser.webkit ? document.body : document.documentElement;
		$(el).animate({ scrollTop: value }, time || 300, type || '');
	}

	$.fn.extend({
		/*
		 * @param {Number} adj 是个调节量，负值相当于向上拉动滚动条（即元素向下移动）
		 * @param {Boolean} isForce 是否强制滚动,元素可见情况下是否强制滚动
		 */
		scrollIntoView: function(adj, isForce) {
			var elem = this.eq(0); // 只对第一个元素应用
			var win = $(window);

			var top = elem.offset().top;
			var bottom = top + elem.outerHeight();
			var viewTop = win.scrollTop();
			var viewBottom = viewTop + win.height();
		
			if (isForce || top < viewTop || bottom > viewBottom) {
				scrollTo(top + (adj || 0));
			}

			return this;
		}
	});

	return scrollTo //对外开放scrollTo
});
