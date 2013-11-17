/**
 * 单元测试程序
 *
 * @author by liuwencheng
 * @date 2013-4-13
 *
 */
define(function(require,exports) {
    "use strict"
    var  objs = require('zz/utils/objs')
        ,asserts = require('zz/utils/asserts')
        ,assertType = asserts.assertType
        ,assert = asserts.assert
        ,assertEqual = asserts.assertEqual
        ,types  = require('zz/utils/types')
    var Class = require('zz/core/Class')
        ,TestUnit = require('zz/utils/TestUnit')
        ,noExpand = true    //不展开
    /******************与本测试相关的东西**********************/
    var $ = require('jquery')
    var Room, BigRoom
    /**********************测试列表**************************/
    var testCase = [
        ['toggleOnce简单实现', function() {
            Room = Class()
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
                        console.log('room open failure')
                    } else {
                        console.log('room close failure')
                    }
                })
            var r = new Room()
            r.close()   //room close failure
            r.open()    //room open
            r.open()    //room open failure
            r.close()   //room close
            this.triggerState("CORRECT")
        }
        ],
        ["toggleOnce继承实现", function(){
            BigRoom = Class(Room)
                .method({
                    'close': function(){
                        console.log('big close')
                        this.superMethod('close')
                    },
                    'open': function() {
                        console.log('big open')
                        this.superMethod('open')
                    }
                })
             var br = new BigRoom()
             br.close()   //room close failure
             br.open()    //big open, room open
             br.open()      //only Opened once
             br.close()     //big close, room close
            this.triggerState("CORRECT")
        }],
        ["toggleOnce回调重载", function(){
            BigRoom = Class(Room)
                .method({
                    'close': function(){
                        console.log('big close')
                        this.superMethod('close')
                    },
                    'open': function() {
                        console.log('big open')
                        this.superMethod('open')
                    }
                })
                .toggleOnce('open','close',function(state){
                    if(state) {
                        console.log('big open failure !!')
                    }else {
                        console.log('big close failure !!')
                    }
                })
            var br = new BigRoom()
            br.close()      //big close failure
            br.open()       //big open, room open
            br.open()      //big open failure !!
            br.close()     //big close, room close
            this.triggerState("CORRECT")
        }]
        /**
         * 例子,noExpand: 不展开
         *      context: 函数的执行空间
         *
        ["", function(){
            this.triggerState("CORRECT")
        },noExpand,context]
        */
    ]
    function init(){
        //配置
        var config = {
            setTest: true,
            setListen: true
        }
        //执行测试前
        var prefunc = function(){
        }
        //执行测试后
        var endfunc = function(){
        }
        var aTest = new TestUnit("测试Class",testCase,config,prefunc,endfunc)
        aTest.start()
    }
    init()
})