/**
 *
 * 对指定函数 混入前后方法进行封装,有点类似方法重载
 * @author by liuwencheng
 * @date 2013-4-15
 */
define(function(require,exports) {
    "use strict"
    var asserts = require("zz/utils/asserts")
        ,assert = asserts.assert
        ,assertType = asserts.assertType
    /**
     * @param {String} 函数名
     * @param {Function} 混入的函数
     */
    exports.before = function(targetFuncName,beforeFunc) {
        assertType(arguments,["String","Function"])
        var oldFunc = this[targetFuncName]
        var newFunc = function() {
            var ret = beforeFunc.apply(this,arguments)
            if (ret) return ret
            return oldFunc.apply(this,arguments)
        }
        this[targetFuncName] = newFunc
    }
    /**
     * @param {Function} 函数
     * @param {Function} 混入的函数
     */
    exports.after = function(targetFuncName,afterFunc) {
        assertType(arguments,["String","Function"])
        var oldFunc = this[targetFuncName]
        var newFunc = function() {
            var ret = oldFunc.apply(this,arguments)
            if (ret) return ret
            return afterFunc.apply(this,arguments)
        }
        this[targetFuncName] = newFunc
    }
})