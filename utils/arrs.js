/**
 * 数组常用方法
 * @author by liuwencheng
 * @date 2013-4-12
 *
 * es5的直接用, 在libs/es5-shim已经做了扩展:
 * Array: isArray
 * Array.prototype:forEach,map,filter,every,some,reduce,reduceRight,indexOf,lastIndexOf
 */
define(function(require,exports) {
    "use strict"
    var objs = require('zz/utils/objs')
    var arrs = {}

    arrs.unique = function(/*Array*/arr) {
        var o = {}
        objs.forEach(arr,function(item) {
            o[item] = 1
        })
        return Object.keys(o)
    }

    /**
        arrs.toArray = function(obj) {
            if(!obj) return []
            if(util.isArray(obj) || util.isArguments(obj)) return slice.call(obj) //返回副本
            if(obj.toArray && util.isFunction(util.toArray)) return obj.toArray()
            return util.values(obj)
        }
    */

    return arrs
})