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
    /******************与本测试相关的东西**********************/
    var $ = require('jquery')
    /**********************测试列表**************************/
    var ignoreCase = [1,2,3,4]
    var testCase = [
        ["1:测试Dialog", function(){
            var curCase = this
            var Dialog = require('./Dialog')
            var dlg = new Dialog()
            dlg.onState('OPEN', function() {
                console.log('Dialog is Opened')
                this.close()
            })
            .onState('CLOSE', function() {
                console.log('Dialog is closed')
                curCase.triggerState("CORRECT")
            })
            .open()
        }],
        ["2:测试Mask", function(){
            var curCase = this
            var Mask = require('./Mask')
            var mask1 = new Mask({
                color: 'blue',
                opacity: 0.6,
                animTime: 2000 //2秒
            })
            mask1
                .onState('OPEN', function(){
                    console.log('mask is Open')
                    this.close()
                    //this.close()
                })
                .onState('CLOSE', function() {
                    console.log('mask is Close')
                    /**
                    var mask2 = new Mask({
                        color: 'yellow'
                    })
                    mask2.open()
                    **/
                    curCase.triggerState("CORRECT")
                })
                .open()
                .open()  //无效
                .close() //close被延迟执行

        }],
        ['3:测试ScrollBar', function() {
            var scroll = new (require('zz/ui/ScrollBar'))({
                isVertical: false,       //是否为垂直
                appendTo: '#diyLeft'
            })
            .open()

            this.triggerState('CORRECT')
        }],
        ['4: 测试selectable', function() {
            require('zz/ui/plugins/selectable')
            $(document.body).selectable2({
                endFn: function() {
                    //this.unSelectabel2()
                }
            })
            this.triggerState('CORRECT')
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
            setListen: true,
            ignoreCase: ignoreCase,
            isExpand: true
        }
        //执行测试前
        var prefunc = function(){
        }
        //执行测试后
        var endfunc = function(){
        }
        var aTest = new TestUnit("测试ui组件",testCase,config,prefunc,endfunc)
        aTest.start()
    }
    init()
})