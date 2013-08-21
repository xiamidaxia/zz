/**
 *
 * @author by liuwencheng
 * @date 2013-5-22
 *
 * @update by liuwencheng 2013-6-13 添加比例缩放
 * @bug 修复图片旋转之后jquery.offset定位失效 todo
 *
 */
define(function (require, exports) {
    "use strict"
    require('./draggable2')

    var objs = require('zz/utils/objs')
        ,$ = require('jquery')
        ,Effect = require('zz/ui/base/Effect')
        ,Class = require('zz/core/Class')
    //手柄模版
    var HANDLE_TEMP = '<li class="ui-resizable-handler ui-resizable-{{handle}}" data-action="resize-{{handle}}"></li>'
    var ALL_HANDLERS = ["ne","nw","se","sw","n","s","e","w"]

    var Resizable = Class(Effect)
        .attr({
            DEFAULT_OPTS:{
                handlers: ALL_HANDLERS, //默认全部显示
                ratio: false,           //是否按一定比例缩放
                grid: 0,                 //格子
                startFn: $.noop,
                stepFn: $.noop,
                endFn: $.noop
            },
            TYPE: "resizable"
        })
        .method({
            bindEffect: function() {
                this.superClass.bindEffect.call(this)
                var target = this.$target
                    ,opts = this._opts
                    ,that = this
                    ,LIMIT = 20
                //配置
                target.addClass('ui-resizable')
                //增加手柄
                this._addHandlers()
                target.children('.ui-resizable-box').children().each(function(key,item) {
                        var item = $(item)
                        var resizeType = item.attr('data-action').substr(7)
                        var fixedX,fixedY           //不动点,即对角线点
                        var setWidth,setHeight  //要设置的高宽
                        var angle
                        var offset
                        item.draggable2({
                            startFn: function(e) {
                                var offset = target.offset()
                                //this.zIndex(1000)
                                //this.css("backgroundColor", "blue")
                                this.$dragTarget.css({"visibility": "hidden"}) //隐藏拖动点
                                switch(resizeType) {
                                    case "ne":
                                        fixedX = offset.left
                                        fixedY = offset.top + target.height()
                                        break
                                    case "nw":
                                        fixedX = offset.left + target.width()
                                        fixedY = offset.top + target.height()
                                        break
                                    case "se":
                                        fixedX = offset.left
                                        fixedY = offset.top
                                        break;
                                    case "sw":
                                        fixedX = offset.left + target.width()
                                        fixedY = offset.top
                                        break
                                    case "n":
                                        fixedY = offset.top + target.height()
                                        break
                                    case "e":
                                        fixedX = offset.left
                                        break
                                    case "w":
                                        fixedX = offset.left + target.width()
                                        break
                                    case "s":
                                        fixedY = offset.top
                                        break
                                }
                                opts.startFn && opts.startFn.call(that,e,opts)
                            },
                            stepFn: function(e) {
                                e.isDrag = false
                                e.isResize = true
                                offset = target.offset()
                                angle = parseFloat(target.attr("data-rotate") || 0) //获取目标旋转的角度
                                var centerPos = _getCenterPos(offset.left,offset.top,target.width(),target.height())
                                //获取目标中心点的坐标
                                var newMousePoint =  _ro(e.pageX, e.pageY, centerPos,angle)
                                //置换鼠标位置
                                var pageX = getGridNum( newMousePoint[0],opts.grid)
                                var pageY = getGridNum( newMousePoint[1],opts.grid)
                                //要设定的高宽
                                setWidth = Math.abs(pageX - fixedX) > LIMIT ? Math.abs(pageX -fixedX) : LIMIT
                                setHeight = Math.abs(pageY - fixedY) > LIMIT ? Math.abs(pageY-fixedY) : LIMIT
                                setWidth = getGridNum(setWidth,opts.grid)
                                setHeight = getGridNum(setHeight,opts.grid)
                                switch(resizeType) {
                                    case "ne":
                                        if(pageY < fixedY - LIMIT) {
                                            target.offset({top: pageY}) //todo 对旋转的图片处理offset会有误差
                                            target.height(setHeight)
                                        }
                                        //是否按比例缩放
                                        if(opts.ratio) {
                                            target.width(setHeight*opts.ratio)
                                        }else {
                                            if(pageX > fixedX + LIMIT) {
                                                target.width(setWidth )
                                            }
                                        }
                                        break;
                                    case "nw":
                                        if(pageY < fixedY - LIMIT) {
                                            target.offset({top: pageY})
                                            target.height(setHeight)
                                        }
                                        if(opts.ratio) {
                                            //target.offset({left: })
                                            target.offset({left: fixedX-setHeight*opts.ratio})
                                            target.width(setHeight*opts.ratio)
                                        }else {
                                            if(pageX < fixedX - LIMIT) {
                                                target.offset({left: pageX})
                                                target.width(setWidth)
                                            }
                                        }
                                        break;
                                    case "se":
                                        if(pageY > fixedY + LIMIT) {
                                            target.height(setHeight)
                                        }
                                        if(opts.ratio) {
                                            target.width(setHeight*opts.ratio)
                                        } else {
                                            if(pageX > fixedX + LIMIT) {
                                                target.width(setWidth)
                                            }
                                        }
                                        break;
                                    case "sw":
                                        if(pageY > fixedY + LIMIT) {
                                            target.height(setHeight)
                                        }
                                        if(opts.ratio) {
                                            target.offset({left: fixedX-setHeight*opts.ratio})
                                            target.width(setHeight*opts.ratio)
                                        }else{
                                            if(pageX < fixedX - LIMIT) {
                                                target.offset({left: pageX})
                                                target.width(setWidth)
                                            }
                                        }
                                        break;
                                    case "n":
                                        if(pageY < fixedY - LIMIT) {
                                            target.offset({top: pageY})
                                            target.height(setHeight)
                                        }
                                        break;
                                    case "e":
                                        if(pageX > fixedX + LIMIT) {
                                            target.width(setWidth )
                                        }
                                        break;
                                    case "s":
                                        if(pageY > fixedY + LIMIT) {
                                            target.height(setHeight)
                                        }
                                        break;
                                    case "w":
                                        if(pageX < fixedX - LIMIT) {
                                            target.offset({left: pageX})
                                            target.width(setWidth)
                                        }
                                        break;
                                }
                                opts.stepFn && opts.stepFn.call(that,e,opts)
                            },
                            endFn: function(e) {
                                e.isDrag = false
                                e.isResize = true
                                opts.endFn && opts.endFn.call(that,e,opts) //回调
                            },
                            dragTarget: "clone",
                            cursor: resizeType+"-resize",
                            cursorAt: [7,7]
                        })
                })
            },
            unBindEffect: function() {
                this.superClass.unBindEffect.call(this)
                this.$target.removeClass('ui-resizable')
                this.$target.find('.ui-resizable-box').remove() //清除手柄
                //this.off('mousedown.resize')
                return this
            },
            updateOpts: function(opts) {
                this.superMethod('updateOpts',opts)
                this._addHandlers() //更新handlers
            },
            //添加手柄
            _addHandlers: function() {
                var tempArr = [] //模版
                var $handlerbox = this.$target.children('.ui-resizable-box')
                var curHandlers = this._opts.handlers.slice()
                //是否已经加入
                if($handlerbox.length == 0) {
                    ALL_HANDLERS.forEach(function(item) {
                        tempArr.push(HANDLE_TEMP.replace(/{{handle}}/g,item))
                    })
                    this.$target.append(
                        '<ul class="ui-resizable-box">'+
                            tempArr.join('')+
                            '</ul>'
                    )
                    $handlerbox = this.$target.children('.ui-resizable-box')
                }

                $handlerbox.children().each(function(index){
                    var type = $(this).attr('data-action').substr(7)
                    $(this).css('visibility','visible')
                    if(curHandlers.indexOf(type) === -1) {
                        $(this).css('visibility','hidden')
                    }
                })
                //var resizeType = item.attr('data-action').substr(7)
                //$handlerbox
            }
        })

    //注册jquery插件
    $.fn.extend({
        resizable2: function(opts) {
            //已经存在效果
            if(this.isState('resizable')) {
                var effectObj = this.data('resizableEffectObj') //获得effect实例对象
                effectObj.updateOpts(opts) //更新操作
                return this
            }
            var effectObj = new Resizable(this, opts) //创建新的实例
            effectObj.bindEffect()
            return this
        },
        unResizable2: function() {
            if(this.isState('resizable')) {
                var effectObj = this.data('resizableEffectObj')
                effectObj
                    .unBindEffect()
                    .destroy()
            }
            return this
        }
    })


    /**
     * 获取旋转之后的点
     */
    function _ro(x, y, centerPos, angle) {
        angle = angle * Math.PI/180
        x = x - centerPos[0]
        y = y - centerPos[1]
        /**
        var c = Math.sqrt(x*x + y*y )
        var startAngle =  Math.atan2(y,x) //开始弧度
        var newAngle = startAngle - angle

        var x = c * Math.cos(newAngle)
        var y = c * Math.sin(newAngle)
        **/
        var _x =x*Math.cos(angle)+y*Math.sin(angle)
        var _y =-x*Math.sin(angle)+y*Math.cos(angle)
        return [_x+centerPos[0], _y+centerPos[1]]
    }
    function _getCenterPos(left,top,width,height) {
        return [left+width/2,top+height/2]
    }
    function getGridNum(num,grid) {
        if(!grid) return Math.round(num)
        num = Math.round(num)
        var y = num % grid
        if(y<grid/2) {
            return num - y
        }else {
            return num - y + grid
        }
    }


    return Resizable
})