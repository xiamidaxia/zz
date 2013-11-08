/**
 * 拖动条
 * @author by liuwencheng
 * @date 2013-9-25
 */
define(function(require,exports) {
    "use strict"
    require('./plugins/draggable2')
    var Class = require('zz/core/Class')
      , Panel = require('./base/Panel')

    var Range = Class(Panel)
        .defState('RANGE_CHANGE')
        .attr({
            DEFAULT_OPTS: {
                changeFn: function(rangeVal){}, //rangeVal为所移动的值
                css: {},         //设置css
                stepLen: 3,       //点击放大缩小按钮缩放大小
                scope: [0,100],     //移动范围
                action: {
                    "smaller": function(){console.log('smaller')}
                }
            },
            TMPL: "<div class=\"ui-range ui-panel\">\n    <a class=\'ui-range-smaller\'>-</a>\n    <a class=\'ui-range-btn\'></a>\n    <a class=\'ui-range-bigger\'>+</a>\n</div>\n"
        })
        .init(function(opts){
            this.superInit(opts)
            this._opts
            this.$target
            this.$range         //砝码
            this.$bigger         //放大按钮
            this.$smaller        //缩小按钮
            this.rangeVal = 0   //range改变的值 0-100
            this._create()
        })
        .method({
            _create: function(){
                this.superMethod('_create')
                this.onState('RANGE_CHANGE', this._opts.changeFn)
                this.$range = this.$target.children('.ui-range-btn')
                this.$bigger  = this.$target.children('.ui-range-bigger')
                this.$smaller = this.$target.children('.ui-range-smaller')
            },
            open: function(){
                this.superMethod('open')
            },
            close: function() {
                this.superMethod('close')
            },
            setRange: function(value) {
                this._setRange(this._toRangeVal(value))
            },
            getRangeVal: function () {
                return this._toScopeVal(this.rangeVal)
            },
            _setRangeVal: function(value) {
                this.rangeVal = value
                this.$target.attr('data-value', value)
                this.triggerState("RANGE_CHANGE", this._toScopeVal(value))
            },
            _setRange: function(value){
                this.$range.css('left', value)
                this._setRangeVal(value)
            },
            bigger: function(){
                var newVal = this.rangeVal + this._opts.stepLen
                if (newVal > 100) newVal = 100
                this._setRange(newVal)
            },
            smaller: function(){
                var newVal = this.rangeVal - this._opts.stepLen
                if (newVal < 0) newVal = 0
                this._setRange(newVal)
            },
            /**
             *  将值转换为range范围值(0-100)
             */
            _toRangeVal: function (scopeVal) {
                var minRatio = this._opts.scope[0]
                var maxRatio = this._opts.scope[1]
                //ratioVal = ratioVal - minRatio
                return  ( scopeVal - minRatio ) / (maxRatio - minRatio) * 100
            },
            /**
             *  将值转换为为scope指定范围值
             */
            _toScopeVal: function (rangeVal) {
                var minRatio = this._opts.scope[0]
                var maxRatio = this._opts.scope[1]
                return rangeVal / 100 * (maxRatio - minRatio) + minRatio
            },
            _bindEvent: function() {
                var that = this
                var _originLeft  //初始光标left平移
                this.superMethod('_bindEvent')
                _originLeft = this.$range.position().left
                this.$range.draggable2({
                    dragScopeX: [0, 100],
                    stepFn: function(){
                        //this.$target.css('top','-8px')
                        var newVal = that.$range.position().left - _originLeft
                        that._setRangeVal(newVal)
                    },
                    noMoveY: true, //不移动y轴
                    cursor: "pointer"
                })
                this.$bigger.on('mousedown', function(e){
                    that.bigger()
                    e.preventDefault()
                    e.stopPropagation()
                    return false
                })
                this.$smaller.on('mousedown', function(e){
                    that.smaller()
                    e.preventDefault()
                    e.stopPropagation()
                    return false
                })
            },
            _unBindEvent: function() {
                this.superMethod('_unBindEvent')
                this.$range.unDraggable2()
                this.$bigger.off('mousedown')
                this.$smaller.off('mousedown')
            }
        })

    return Range
})