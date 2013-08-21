/**
 * 类型判定相关方法
 * @author by liuwencheng
 * @date 2013-4-12
 */
define(function(require,exports) {
    "use strict"
    var toString = Object.prototype.toString
    var types =
     {
        isString : function(arg) {
            return toString.call(arg) === '[object String]'
        },
        isFunction: function(arg) {
            return toString.call(arg) === '[object Function]'
        },
        isRegExp: function(arg) {
            return toString.call(arg) === '[object RegExp]'
        },
        isObject: function(arg) {
            return arg === Object(arg)
        },
        isNumber: function(obj) {
            return toString.call(obj) === '[object Number]'
        },
        //mark
        isArguments: function(obj) { //ie8 无法使用
            return toString.call(obj) == '[object Arguments]';
        },
        isArray: function(obj) {
            return toString.call(obj) == '[object Array]';
        },
        isFinite: function(obj) {
            return types.isNumber(obj) && isFinite(obj);
        },
        isNaN: function(obj) {
            return types.isNumber(obj) && (obj !== obj);
        },
        isBoolean: function(obj) {
            return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        },
        isDate: function(obj) {
            return toString.call(obj) == '[object Date]';
        },
        isNull: function(obj) {
            return obj === null
        },
        isUndefined: function(obj) {
            return obj === void 0
        }
    }
    return types
})