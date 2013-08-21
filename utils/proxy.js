/**
 * [废弃] 直接使用Function.bind
 * @author by liuwencheng
 * @date 2013-4-12
 */
define(function(require,exports) {
    "use strict"
    var  objs = require('zz/utils/objs')
        ,asserts = require('zz/utils/asserts')
        ,forEach = objs.forEach 
        ,log = asserts.log
        ,assertType = asserts.assertType
    /*
    if(Function.prototype.bind)  {
        proxy = function(target,context) {
            assertType(arguments,["Function","Object"])
            target.bind(context)
        }
    }
    */
    var proxy = function(targetFunc,context,isExec) {
        assertType(arguments,["Function","Object"])
        function proxyFunc() {
            if(this instanceof proxyFunc) throw new Error("代理之后的函数不可使用new构造函数")
            return targetFunc.apply(context,arguments)
        }
        if(isExec) {
            return targetFunc.apply(context,[].slice.call(arguments,3))
        }else {
            return proxyFunc
        }
    }
    return proxy
})