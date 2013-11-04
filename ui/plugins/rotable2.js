/**
 *  旋转插件
 *
 * @author by xvhaiqiang
 * @update by liuwencheng 使用transform插件 date 2013-5-21
 *
 */
define(function (require, exports) {
    "use strict"
    require('jquery.transform') //依赖
    require('zz/ui/plugins/state')

    var objs = require('zz/utils/objs')
        ,$ = require('jquery')
        ,Effect = require('zz/ui/base/Effect')
        ,Class = require('zz/core/Class')

    var Rotable = Class(Effect)
        .attr({
            DEFAULT_OPTS: {
                startFn: $.noop,
                stepFn: $.noop,
                endFn: $.noop
            },
            TYPE: 'rotable'
        })
        .method({
            bindEffect: function() {
                //调用父类bindEffect方法
                this.superClass.bindEffect.call(this)
                var target = this.$target
                var opts = this._opts
                var that = this
                //配置
                target.addClass('ui-rotatable')
                target.append('<div class="ui-rotable-box none">'+
                    '<div class="ui-rotable-handler" title="按住拖动旋转">'+
                    '</div><div class="ui-rotable-line"></div></div>')

                //获取旋转手柄，即上边的小圆点
                var $handler = target.find('.ui-rotable-handler')
                $handler.on('mousedown.rotate',function(e) {
                    var  oX,oY          //原点
                        ,startX,startY  //初始点
                        ,newX,newY      //新点
                        ,curAngle,newAngle
                    e.stopPropagation()
                    e.preventDefault()
                    //初始位置
                    startX = e.pageX
                    startY = e.pageY
                    //获取当前角度
                    curAngle = parseInt(target.attr('data-rotate') || 0)
                    //获取原点
                    oX = target.offset().left + target.width()/2
                    oY = target.offset().top + target.height()/2
                    opts.startFn && opts.startFn.call(that,e,opts)
                    //bind mousemove
                    $(document).on({'mousemove.rotate':function(e){
                        //新点
                        newX = e.pageX;
                        newY = e.pageY;
                        newAngle = curAngle + posToAngle(oX,oY,startX,startY,newX,newY),
                            newAngle = newAngle % 360
                        //使用transform插件
                        target.attr('data-rotate',newAngle)
                        target.transform({
                            rotate: newAngle+'deg'
                        })
                        opts.stepFn && opts.stepFn.call(that,e,opts)
                        e.preventDefault();
                        /**
                         _sin = Math.sin(360-(curAngle+newAngle)*2*Math.PI/360).toFixed(4),
                         _cos = Math.cos(360-(curAngle+curAngle)*2*Math.PI/360).toFixed(4);

                         target.css({transform:'rotate('+(curAngle+newAngle)+'deg)',
                        filter:'progid:DXImageTransform.Microsoft.Matrix(M11='+
                            _cos+',M12='+
                            _sin+',M21='+
                            -_sin+',M22='+
                            _cos+',SizingMethod="auto expand")'
                        });
                         target.css({
                        left:(w-currentEle.width())/2+x4,
                        top:(h-currentEle.height())/2+y4
                        });
                         **/
                    },'mouseup.rotate':function(e){
                        opts.endFn && opts.endFn.call(that,e,opts) //回调
                        $(document).off('.rotate'); //去除mousemove和mouseup事件
                        e.preventDefault();
                    }});
                })
            },
            unBindEffect: function() {
                this.superClass.unBindEffect.call(this)
                this.$target.removeClass('ui-rotable')
                this.$target.find('.ui-rotable-box').remove()
                return this
            }
        })

    $.fn.extend({
        /**
         * 为目标添加旋转功能
         */
        rotable2:function(opts) {
            //已经存在效果
            if(this.isState('rotable')) {
                var effectObj = this.data('rotableEffectObj') //获得effect实例对象
                effectObj.updateOpts(opts) //更新操作
                return this
            }
            var effectObj = new Rotable(this, opts) //创建新的实例
            effectObj.bindEffect()
            return this
        },
        /**
         * 去除旋转功能
         */
        unRotable2: function() {
            if(this.isState('rotable')) {
                var effectObj = this.data('rotableEffectObj')
                effectObj
                    .unBindEffect()
                    .destroy()
            }
            return this
        }
    })

    /**
     * 将坐标值转换为角度
     * 参数对应为: 原点x和y, 起点x和y, 终点x和y
     */
    function posToAngle(originX,originY,startX, startY, stopX,stopY){
        var angle;
        angle = Math.atan2(stopY-originY,stopX-originX)*180/Math.PI
            - Math.atan2(startY-originY,startX-originX)*180/Math.PI
        angle = (angle+360)%360
        return Math.round(angle);
    }

    return Rotable
})