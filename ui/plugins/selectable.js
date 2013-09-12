/**
 * 选择框
 *
 * @author by liuwencheng
 * @date 2013-6-25
 *
 * @update by liuwencheng on 2013-7-17
 *      修复pageY，pageX 为 pageY, pageX
 *      添加ignoreClass
 * @update by liuwencheng on 2013-9-12  添加scopeElem
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

    var Selectable =  Class(Effect)
        .attr({
            DEFAULT_OPTS: {
                addClass: 'ui-selected',   //子元素被选择时候加的类
                seleClass: '',              //子元素需要包含的类
                ignoreClass: '',            //若子元素包含该类 则被排除选中
                startFn: $.noop,
                scopeElem: null,            //要选择元素的父节点
                endFn: $.noop,
                stepFn: $.noop,
                isCancel: false             //是否暂时取消选择框
            },
            TYPE: 'selectable',
            SELECT_BOX_TMPL: "<div class='ui-selectable-box none'></div>"
        })
        .init(function($target, opts){
            this.superInit($target,opts)
            this.$seleBox = $(this.SELECT_BOX_TMPL)
            $target.append(this.$seleBox)
            this.$seleArr = [] //被选中的元素
            //选择矩形的初始位置
            this.originX = 0
            this.originY = 0
        })
        .method({
            bindEffect: function() {
                var $target = this.$target
                    ,opts = this._opts
                    ,$seleBox = this.$seleBox
                    ,that = this
                this.superClass.bindEffect.call(this)
                //$target.addClass('ui-selectable')
                $target.on('mousedown.select', function(e,_e) {
                    e.preventDefault()
                    e.stopPropagation()
                    //是否取消
                    if(that._opts.isCancel) return
                    //解决triggerSelect2 bug
                    if(_e) {
                        e.pageX = _e.pageX
                        e.pageY = _e.pageY
                    }
                    that.$seleArr = [] //bug 不能用length=0, 重新定义一个以免影响之前选中的数组
                    //保存初始位置
                    that.originX = e.pageX //update by liuwencheng
                    that.originY = e.pageY
                    $seleBox.show().offset({
                        left: that.originX,
                        top: that.originY
                    })
                        .width(0).height(0) //清除

                    that._seleChildren() //选择被选中的节点
                    opts.startFn && opts.startFn.call(that,e,opts)
                    $(document).on({'mousemove.select':function(e) {
                        //设定选择矩形的宽高及位置
                        that._setSeleBox(e.pageX, e.pageY)
                        //选择目标的子类节点
                        that._seleChildren()
                        //回调
                        opts.stepFn && opts.stepFn.call(that,e,opts)
                        e.preventDefault() //ie上bug
                    },'mouseup.select':function(e) {
                        if (that._opts.scopeElem) $target = that._opts.scopeElem
                        $target.children().removeClass(that._opts.addClass) //清除选中的选择框
                        opts.endFn && opts.endFn.call(that,e,opts) //回调
                        $(document).off('.select')
                        $seleBox.hide()
                        e.preventDefault() //ie上bug
                    }})
                })
                return this
            },
            unBindEffect: function() {
                this.superClass.unBindEffect.call(this)
                this.$target.off('mousedown.select')
                this.$seleBox.remove()
                return this
            },
            getSeleArr: function() {
                return  this.$seleArr
            },
            /**
             *  选择target的被选择器包围的子类节点
             *  修改：若指定scopeElem将在该元素中选择 update by liuwencheng 2013-9-12
              */
            _seleChildren: function() {
                var $seleBox = this.$seleBox
                var that = this
                var $target = this._opts.scopeElem || this.$target
                this.$seleArr.length = 0   //清空
                $target.children("." + this._opts.seleClass).each(function(){
                    var $this = $(this)
                    if($this.is($seleBox)) return
                    if($this.hasClass(that._opts.ignoreClass)) return
                    var tMin = $this.offset()
                        ,tMax = {left: tMin.left + $this.width(),
                                 top: tMin.top + $this.height()}
                        ,min = $seleBox.offset()
                        ,max = {left: min.left + $seleBox.width(),
                                top: min.top + $seleBox.height()}
                       //起始点在目标的左上角
                    if(min.left < tMax.left && min.top < tMax.top &&
                       //拖动点超过目标的原点
                       max.left > tMin.left && max.top > tMin.top) {
                       $this.addClass(that._opts.addClass)
                       that.$seleArr.push($this) //添加到选择中
                    }
                    else {
                        $this.removeClass(that._opts.addClass)
                    }

                })
            },
            /**
             * 设置选择器矩形的宽高及位置
             */
            _setSeleBox: function(newX, newY) {
                var originX = this.originX
                    ,originY = this.originY
                    ,$seleBox = this.$seleBox
                //设置x
                if(newX >= originX) {
                    $seleBox.width(newX-originX)
                }else{
                    $seleBox.offset({
                        left: newX
                    })
                        .width(originX-newX)
                }
                //设置y
                if(newY >= originY) {
                    $seleBox.height(newY-originY)
                }else{
                    $seleBox.offset({
                        top: newY
                    })
                        .height(originY-newY)
                }
            }
        })

    //jquery插件配置
    $.fn.extend({
        selectable2: function(opts) {
            //已经存在效果
            if(this.isState('selectable')) {
                var effectObj = this.data('selectableEffectObj') //获得effect实例对象
                effectObj.updateOpts(opts) //更新操作
                return this
            }
            var effectObj = new Selectable(this, opts) //创建新的实例
            effectObj.bindEffect()
            return this
        },
        unSelectabel2: function() {
            if(this.isState('selectable')) {
                var effectObj = this.data('selectableEffectObj')
                effectObj
                    .unBindEffect()
                    .destroy()
            }
            return this
        },
        /**
         * 触发开始拖拽选择, 用于绑定选择的时候马上触发
         * @param event 需要传入事件的event
         */
        triggerSelect2: function(event) {
            if(this.isState('selectable')) {
                this.trigger('mousedown.select',event)
            }else {
                throw new Error('未注册选择')
            }
            return this
        }
    })

    return Selectable

})