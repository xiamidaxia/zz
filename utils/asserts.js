/**
 * 调试相关方法
 *          debug
 *          |- assertType
 *          |- assert
 *          |- assertEqual
 * @author by liuwencheng
 * @date 2013-4-12
 */
define(function(require,exports) {
"use strict"
var objs = require('zz/utils/objs')
var types = require('zz/utils/types')
    ,forEach = objs.forEach
    ,typeOf = objs.typeOf
    ,has = objs.has
    ,isDebug = window.GLOBAL.debug || window.GLOBAL.DEBUG
var asserts = {}
/*
 * 断言函数参数的类型
 *
 * @param args    arguments || {Array} 目标数组
 * @param types {Array}  类型数组
 *                  基本: Array,Number,Boolean, RegExp,Function,Array, String, Object, Arguments, Date,
 *                  扩展: All: 任意,但不能为空,即不能Undefined或者Null或者NaN
 *                       Ignore: 可以为空
 *                  自定义: 须在extend参数中自定义中自定义,参照util.typeOf
 * @param extendTypes {Object || Ignore}  扩展类型
 * @example  assertType(parameters, ['Function || Array', 'All', 'Node', 'Ignore'], {"Node", Node})
 */
asserts.assertType = function(args, types, extendTypes) {
    if(!isDebug)  return   //非调试环境下跳过这步,相对来说断言类型是比较耗时间的
    forEach(types, function(item, index) {
        var typeArrs = item.split(/\s*\|\|\s*/) //当前参数需要检测的类型数组
                ,thisArg = args[index]      //当前参数
                ,type = typeOf(thisArg,extendTypes) //获取当前参数类型
                ,isCorrect = false
        if(has(typeArrs, 'Ignore')) {
            if(type == 'Undefined') {
                isCorrect = true
                return
            }
        }
        if(has(typeArrs, 'All')){
            if(type !== 'Undefined' || type !== 'NaN' || type !== 'Null') {
                isCorrect = true
                return
            }
        }
        if(has(typeArrs, type)) {
            isCorrect = true
        }
        if(!isCorrect) {
            throw new Error('第' +index+'个参数为' + type + '类型，不是指定的类型' + typeArrs.join(' or '))
        }
    })
}
/**
 * @param {Boolean}
 * @param {String}
 */
asserts.assert = function(isTrue, message) {
    if(isDebug && !isTrue) {
        throw new Error(message)
    }
}
/**
 * @param {All}
 * @param {All}
 */
asserts.assertEqual = function(a, b) {
    if(isDebug && a !== b) {
        throw new Error('assertEequal false')
    }
}
return asserts
})