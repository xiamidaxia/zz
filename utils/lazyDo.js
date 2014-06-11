/**
 * 懒执行
 *
 *    var count = 0
 *    var d = lazyDo(function() {
 *               console.log(count++)
 *           }, 1500)
 *    setInterval(function() {
 *         d()
 *    },10)
 * @author by liuwencheng
 * @date 14-6-11
 */
define(function(require,exports) {
    "use strict"

    function lazyDo(fn, step, self) {
        step = step || 1500
        var _start = (new Date).getTime()
        var _timeout
        var _wrapFn = function() {
            var _cur = (new Date).getTime()
            var args = Array.prototype.slice.call(arguments)
            var self = self || this
            if (_timeout) clearTimeout(_timeout)
            if (_cur - _start > step) {
                _timeout = null
                fn.apply(self, args)
                _start = _cur
            } else {
                //过了step延迟时间如果用户一直没有输入则触发timeout
                _timeout = setTimeout(function() {
                    fn.apply(self, args)
                    _start = _cur
                }, step)
            }
        }
        return _wrapFn
    }

    return lazyDo

})