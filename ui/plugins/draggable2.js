/**
 * 拖拽
 *
 * @version 0.2
 * @author by liuwencheng
 * @date 2013-5-22
 *
 *          使用方法:
 *              $('#test').draggable({
 *                  dragTarget: "clone" //拖拽克隆
 *                  dragScope: "#testParent"
 *                  grid: 10 //格子移动
 *                  cursorAt: [3,4]
 *                  snapArr: [[124,55,66],[334,55,666]] //子数组一为left, 子数组二为top
 *                  snapLen:5
 *              }) //opts更详细配置见defaultOpts
 *
 *  0.01: 实现基本拖拽 draggable,unDraggable,trigerDrag
 *  0.2: 继承自"zz/ui/base/Effect" 实现类 @update 2013-6-13
 *
 *  Thanks to jquery ui
 */
define(function(require,exports) {
    "use strict"
    require('zz/ui/plugins/state')

    var $ = require('jquery')
        ,objs = require('zz/utils/objs')
        ,types = require('zz/utils/types')
        ,math = require('zz/utils/math')
        ,Effect = require('zz/ui/base/Effect')
        ,Class = require('zz/core/Class')

    var Draggable =  Class(Effect)
        .attr({
            DEFAULT_OPTS: {
                appendTo: document.body,    //copy的dragTarget放置的目标, 默认放置到body
                dragTarget: "self",         //"clone" , 或者返回自己创建的节点, 参照jquery-ui-draggable.helper
                cursor: "move",
                dragScope: "window",        //parent, window, dom-id
                addTargetScope: true,       //判定dragScope计算的时候是否扩充taget的宽和高,
                grid: 0,
                cursorAt: null,              //[3,3]
                snapLen: 5,                  //吸附宽度
                snapAppendTo: document.body,       //吸附线存放处
                startFn: $.noop,
                endFn: $.noop,
                stepFn: $.noop
            },
            TYPE: 'draggable'
        })
        .init(function(target, opts){
            this.superInit(target, opts)
            this.$dragTarget = this.$target     //被拖动的目标
            this.dragLen =[0,0]     //拖动距离, 第一个为left, 第二个top
        })
        .method({
            bindEffect: function() {
                //调用父类bindEffect方法
                this.superClass.bindEffect.call(this)

                var target = this.$target
                    ,opts = this._opts
                    ,that = this
                //类
                target.addClass('ui-draggable')
                //target.attr('draggable', false)
                //target.css("cursor",opts.cursor)
                //bind
                target.on('mousedown.drag', function(e,_e) {
                    var diffX,diffY,oldOffset
                    //解决triggerDrag bug
                    if(_e) {
                        e.pageX = _e.pageX
                        e.pageY = _e.pageY
                    }
                    e.stopPropagation()
                    e.preventDefault()
                    //获取要拖动的目标
                    switch(opts.dragTarget) {
                        case "self" :
                            that.$dragTarget = target //直接拖动target
                            break
                        case "clone":
                            that.$dragTarget = target.clone().prependTo(opts.appendTo) //默认放置到body
                            //dragTarget.css('background-color','blue') 测试
                            //dragTarget.css('z-index','1000')
                            break
                        default:
                            that.$dragTarget = opts.dragTarget //todo 返回配置指定的移动副本
                    }
                    //设置cursor
                    that.$dragTarget.css("cursor",opts.cursor)
                    $(document.body).css("cursor",opts.cursor)
                    //复制原始位置
                    oldOffset = {
                        "left": target.offset().left,
                        "top": target.offset().top
                    }
                    //获取鼠标相对目标dom的位置
                    diffX = e.pageX - oldOffset.left
                    diffY = e.pageY - oldOffset.top
                    if(opts.cursorAt) {
                        diffX = opts.cursorAt[0]
                        diffY = opts.cursorAt[1]
                    }
                    //开始回调
                    opts.startFn && opts.startFn.call(that,e,opts)
                    $(document).on({'mousemove.drag':function(e) {
                        //解决triggerDrag bug
                        //设置目标offset
                        that._setOffset(that.$dragTarget,e.pageX-diffX, e.pageY-diffY, opts)
                        var newOffset = that.$dragTarget.offset()
                        that.dragLen = [newOffset.left - oldOffset.left, newOffset.top - oldOffset.top]
                        //回调
                        opts.stepFn && opts.stepFn.call(that,e,opts)
                        //e.stopPropagation()
                        e.preventDefault(); //ie上bug

                    },'mouseup.drag':function(e) {
                        opts.endFn && opts.endFn.call(that,e,opts) //回调
                        $(document.body).css("cursor","auto")
                        $(document).off('.drag') //清除mousemove，mouseup
                        if(that.$dragTarget !== target) {
                            that.$dragTarget.remove() //todo 修正drop
                            that.$dragTarget = null
                        }
                        e.preventDefault(); //ie上bug
                    }})
                })
                return this
            },
            unBindEffect: function() {
                this.superClass.unBindEffect.call(this)
                this.$target.removeClass('ui-draggable')
                this.$target.off('mousedown.drag')
                $(document).css('cursor',"auto")
                return this
            },
            //设置拖拽目标的位置
            _setOffset: function(target,offsetX, offsetY,opts) {
                var limitElem //拖拽限制的节点, 默认父节点
                    ,scope = opts.dragScope
                    ,addTargetScope = opts.addTargetScope
                    ,grid = opts.grid
                    , minX, minY, maxX, maxY
                    ,angle = parseFloat(target.attr("data-rotate") || 0) //有角度重新计算拖动范围
                    ,angleRect =  math.getRotateRect(target.width(),target.height(),angle) //目标旋转之后的外围矩形
                    ,tWidth = angleRect[0] //旋转之后的新目标宽
                    ,tHeight = angleRect[1] //旋转之后的新目标高
                //判断是否需要限制
                if(scope != "window") {
                    if(scope == "parent") {
                        limitElem = target.parent()
                    }else if(types.isObject(scope)) {
                        limitElem = scope  //若是jquery对象直接获取
                    }else {
                        limitElem = $('#' + scope)
                    }
                    minX = limitElem.offset().left
                    minY = limitElem.offset().top
                    maxX = minX + limitElem.width() - tWidth
                    maxY = minY + limitElem.height() - tHeight
                }else {
                    //window scope
                    minX = 0
                    minY = 0
                    maxX = $(window).width() - tWidth
                    maxY = $(window).height() - tHeight
                }
                //获取限制的矩形
                //增加目标宽高,则扩大限制矩形
                if(addTargetScope) {
                    minX = minX - tWidth
                    minY = minY - tHeight
                    maxX = maxX + tWidth
                    maxY = maxY + tHeight
                }
                //限制位置
                offsetX = (minX < offsetX) ? offsetX : minX
                offsetY = (minY < offsetY) ? offsetY : minY
                offsetX = (maxX > offsetX) ? offsetX : maxX
                offsetY = (maxY > offsetY) ? offsetY : maxY

                //吸附
                if(opts.snapArr) {
                    var border = parseInt(target.css('borderWidth') || 0)
                    offsetX = this.getSnapNum(offsetX + tWidth + border*2, "x")  - tWidth - border*2
                    offsetY = this.getSnapNum(offsetY + tHeight + border*2, "y") - tHeight - border*2
                    offsetX = this.getSnapNum(offsetX, "x")
                    offsetY = this.getSnapNum(offsetY, "y")
                }

                target.offset({
                    left: math.getGridNum(offsetX,grid),
                    top:  math.getGridNum(offsetY,grid)
                })
            },
            getSnapNum: function(num, type) {
                var snapArr = this._opts.snapArr[0]
                    ,snapLen = this._opts.snapLen
                    ,scope = this._opts.dragScope
                    ,newNum
                    ,$parent
                if(type == "y") {
                    snapArr = this._opts.snapArr[1]
                }
                newNum = math.getSnapNum(num, snapArr, snapLen)
                if(newNum === num) {
                    return num
                } else {
                    //获取画线存放的父类节点
                    /**
                    if(scope === "parent") {
                        $parent = this.$target.parent()
                    }else if(scope === "window"){
                        $parent = $(window)
                    }else if(types.isObject(scope)) {
                        $parent = scope
                    }else {
                        $parent = $('#' + scope)
                    }
                    **/
                    //画线
                    this.showSnapLine(this._opts.snapAppendTo, type === "y" ? "x" : "y", newNum)
                    return newNum
                }
            },
            showSnapLine: function(appendTo, type, val) {
                var $snap = $("<div class='ui-snap-line-"+type+"'></div>")
                $snap.appendTo(appendTo)
                if(type == "x") {
                    $snap.offset({top: val})
                }else {
                    $snap.offset({left: val})
                }
                function cb(){
                    $snap.remove()
                }
                setTimeout(cb, 500)
            }
        })
        //createSnapLine($(document.body), "x", 100)


    //jquery插件配置
    $.fn.extend({
        draggable2: function(opts) {
            //已经存在效果
            if(this.isState('draggable')) {
                var effectObj = this.data('draggableEffectObj') //获得effect实例对象
                effectObj.updateOpts(opts) //更新操作
                return this
            }
            var effectObj = new Draggable(this, opts) //创建新的实例
            effectObj.bindEffect()
            return this
        },
        unDraggable2: function() {
            if(this.isState('draggable')) {
                var effectObj = this.data('draggableEffectObj')
                effectObj
                    .unBindEffect()
                    .destroy()
            }
            return this
        },
        /**
         * 触发开始拖拽事件, 用于绑定drag的时候马上触发拖拽
         * @param event 需要传入事件的event
         */
        triggerDrag2: function(event) {
            if(this.isState('draggable')) {
                this.trigger('mousedown.drag',event)
            }else {
                throw new Error('未注册拖拽')
            }
            return this
        }
    })




    return Draggable

})