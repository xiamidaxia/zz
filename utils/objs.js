/**
 * 对象常用方法
 *      keys //es5 自带
 *      objs
 *      |- breaker
 *      |- forEach
 *      |- extend
 *      |- size
 *      |- typeOf
 *      |- has
 *      |- remove
 * @author by liuwencheng
 * @date 2013-4-12
 */
define(function(require,exports) {
    "use strict"
    var types = require('zz/utils/types')
    var objs = {}
        ,forEach,breaker
    var op = Object.prototype
        ,ap = Array.prototype
        ,toString = op.toString
        ,shift = ap.shift

    /**
     * 用于forEach循环中断
     */
    objs.breaker = breaker = {}
    /**
     *  数组和arguments不要使用objs.forEach
     *
     *      ie8无法对arguments使用for-in遍历，所以不能使用该方法遍历arguments
     *
     * @param {Object}
     * @param {Function} 终止循环使用“return util.breaker”
     * @param {Object}
     */
    objs.forEach = forEach = function(obj, fn, context) {
        if (!obj) return
        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                if(fn.call(context || obj, obj[key], key, obj) === breaker) return
            }
        }
    }
    /**
     * 对象扩展，可以扩展多个对象, objs.extend(targetObject,obj1,obj2...)
     * @param {Object} targetObject
     *      var obj1 = {a:3,b:4}
     *      var obj2 = {c:4,:d:3}
     *      var target = {}
     *      objs.extend(target,obj1,obj2)
     */
    objs.extend = function() {
        var first = shift.call(arguments)
        for(var i = 0; i < arguments.length; i++){
            var item = arguments[i]
            forEach(item,function(val,key){
                first[key] = val
            })
        }
        return first
    }
    /*
     * 对象大小,若是数组返回数组长度，若是对象返回key数目
     * @param {Object}
     */
    objs.size = function(obj) {
        return types.isArray(obj) ? obj.length : objs.keys(obj).length
    }
    /**
     * @param {Object} obj
     * @param {extend} 扩展类型 如
     *              {
     *                  "myType": Father {Object}
     *              }
     *             当obj是Father的实例时候将返回“myType”
     */
    objs.typeOf = function(obj,extend) {
        var type
        if(extend !== undefined) { //类扩展
            forEach(extend, function(item, key) {
                if(obj instanceof item) {
                    type = key
                    return breaker
                }
            })
        }
        if(type !== undefined) {
            return type
        }else if(types.isNaN(obj)) {
            return 'NaN'
        }else if(types.isNull(obj)) {
            return 'Null'
        }else{
            return toString.call(obj).slice(8,-1)
        }
    }
    /**
     * 是否包含指定的元素
     */
    objs.has =  function(obj, aItem) {
        var res = false
        forEach(obj, function(item) {
            if(item === aItem) {
                res = true
                return breaker
            }
        })
        return res
    }

    /*
     * @param {Object || Array}
     * @param {Array} //指定要删除的数组
     *          若是对象删除单个子元素 建议直接使用delete
     *          返回删除是否成功
     */
    objs.remove = function(obj, aItems) {
        if(types.isArray(obj)) {
            for(var i= 0,len=obj.length; i!=len; i++) {
                for(var j= 0,len2=aItems.length; j!=len2;j++) {
                    if(obj[i] === aItems[j]) {
                        obj.splice(i,1)
                        return true
                    }
                }
            }
            return false
        }else {
            for(var j= 0,len2=aItems.length; j!=len2;j++) {
                delete obj[aItems[j]]
                return true
            }
            return false
        }
    }

    objs.isEmpty = function(o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) return false;
        }
        return true;
    }

    return objs
})