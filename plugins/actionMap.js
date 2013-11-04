/**
 * jQuery 版的 actionMap
 *
 * @author by liuwencheng
 * @date 2013-5-15
 * @update by liuwencheng 阻止actionMap重复添加
 *      注意：在label标签上加data-action，若label里有input，则会触发两次action,需要用e.preventDefault()阻止
 * @update by liuwencheng 2013-9-26 添加opts.disabled
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
         * @param {Object || Ignore}  配置
         *              {
         *                  "disabled": true  //开启disabled  当前元素有类disabled将不执行action函数
         *              }
         */
		actionMap: function(actions, context, opts) {
		    this.off('click.actionMap') //阻止actionMap重复添加
			return this.on('click.actionMap', '[data-action]', function(e) {
				var $me = $(this);
				var action = $me.data('action');
				var isDisable = opts && opts.disabled
				if (action in actions) {
					//var data = me.closest('[data-action-data]', ev.delegateTarget.parentNode).data() || {};
					//delete data.actionData;
					var data = $me.data() || {} //获取data
					if (!isDisable || !$me.hasClass('disabled')) {
                        actions[action].call(context || this, e, data); //默认传入data
                    }
				}
			});
		},
		unActionMap: function() {
		    return this.off('click.actionMap')
        }
	});
});


