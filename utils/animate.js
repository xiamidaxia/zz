/**
 * 简单动画函数
 * @author by liuwencheng
 * @date 2013-8-5
 * @example
 *      var anim = require('zz/utils/animate')
 *      anim(function(percent){
 *          //percent为完成的百分比，当为1的时候执行结束
 *      },3000,'easeIn')
 *
 */
define(function(require,exports) {
    "use strict"
    var easing = require('zz/extends/easing')
    var TIME_STAMP = 17 //60HZ

    var animate = function(cb, timeLen, easingType){
        var startTime  = (new Date()).getTime()

        function exec(){
            var finshedTime = (new Date()).getTime() - startTime
            if(finshedTime <= timeLen) {
                cb(easing[easingType || 'linear'](finshedTime/timeLen))
                setTimeout(exec, TIME_STAMP)
            }else {
                cb(1) //执行结束
            }
        }
        exec()
    }
    return animate
})