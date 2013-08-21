/**
 * 自定义事件支持
 *	
 *	require这个对象，并把它扩展到需要自定义事件支持的对象上即可
 *	参见 backbone.js Event
 *	将在个对象，扩展到任意对象，即可为该对象添加自定义事件机制的支持
 *
 * @class srx_event
 * @static 
 * @date 2012-6
 */
define({

	/**
	 * 绑定事件
	 *
	 * @method on
	 * @param {String} ename 事件名称
	 * @param {Function} callback 事件回调函数
	 * @param {Object} context 事件回调函数中this指向对象
	 */
	on : function(ename, callback, context) {
		var calls = this._callbacks || (this._callbacks = {}),
			list  = calls[ename] || (calls[ename] = {}),
			tail = list.tail || (list.tail = list.next = {});
		tail.callback = callback;
		tail.context = context;
		list.tail = tail.next = {};
		return this;
	},

	/**
	 * 解绑事件
	 * @method un
	 * @param {String} ename 事件名称
	 * @param {Function} callback 事件回调函数
	 */
	un : function(ename, callback) {
		var calls, node, prev;
		if (!ename) {
			this._callbacks = {};
		} else if (calls = this._callbacks) {
			if (!callback) {
				calls[ename] = {};
			} else if (node = calls[ename]) {
				while ((prev = node) && (node = node.next)) {
					if (node.callback !== callback) 
						continue;
					prev.next = node.next;
					node.context = node.callback = null;
					break;
				}
			}
		}
		return this;
	},

	/**
	 * 触发事件
	 *
	 * @method fire
	 * @param {String} ename 事件名称
	 */
	fire : function(ename) {
		var node, calls, callback, args, e, events = ['all', ename];
		if (!(calls = this._callbacks)) 
			return this;
		while (e = events.pop()) {
			if (!(node = calls[e])) 
				continue;
			args = (e == 'all' ? arguments : Array.prototype.slice.call(arguments, 1));
			while (node = node.next) {
				if (callback = node.callback) {
					callback.apply(node.context || this, args);
				}
			}
		}
		return this;
	}
});
