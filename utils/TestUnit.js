/**
 *      单元测试
 *      项目中需要this.triggerState("ERROR")  this.triggerState("TEST_END")
 * @author by liuwencheng
 * @date 2013-4-14
 *
 */
define(function(require,exports) {
    "use strict"
    var  objs = require('zz/utils/objs')
        ,asserts = require('zz/utils/asserts')
        ,global = require('global/manager')
        ,assertType = asserts.assertType
        ,assert = asserts.assert
    var Class = require('zz/core/Class')
    var defaultConfig = {
        "setListen": global.get("DEBUG_LISTEN",false),
        "setTest": global.get("DEBUG_TEST",false),
        "ignoreCase": [],
        'isExpand': true
    }
    var TestUnit = Class()
            //.defState("TEST_READY")
            .defState("CORRECT","ERROR","TEST_END","TEST_ITEM_END")
            /**
             *  @param {String}
             *  @param {Array} testCase
             *          格式： [
             *          ["测试名字",function(){
             *
             *          },context], //context可选
             *          ["测试名字",function(){
             *
             *          },context],
             *
             *          ]
             *  @param {Function}
             *  @param {Function}
             */
            .init(function(testName,testCase,config,preFunc,endFunc) {
                console.log("%c    **********" + testName +"************    ",
                    "color:white;background-color:#26BDCE;font-weight:bolder;")
                this.testName = testName //测试程序名字
                this.testCase = testCase //测试单
                this.curTestItem = testCase.shift() //当前测试项目
                this.curIndex = 0
                this.preFunc = preFunc //开始程序
                this.endFunc = endFunc //结束程序
                this.config = objs.extend({},defaultConfig,config)
                this.curItemStartTime = 0
                //处理config
                if(this.config.setTest) global.set("DEBUG_TEST",true)
                if(this.config.setListen) global.set("DEBUG_LISTEN",true)
                //每个项目结束回调
                this.onState("TEST_ITEM_END", (function(){
                    if(0!==this.testCase.length) {
                        this.curTestItem = this.testCase.shift()
                        this.curIndex++
                        this.start()
                    }else { //项目结束
                        this.triggerState("TEST_END")
                    }
                }).bind(this))
                //测试结束回调
                this.onState("TEST_END", (function(){
                    this.endFunc && this.endFunc()
                    console.log("%c    **********" + this.testName +"************    ",
                            "color:white;background-color:#26BDCE;font-weight:bolder;")
                    global.set("DEBUG_TEST",defaultConfig.setTest)
                    global.set("DEBUG_LISTEN",defaultConfig.setListen)
                    this.destroy() //清除监听
                }).bind(this))
                //测试正确
                this.onState("CORRECT",(function(){
                    console.groupEnd && console.groupEnd()
                    logCorrect("√ \'"+this.curTestItem[0]+"\'  ",Date.now()-this.curItemStartTime)
                    this.triggerState("TEST_ITEM_END")
                }).bind(this))
                //测试错误
                this.onState("ERROR",(function(){
                    console.groupEnd && console.groupEnd()
                    logError("X \'"+this.curTestItem[0]+"\'",Date.now()-this.curItemStartTime)
                    this.triggerState("TEST_ITEM_END")
                }).bind(this))
            })
            .method({
                /**
                 *  开始测试
                 *
                 */
                start: function(){
                    if(this.config.ignoreCase.indexOf(this.curIndex+1) !== -1) {
                        this.triggerState("TEST_ITEM_END")
                        return
                    }
                    this.preFunc && this.preFunc()
                    this.curItemStartTime = Date.now()
                    var curTestItem = this.curTestItem[1]
                    var context = this.curTestItem[2]
                    if (this.config.isExpand) console.group && console.group()
                    else console.groupCollapsed && console.groupCollapsed()
                    try {
                        context
                        ? curTestItem.call(context) //监听测试程序
                        : curTestItem.call(this)
                    }catch (error) {
                        /**
                        if(error.stack) {
                            console.error("%c"+error.stack, "color:#c41a16") //捕获错误
                        } else {
                        **/
                        //console.error("%c"+error, "color:#c41a16") //捕获错误
                        //延迟扔出错误
                        setTimeout((function(){
                            this.triggerState('ERROR')
                        }).bind(this),0)
                        throw error
                    }finally {
/*                        if(isTrue) {
                        }else {
                            //console.log("%c%s","color:#C41A16",_error.message)
                        }*/
                    }
                }
            })
    //输出错误
    function logCorrect(message,lastTime) {
        var timeInfo = lastTime!==undefined ? (lastTime + "ms") : ""
        console.log("%c"+message+" %c"+timeInfo
                ,"color:green;font-weight:bolder"
            ,"color:#005AE7;font-weight:bolder")
    }
    //输出正确
    function logError(message,lastTime) {
        var timeInfo = lastTime!==undefined ? (lastTime + "ms") : ""
        console.log("%c"+message+" %c"+timeInfo
                ,"color:red;font-weight:bolder"
            ,"color:#005AE7;font-weight:bolder;")
    }
    return TestUnit
})