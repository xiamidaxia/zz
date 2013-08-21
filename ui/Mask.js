/**
 *  遮盖层
 *
 * @author by liuwencheng
 * @date 2013-6-19
 *
 */
define(function (require, exports) {
    "use strict"
    var Class = require('zz/core/Class')
        ,$ = require('jquery')
        ,Panel = require('zz/ui/base/Panel')
    var Mask = Class(Panel) //继承自Panel
        .attr({
            DEFAULT_OPTS: {
                color:'#000',
                opacity : 0.3,
                zIndex : 10000,
                isAnim : true,
                animTime: 200,
                closeToDispose: true
            }
        })
        .init(function (opts) {
            this.superInit(opts)
            this._create()
        })
        .method({
            _create: function() {
                var $target
                $target = this.$target = $('<div class="ui-mask"></div>')
                //$target.appendTo(document.body)
                $target.css({
                    width: $(document).width(),
                    height: $(document).height(),
                    position: 'fixed',
                    overflow: 'hidden',
                    left: 0,
                    top:0,
                    backgroundColor: this._opts.color,
                    zIndex: this._opts.zIndex,
                    opacity: this._opts.opacity
                })
                $target[0].style.filter = 'alpha(opacity=' + this._opts.opacity * 100 + ')'

                if ($.browser.msie && $.browser.version == 6) {
                    // fix <select> bug
                    $target
                        .css('position','absolute')
                        .html('<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;z-index=-1;filter:alpha(opacity=0);"></iframe>')
                }
                this.triggerState('CREATE')
                return this
            },
            open: function() {
                if (!this.$target) this._create()
                if (this._opts.isAnim) {
                    this.$target
                        .appendTo(document.body)
                        .show()
                        .css('opacity', 0)
                        .animate({
                            'opacity': this._opts.opacity
                        }, this._opts.animTime
                        //打开之后的函数回调
                        , (function() {
                            this._bindEvent()
                            this.triggerState('OPEN')
                        }).bind(this))
                } else {
                    this.$target.hide()
                        .appendTo(document.body)
                        .show()
                    this._bindEvent() //todo
                    this.triggerState('OPEN')
                }
                return this
            },
            close: function() {
                if (this._opts.isAnim) {
                    this.$target.animate({
                        opacity:0
                    }, this._opts.animTime
                    //关闭之后的函数回调
                    , (function(){
                        this.superMethod('close')
                    }).bind(this))
                } else {
                    this.superMethod('close')
                }
                return this
            },
            _bindEvent: function() {
                if(!this._resizeFunc) {
                    this._resizeFunc = (function() {
                        this.$target
                            .width($(document).width())
                            .height($(document).height())
                    }).bind(this)
                }
                $(window).on('resize.mask', this._resizeFunc)
                //todo 阻止滚动
                return this
            },
            _unBindEvent:function() {
                $(window).off('resize.mask')
                this.$target.off('scroll.mask')
                return this
            }
        })
    return Mask
})