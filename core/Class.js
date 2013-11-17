/*
 * 类包装器
 *
 * @author by liuwencheng
 * @date 2013-1-1
 * 0.3.1
 *
 * @update 2013-4-12  0.1.0 加入状态功能,状态是让外部函数或对象认识 本类的方式,名字最好见名知意
 * @update 2013-4-14  0.1.1 用类的内部事件方法（listenState，triggerState,unListenState）代替复杂的return跳转，实现类自己语言的交流
 * @update 2013-6-5   0.2  重新制作defState, onState, triggerState, unState,
 *                         添加superInit, superMethod方法
 * @update 2013-6-21  0.2.1  重新制作接口实现方式
 * @update 2013-6-22  0.3  添加toggleOnce方法
 * @update 2013-6-22  0.3.1 添加onceState方法  只执行一次
 *
 *
 *
 * Thanks to: arale.Class
 *
 *          Class(Parent, {Object}orders)               //继承Parent(为空继承Class), orders为实现Parent的订单(接口)
 *
 *      所有类共有方法:(不被实例使用)
 *          extend({Object},{Object}...)                //扩展到类(constructor)上, 即类似的objs.extend
 *
 *          init({Function})                            //定义构造函数
 *          attr({Object})                              //加入类静态属性(属性必须得大写), 否则报错, 该方法只扩展非函数
 *          defState({String},{String}...)              //定义状态,状态名最好能见名知意，如TIMELINE_PAUSE,状态是类与类之间的交流方式
 *          aliasState(newStateName, oldStateName)      //重命名状态名
 *          getState({String})                          //使用该函数获取状态，防止状态名写错, 返回的是一个对象
*           method({Object})                            //对原型进行扩展方法(可被继承), 自动忽略init方法
 *          order({String},{String}...)                 //给继承他的子类下的订单,其子类必须实现或重载父类, 类似面向对象接口,接口间用逗号隔开
 *          wrap({Object},{Object}...)                  //扩展到实例(不能被继承),包装器(实现模块化即插即用),包装器之间不能重名或者冲突,保证模块化
 *          unWrap({Object})                                    //解除包装
 *          make()                                      //创建实例,类似new,用于链式
 *          final()                                     //final类不能被继承
 *          toggleMethod({String},{String}, {Function}) //保证方法只执行一次, 详细见下边例子说明
*                                                       //todo注意:不能将toggleMethod的方法放入延时函数的回调中, 如setTimeout动画等
 *
 *          getParent                                   //获取该类继承的父类
 *      实例方法:
 *          superClass                                  //父类原型
 *          constructor                                 //类构造器
*           getState({String})                          //等同于this.constructor.getState方法
 *          onState(stateName,callback,Context)         //监听状态
 *          onceState(stateName,callback,Context)       //监听状态事件, 但是事件只会被执行一次,之后将自动清楚
 *          unState(stateName, cb1, cb2,cb3...)                //解除指定事件, 若是只传参数stateName将消除所有
 *          triggerState({String},参数)                  //触发状态
 *          superInit()                                 //执行父类构造函数,相当于this.superClass.init.apply(this, arguments)
 *          superMethod(methodName)                     //执行父类方法,第一个参数传入名字,相当于this.superClass[methodName].apply(this, arguments)
 *          destroy()                                   //消除该实例, 该方法可以简化垃圾回收器, 增加一点性能
 *
 * 例子:
*        //简单继承演示
         var Class = require('zz/core/Class')
         var Animal = Class()
            .init(function(name){
                this.name = name
            })
            .method({  //对象里元素只能是函数, 在这里不要定义init, 在这里定义init覆盖原init
                eat: function(){
                    alert("I Can Eat!")
                }
            })
            .attr({
                "COUNT": 0
            })
         var Pig = Class(Animal)
                 .init(function(name){
                     //this.superClass.call(this,name)
                     this.superInit(name)
                     this.superClass.COUNT++
                 })
                 .method({
                     walk: function(){
                         alert("Pig Walk!")
                     }
                 })
         var pig1 = new Pig('pig1')
         var pig2 = new Pig('pig2')
         alert(pig1.COUNT) //2
         pig1.walk() //Pig walk!
         pig1.eat() //I can Eat!

         //创建抽象类
        var AbstractClass = Class().order('eat','walk') //抽象类
        var MyClass = Class(AbstractClass)
        .method({
             'eat': function(){
                 this.superClass.say.apply(this,arguments) //调用父类该接口 ??
             }, //必须重新实现,不然报错而且接口必须是函数
             'walk': function(){}
        })
        var test = new MyClass()
        test.say() //say(1)

       //包装器
        var eventWrap = {on: function(){}; off: function(){};} //扩展方法
        var singleWrap = require("zz/wraps/single") //单例
        var Room = Class().wrap(singleWrap, eventWrap)
        var test1 = new Room(),
            test2 = new Room()
        alert(test1 === test2)  //true 被包装成单例模式
        test1.on()              //可用
        Room.unWrap(eventWrap)
        Room.unWrap(singleWrap)
        var test3 = new Room()
        alert(test3 === test2)  //false 已被解除包装
        tet3.on()               //error no this method

        //事件机制
        var cb1 = function(){ alert('I am FUCK1')}
        var cb2 = function(){ alert('I am FUCK2')}
        var Animal = Class()
                    .defState('ANIMAL_EAT', "ANIMAL_SHOW")
                    .init(function(name){
                        this.name = name
                        this.onState('ANIMAL_EAT', function(){ alert(this.name + 'is eat')})
                    })
        var Pig = Class(Animal)
                    .defState("PIG_FUCK")
                    .aliasState("PIG_EAT", "ANIMAL_EAT")
                    .init(function(name){
                        //this.superClass.init.call(this, name) //执行父类构造函数
                        this.superInit(name)
                        this.onState("PIG_FUCK", cb1)
                    })
        alert(Pig.getState("PIG_EAT") === Pig.getState("ANIMAL_EAT")) //true 注意getState返回的是一个对象
        var pig1 = new Pig('pig1')
        var pig2 = new Pig('pig2')
        //测试多态
        alert(pig1.getState('PIG_EAT') === pig2.getState('PIG_EAT')) //true
        pig1.triggerState('PIG_EAT') // pig1 is eat
        pig2.triggerState('PIG_EAT') // pig2 is eat
        //测试取消
        pig1.onState("PIG_FUCK", cb2)
        pig1.triggerState("PIG_FUCK") //I am FUCK1 , I am FUCK2 触发两个
        pig1.unState("PIG_FUCK", cb1)
        pig1.triggerState("PIG_FUCK") //I am FUCK2 触发一个
        pig1.unState("PIG_FUCK") //清除所有PIG_FUCK
        //测试toggleOnce
        var Room = Class()
            .method({
                'close': function(){
                    console.log('room close')
                },
                'open': function(){
                    console.log('room open')
                }
            })
            .toggleOnce('open','close',function(state){
                if(state)  {
                    console.log('only opened once')
                } else {
                    console.log('room is not opened')
                }
            })
        var r = new Room()
        r.close()   //room is not opened
        r.open()    //room open
        r.open()    //only opened once
        r.close()   //room close
        r.close()   //room is not opened
        var BigRoom = Class(Room)
            .method(
                'close': function(){
                    console.log('bigroom close')
                },
                'open': function() {
                    console.log('bigroom open')
                }
            )
        var br = new BigRoom()
        br.close()   //room is not Opened ,调用父类回调,自动将close和open绑定
        br.open()    //bigroom open

 */
define(function(require, exports){
    "use strict"
    var types = require('zz/utils/types')
        ,asserts = require('zz/utils/asserts')
        ,objs = require('zz/utils/objs')
    var isFunction = types.isFunction
        ,assertType = asserts.assertType
        ,assert = asserts.assert
        ,forEach = objs.forEach

    //var ORDER_SPLITER = /\s*,\s*/
    var ATTR_STATE_REG =  /^[_A-Z]+$/ //属性,状态大写
    var PRE_STATE = "__STATE__"
    var METHOD_IGNORE_KEY = ['superClass','constructor','getState','onState','unState',
                            'triggerState','superInit','superMethod','destroy','init',
                            'toggleMethod','getParent']

    /**
     * @param {Function || Ignore} parent  父类
     */
    function Class(parent) {
        parent || (parent =  Class)
        assertType([parent],['Function']) //要求必须是函数
        if(parent.__final) throw new Error('final 类不能被继承')
        //子类构造函数
        function SubClass() {
            var constructor = this && this.constructor
            if(!(constructor && this instanceof constructor))
                throw new Error('construct lose "new" !!')
            var wrapers = constructor.__wrapers__ || (constructor.__wrapers__ = []) //放到类上
                ,that = this ,retWrap ,wrap_inits = [], i,len
                ,retInit
            if(!constructor.__orderCorrect__) {
                throw new Error('父类接口['+ constructor.getParent().__orders__ + ']未实现完!!')
            }
            //执行init
            if (this.init) {
                retInit = this.init.apply(this, arguments) || this
            }
            //包装器数组不为空则遍历包装器,在创建类对象先遍历包装器的init函数
            if(wrapers.length!==0) {
                for(i=wrapers.length-1; i>=0; i--) { //倒置,后进先出,保证最后一个的init的return先执行,
                    forEach(wrapers[i],function(val,key){
                        if (key !== 'init') {
                            if (!that[key]) that[key] = val
                            else throw new Error('wrapers method conflict') //防止包装器方法冲突
                        }else {
                            wrap_inits.push(val)
                        }
                    })
                }
                //执行包装器init,
                for (i= 0,len=wrap_inits.length; i!=len; i++) {
                    retWrap = wrap_inits[i].apply(this, arguments)
                    if (retWrap !== undefined && retWrap!==this) {
                        //todo 可能潜在风险
                        //res是return返回，将终结后续包装器init和主函数init
                        return retWrap //重定向,  注：res必须是对象，使用new构造必须返回对象，否则无效
                    }
                }
            }
            return retInit || this
        }
        //原型继承
        inheritPrototype(SubClass, parent)
        //检测父类的订单
        if(parent.__orders__ && parent.__orders__.length !== 0) {
            SubClass.__orderCorrect__ = false
        }else {
            SubClass.__orderCorrect__ = true
        }
        //包装所有构造器共有方法,这些方法不被实例共享，只针对类（构造器）本身
        return classify(SubClass)
    }

    /**
     * 原型继承
     */
    function inheritPrototype(SubClass, SuperClass){
        var F = function(){}
            ,prototype
        F.prototype = SuperClass.prototype
        prototype = new F()
        /********************************************************/
        prototype.constructor = SubClass             //是的子类可以访问构造函数
        prototype.superClass = SuperClass.prototype
        //prototype.init = null
        /**********************************************************/
        SubClass.prototype = prototype
    }
    //所有类都扩展的方法
    function classify(obj) {
        objs.extend(obj, Class)
        return obj
    }
/*****************************实例通用方法******************************/
    var prototype = Class.prototype
    prototype.getState =  Class.getState
    prototype.onState = function(stateName,callback,context) {
        var stateMap
            ,triggerArr
        //转换
        //assertType(arguments,["String","Function","Object || Ignore"])
        stateName = PRE_STATE + stateName
        assert(this[stateName] !== undefined,"要监听的状态名"+stateName+"不存在!!")
        stateName = this[stateName][0] //状态名字转换
        //创建获取stateMap
        stateMap = this.__stateMap__ || (this.__stateMap__ = {})
        //debugger;
        //保存回调
        triggerArr = stateMap[stateName] || (stateMap[stateName]  = [])
        triggerArr.push([callback, context || this])
        return this
    }
    prototype.onceState = function(stateName, callback, context) {
        var newCallback = function() {
            callback.apply(context || this, arguments)
            this.unState(stateName, newCallback)
        }
        this.onState(stateName,newCallback,context)
        return this
    }
    prototype.triggerState = function(stateName) {
        var stateArr
        var _arguments = Array.prototype.slice.call(arguments,1) //获取参数
        stateName = PRE_STATE + stateName
        if (this.__stateMap__) {
            assert(this[stateName] !== undefined,"要监听的状态名"+stateName+"不存在!!")
            stateName = this[stateName][0] //状态名字转换
            //assert(this.__stateMap__[stateName] !== undefined,"监听的状态"+stateName+"没有相应事件!!")
            stateArr = this.__stateMap__[stateName] || []
            //debugger;
            stateArr.forEach(function(item){
                item && item[0].apply(item[1],_arguments) //执行事件回调
            })
        } else {
            //throw new Error('没有监听任何事件')
        }
        return this
    }

    prototype.unState = function(stateName, cb1, cb2) {
        var stateArr
            ,_arguments = arguments
        stateName = PRE_STATE + stateName
        if (this.__stateMap__) {
            assert(this[stateName] !== undefined,"要监听的状态名"+stateName+"不存在!!")
            stateName = this[stateName][0] //状态名字转换
            //assert(this.__stateMap__[stateName] !== undefined,"监听的状态"+stateName+"没有相应事件!!")
            stateArr = this.__stateMap__[stateName] || []
            if (_arguments.length > 1)  {
                stateArr.forEach(function(item,key){
                    for(var i= 1,len=_arguments.length; i<len; i++) {
                        if(item && (_arguments[i] == item[0])) {
                            stateArr[key] = undefined
                        }
                    }
                })
            } else {
                this.__stateMap__[stateName] = [] //清空所有事件
            }
        }
        return this
    }
    prototype.superInit = function() {
        assert(this.superClass.init, "父类没有构造函数init")
        this.superClass.init.apply(this,arguments)
        return this
    }
    prototype.superMethod = function() {
        var methodName = Array.prototype.shift.call(arguments)
        assert(this.superClass[methodName], "父类没有方法"+methodName)
        this.superClass[methodName].apply(this,arguments)
        return this
    }
    prototype.destroy = function() {
        objs.forEach(this, function(item, key, obj){
            //delete降低一点性能
            //具体见 http://www.alloyteam.com/2012/11/performance-writing-efficient-javascript/#prettyPhoto
            //delete obj[key]
            obj[key] = null
        })
        return this
    }
/*********************** 所有类构造器基本方法 ************************************/

    /*
    Class.pExtend = function() {
        var proto = this.prototype
        Array.prototype.unshift.call(arguments,proto)
        objs.extend.apply(this,arguments)
        return this
    }
    */
    Class.extend = function() {
        Array.prototype.unshift.call(arguments,this)
        objs.extend.apply(this,arguments)
        return this
    }
    Class.init = function(func) {
        assert(isFunction(func), '构造函数错误或为空!!')
        this.prototype.init = func
        return this
    }
    /*
     * @param {String} 可以多个
     * @param {String}
     */
    Class.order = function() {
        var __orders__ = this.__orders__ || (this.__orders__ = [])
        for(var i= 0,len=arguments.length;i!=len;i++){
            assert(types.isString(arguments[i]), "接口必须是字符串!!")
            __orders__.push(arguments[i])
        }
        return this
    }
    /**
     * todo:重复包装
     */
    Class.wrap = function() {
        var __wrapers__ = this.__wrapers__ || (this.__wrapers__ = [])
        for(var i= 0,len=arguments.length; i!=len; i++) {
            __wrapers__.push(arguments[i])
        }
        return this
    }
    Class.unWrap = function() {
        var __wrapers__ = this.__wrapers__ || (this.__wrapers__ = [])
        if(__wrapers__.length!=0) {
            objs.remove(__wrapers__, arguments)
        }
        return this
    }
    /**
     * @param {String}... 可以多个
     */
    Class.defState = function() {
        var proto = this.prototype
        var item
        for (var i = 0 , len = arguments.length; i!=len; i++) {
            item = arguments[i]
            assert(types.isString(item),"状态必须是字符串！！")
            item = PRE_STATE + item
            assert(ATTR_STATE_REG.test(item),"状态名"+item+"只能是大写字母或下划线!!")
            assert(proto[item] === undefined,"状态"+item+"已经被定义了！！")
            proto[item] = [item] //保证每个状态唯一,并在数组中储存下状态名字,便于触发调用
        }
        return this
    }
    /**
     * 状态创建别名
     */
    Class.aliasState = function(newState,oldState) {
        var proto = this.prototype
        //检测
        assertType(arguments,["String","String"])
        newState = PRE_STATE + newState
        oldState = PRE_STATE + oldState
        assert(ATTR_STATE_REG.test(newState),"状态名"+newState+"只能是大写字母或下划线!!")
        //assert(ATTR_STATE_REG.test(oldState),"状态名"+oldState+"只能是大写字母或下划线!!")
        assert(proto[newState] === undefined,"状态"+newState+"已经被定义了！！")
        assert(proto[oldState] !== undefined,"要创建的别名状态"+oldState+"不存在!!")
        proto[newState] = proto[oldState]
        return this
    }
    /**
     * 使用该方法调用状态更安全,用于实例和类
     */
    Class.getState = function(stateName) {
        var target = this.prototype || this
            ,state
        stateName = PRE_STATE + stateName
        //assert(types.isString(stateName),"状态必须是字符串！！")
        //assert(ATTR_STATE_REG.test(stateName),"状态名"+stateName+"只能是大写字母!!")
        assert((state = target[stateName]) !== undefined,"状态名"+stateName+"未定义")
        return state
    }
    Class.attr = function(obj) {
        var proto = this.prototype
        forEach(obj, function(item, key) {
            if(!isFunction(item)) { //todo 对象是否限制
                if(!ATTR_STATE_REG.test(key)) throw new Error("属性名"+key+"不合法!!")
                /**
                if(proto[key]!==undefined) {
                    console.log("重载父类方法"+key+"!!")
                }
                **/
                proto[key] = item
            }else {
                throw new Error("属性" +key+ "为函数!!")
            }
        })
        return this
    }
    Class.method =function(obj) {
        var proto = this.prototype
        var that = this
        var orders = this.getParent().__orders__ || []
            ,toggleArr = this.__toggleOnceArr__ || (this.__toggleOnceArr__ = [])
            ,toggleParentArr = this.getParent().__toggleOnceArr__ || []
            ,ordersCount = orders.length
        toggleParentArr = toggleParentArr.length !== 0
                            ? toggleParentArr.concat()
                            : null
        if(ordersCount === 0 || (this.hasOwnProperty('__orderCorrect__') && this.__orderCorrect__ === true)) {
            this.__orderCorrect__ = true
        }
        forEach(obj, function(item, key) {
            //过滤不能使用的方法名字
            METHOD_IGNORE_KEY.forEach(function(m){
                if(key === m) throw new Error('不能使用方法名: ' + key)
            })

            //接口检测
            if(!that.__orderCorrect__) {
                for(var i= 0, len=orders.length; i!=len; i++) {
                    if(orders[i].trim() === key) {
                        ordersCount--
                    }
                }
            }

            //添加到原型
            if(isFunction(item)) {
                proto[key] = item
            }else{
                throw new Error("属性" +key+ "为非函数!!")
            }

            //检测toggle数组
            if(toggleParentArr) {
                var _index
                    ,method1 = key
                    ,method2
                if((_index = toggleParentArr.indexOf(method1)) !==-1){
                    //method1
                    if(_index%3 ===0) {
                        method2 = toggleParentArr[_index+1]
                        if(method2 === null || (proto.hasOwnProperty(method2) && proto[method2])) {
                            //console.log('obj use method2: ', obj)
                            that.toggleOnce(method1,method2,toggleParentArr[_index+2]) //添加toggle
                            toggleParentArr.splice(_index,3)
                        }
                    //method2
                    }else{
                        method2 = key
                        method1 = toggleParentArr[_index-1]
                        if((proto.hasOwnProperty(method1) && proto[method1])) {
                            //console.log('obj use method1: ', obj)
                            that.toggleOnce(method1,method2,toggleParentArr[_index+1]) //添加toggle
                            toggleParentArr.splice(_index-1,3)
                        }
                    }
                }
            }

        })
        //检测接口
        if(ordersCount === 0) {
            this.__orderCorrect__ = true
        }else{
            throw new Error('父类接口['+ orders + ']未实现完!!')
        }
        //检测toggle
        if(toggleParentArr) {
            toggleArr.forEach(function(item){
                var index
                if((index = toggleArr.indexOf(item)) !== -1 && item !== null && index%3==0) {
                    toggleParentArr.splice(index,3)
                }
            })
            if(toggleParentArr.length !==0) {
                throw new Error("父类toggleOnce需要方法: "+toggleParentArr)
            }
        }
        return this
    }
    Class.toggleOnce = function(method1, method2, callback){
        var proto = this.prototype
            ,toggleArr
            ,oldMethod1,oldMethod2
            ,newFunc1, newFunc2
            ,index
            ,m1 = -1
            ,m2 = -1
        //获取toggleOnce数组
        toggleArr = this.__toggleOnceArr__ || (this.__toggleOnceArr__ = [])
        //assertType(arguments,['String','String || Function || Ignore', 'Function || Ignore'])
        assert(proto.hasOwnProperty(method1),'类未实现'+method1+'方法')
        //处理参数
        if (types.isFunction(method2)) {
            callback = method2
            method2 = null
        }
        //已经有了不重复添加, 若是有callback则更新
        m1 = toggleArr.indexOf(method1)
        method2 && (m2 = toggleArr.indexOf(method2))
        if((m1 !== -1 && m1%3!==0) || (!callback && (-1 !== m1 || -1 !== m2))) {
            return this
            //throw new Error('重复添加 toggleOnce')
        }
        if(m1 > m2 && m2 !== -1) {
            throw new Error (method1+'和'+method2+'倒置了!!')
        }
        //混入method1
        oldMethod1 = proto[method1]
        newFunc1 = function() {
            //若是调用父类method1， 则直接执行不进行判断
            if(!this['__is_'+method1] || this[method1] !== newFunc1) {
                oldMethod1.apply(this,arguments)
                this['__is_'+method1] = true
                return this
            }else {
                callback && callback.call(this, true)
                return this
            }
        }
        proto[method1] = newFunc1 //重写method1
        //混入method2
        if(method2) {
            assert(proto.hasOwnProperty(method2),'类未实现'+method2+'方法')
            oldMethod2 = proto[method2]
            newFunc2 = function() {
                //若是调用父类method2， 则直接执行不进行判断
                if(this['__is_'+method1] || this[method2] !== newFunc2) {
                    oldMethod2.apply(this,arguments)
                    this['__is_'+method1] = false
                    return this
                }else {
                    callback && callback.call(this, false)
                    return this
                }
            }
            proto[method2] = newFunc2 //重写method2
        }
        //加入数组
        if(m1 !== -1 && m1%3==0 ) {
            toggleArr.splice(m1,3,method1,method2,callback) //更新
        } else {
            toggleArr.push(method1,method2,callback)
        }
        return this
    }
    Class.make = function() {
        return new this.apply(this,arguments)
    }
    Class.final = function() {
        this.__final = true
        return this
    }
    Class.getParent = function() {
        return this.prototype.superClass.constructor
    }

    return Class
});