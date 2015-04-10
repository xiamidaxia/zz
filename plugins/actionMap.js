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
	
	
	$.fn.extend({
    /**
     * <div id="wrap">
     *  <p n='content'>内容</p>
     *  <a action="delete" t="content">删除</a>
     *  <a action="add" t="content">添加</a>
     * </div>
     * $("#wrap").actions({
     *     "delete [tap, blur]": function(e, t, data){
     *          t.remove()
     *     },
     *     //默认不加事件名称为tap
     *     "add": function() {
     *
     *     }
     * })
     *
     * */
    actions: function(map) {
        var self = this
        if (!map) return
        $.each(map, function(originKey) {
            var actionFn = this
            var keys = originKey.split(/\s+/)
            var actionName, eventNames
            if (originKey[0] !== "[") {
                actionName = keys[0]
                keys.shift()
            }
            eventNames = keys.join(" ") || '[click]'
            eventNames = eventNames.substr(1,eventNames.length-2).split(/\s*,\s*/)
            eventNames.forEach(function(eventName) {
                self.on(eventName, "[action="+actionName+"]", function(e) {
                    var parentData = $(e.delegateTarget).data()
                    var myData = $(e.currentTarget).data()
                    actionFn.call(this, e, t(e), $.extend({}, parentData, myData))
                })
            })
        })
    }
})
function t(e) {
    var $target = $(e.currentTarget)
    var name = $target.attr('t')
    var res
    if (!name) throw new Error("can not find 'name' !!")
    while (true) {
        if (e.delegateTarget === $target[0] || document.body === $target[0]) return []
        res = $target.parent().children('[n="' + name + '"]')
        if (res.length !== 0) return res
        $target = $target.parent()
    }
}
});


