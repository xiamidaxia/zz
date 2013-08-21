/**
 * jQuery 版的 actionMap
 *
 * @author by liuwencheng
 * @date 2013-5-15
 * @update by liuwencheng 阻止actionMap重复添加
 *      注意：在label标签上加data-action，若label里有input，则会触发两次action,需要用e.preventDefault()阻止
 *
 */

define(function(require) {
	var $ = require('jquery');

	$.fn.extend({
        /**
         * @param {Object}
         *      {
         *          'close': function(){},
         *          'open': function(){}
         *      }
         * @param {Object}  执行action对应的作用域
         */
		actionMap: function(actions, context) {
		    this.off('click.actionMap') //阻止actionMap重复添加
			return this.on('click.actionMap', '[data-action]', function(ev) {
				var me = $(this);
				var action = me.data('action');
				if (action in actions) {
					//var data = me.closest('[data-action-data]', ev.delegateTarget.parentNode).data() || {};
					//delete data.actionData;
					var data = me.data() || {} //获取data
					actions[action].call(context || this, ev, data);
				}
			});
		},
		unActionMap: function() {
		    return this.off('click.actionMap')
        }
	});
});


