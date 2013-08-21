/**
 *  set/get
 *  @author by liuwencheng
 *  @date 2013-4-11
 */
define(function(){
    return {
        set: function(name,val){
           var oldVal = this[name]
           if(val === undefined) {
                throw new Error("set undefined value")
           }
           this[name] = val
           return oldVal
        },
        get: function(name,nullVal) {
           if(this[name] === undefined || !this.hasOwnProperty(name)) { //屏蔽继承属性方法
               if(nullVal !== undefined) {
                   this[name] = nullVal
               }else {
                   throw new Error("获取对象"+name+"不存在或者非对象本身属性") //更安全
               }
           }
           return this[name]
        }
    }
})