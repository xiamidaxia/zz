/**
 * 注: 未测试, 暂时不用
 *
 * 使用方法
 *      var myOpts = {
 *      }
 *      var optsControl = require(zz/utils/optsControl)
 *
 * @author by liuwencheng
 * @date 2013-
 */
define(function(require,exports) {
    "use strict"
    var  objs = require('zz/utils/objs')
        ,asserts = require('zz/utils/asserts')
        ,assert = asserts.assert
        ,assertType = asserts.assertType
        ,global = require("global/manager")
        ,isDebug = global.get('DEBUG')

    var IGNORE_KEY = "_"
    /**
     * @param defOpts 默认的配置
      */
    var optsControl = function(defOpts,myOpts,_this) {
        if(!isDebug)  {  //非调试模式不进行判断
            return objs.extend({},defOpts,myOpts)
        }
        var needOptsArr = [] //要求的配置
            ,newOpts = _this || {}
            ,curKey
        objs.forEach(defOpts,function(item,key) {
            if(key.substr(0,1) !== IGNORE_KEY) {
                if(myOpts[key] === undefined) {
                    throw new Error('要求必须配置' + key)
                }
                assertType([myOpts[key]],[objs.typeOf(item)]) //类型要求
                newOpts[key] = myOpts[key]
                return
            }
            curKey = key.substr[1]
            newOpts[curKey] = item //可忽略的
            if(myOpts[curKey] !== undefined) {
                newOpts[curKey] = myOpts[curKey]
            }
        })

        return newOpts
    }

    return optsControl

})