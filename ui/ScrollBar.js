/**
 * ???
 *
 * @author by liuwencheng
 * @date 2013-6-23
 *
 */
define(function (require, exports) {
    "use strict"
    require('jquery.mousewheel')
    var objs = require('zz/utils/objs')
    var Class = require('zz/core/Class')
        ,Panel = require('./base/Panel')
        ,$ = require('jquery')
    var ScrollBar = Class(Panel)
        .attr({
            DEFAULT_OPTS: {
                appendTo: document.body,
                closeToDispose: true,
                isVertical: true,       //?????
                className: 'ui-scroll-y',
                step: 5
            },   //????
            TMPL: "<div id='${id}' class='ui-panel ui-scroll-wrap ${className}'><div class='ui-scroll-bar none'></div></div>"
        })
        .init(function (opts) {
            this.superInit(opts)
            this.$parent = $(this._opts.appendTo)
            this.$scrollbar = null  //滚动控制条
            this._scrollYLength = 0 //当前可以滚动的总长度
            this._curScrollY = 0 //当前滚动的距离
            this._scaleY = 0 //控制条缩放比例
        })
        .method({
            _create: function() {
                this.superMethod('_create')
                this.$scrollbar = this.$target.find('.ui-scroll-bar')
                return this
            },
            open: function() {
                this.superMethod('open')
                this.setScrollbar()
                return this
            },
            close: function() {
                this.superMethod('close')
                return this
            },
            setScrollbar: function() {
                this._scrollYLength = this.$parent.get(0).scrollHeight - this.$parent.height()
                console.log('scrollYLength: '+ this._scrollYLength)
                if(this._scrollYlength !== 0) {
                    this.$scrollbar.show()
                }
                this._scaleY = (this.$target.height()-this.$scrollbar.height())/this._scrollYLength
                return this._scrollYLength
            },
            _bindEvent: function(){
                var that = this
                    ,scrollType
                //"DOMMouseScroll" : "mousewheel"
                this.$parent
                    .hover(function(){
                        that.setScrollbar()
                        $(this).mousewheel(function(e, delta, deltaX, deltaY){
                            if(deltaY>0) {
                                //上滚
                                that.scrollTo(-that._opts.step, 'y')
                            }else if(delta<0){
                                //下滚
                                that.scrollTo(that._opts.step, 'y')
                            }else{
                                if(deltaX>0) {

                                }else{

                                }
                            }
                        })

                    })
                    /**
                    .on('mouseenter.scrollbar',function(e){
                        that.$parent
                            //that.scrollTo(that._opts.step, 'y')
                            .mousewheel(function(e, delta, deltaX, deltaY){
                                console.log(delta)
                            })
                        e.preventDefault()
                        e.stopPropagation()
                    })
                    .on('mouseleave.scrollbar',function(e){
                        //that.$parent.unmousewheel()
                    })
                    **/
                this.$scrollbar
                    .on('click.scrollbar', function(){
                    })

                return this
            },
            _unBindEvent: function() {
                this.$parent
                    .unmousewheel()
                    .off('.scrollbar')
                this.$scrollbar.on('.scrollbar')
                return this
            },
            /**
             * @param {Number}  滚动长度
             * @param {Number} 滚动类型 "y" || "x"
             */
            scrollTo: function(step, type) {
                switch(type) {
                    case 'y':
                        this._curScrollY+=step
                        if(this._curScrollY>this._scrollYLength) this._curScrollY = this._scrollYLength
                        if(this._curScrollY<0) this._curScrollY=0
                        this.$parent.scrollTop(this._curScrollY)
                        this.$scrollbar.css('top',this._curScrollY*this._scaleY)
                        break
                    case 'x':
                        break;
                }

            }
        })

    $.fn.extend({
        scrollable: function() {

        },
        unScrollable: function() {
        }
    })

    return ScrollBar
})