/**
 * [废弃]
 * 对象代理,对整个对象进行代理封装,并过滤对象继承（原型）的方法，
 * 新的对象留下对象本身的方法并代理给对象自己作用域，
 * 配合wrap非常好用
 * @author by liuwencheng
 * @date 2013-4-13
 */
define(function(require,exports) {
    "use strict"
    var proxy = require("zz/utils/proxy")
        ,typeOf = require("zz/utils/objs").typeOf


    /**
     * @param {Object} target
     * @param {Object || Ignore} context
     *      若context无参数使用target本身当作用域,如此返回的对象相当于target副本
     */
    function pack(target,context) {
        var packObj = {}
            ,context = context || target
            ,item
        for(var key in target){
            if(target.hasOwnProperty(key)) {    //去除继承
                item = target[key]
                if(typeOf(target[key]) === "Function") { //只对函数对象打包
                        packObj[key] = target[key].bind(context)
                        //packObj[key] = proxy(item,context)
                }
            }
        }
        return packObj
    }
    return pack

})