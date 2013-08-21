/**
 * 单例 (适用于类(zz/core/Class)的wrap方法)
 *
 * @author by liuwencheng
 * @date 2012-1-3
 */
 define(function() {
    return {
        init: function(){
            var cons = this.constructor
            if(cons._wrapInstance){
                return cons._wrapInstance  //阻止后续初始化, 注：return重定向必须返回对象
            }
            cons._wrapInstance = this
        }
    }
 })