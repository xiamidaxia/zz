/**
 * 颜色选择器  颜色多的色块
 *
 * @author by liuwencheng
 * @date 2013-6-1
 *
 */
define(function (require, exports) {
    "use strict"
    require('jquery.color')

    var objs = require('zz/utils/objs')
        , asserts = require('zz/utils/asserts')
        , assertType = asserts.assertType
        , assert = asserts.assert
    var Class = require('zz/core/Class')
        ,$ = require('jquery')
        ,colorConvert = require('zz/ui/utils/colorConvert')

    var defaultOpts = {
        startFn: $.noop,
        endFn: $.noop
    }
    var tpl =
        " <div class='ui-color-box'>"+
            "<div class='ui-color-box-control'>"+
                "<span id='colorShowBox' class='ui-cbc-show'></span>"+
                "<input id='colorRGBInput' type='text' class='mr10' value='000000'/>"+
                /**
                "<span class='ui-cbc-text'>CMYK：</span>"+
                "<input id='colorCMYKInput' type='text' value=''/>"+
                **/
            "</div>"+
            "<div id='colorPickerBox' class='ui-color-box-picker oh'>"+
                "<span id='colorPicker' class='ui-color-selector'></span>"+
            "</div>"+
        "</div>";

    var ColorPicker = Class()
        .init(function (opts) {
            this._opts = objs.extend({},defaultOpts,opts)
            this.$target    //创建的目标的jquery对象
            this.$picker    //颜色拾起器
            this.colorPos = [0,0]
            this.color = "#000000"
            this.isOpen = false

            this._create()
        })
        .method({
            //destroy,create,
            _create: function(){
                this.$target = $(tpl)
                $(document.body).append(this.$target)
                this.$picker = $('#colorPicker')
                this.$showBox = $('#colorShowBox')
                this.$rgbInput = $('#colorRGBInput') //todo
                //this.$cmykInput = $('#colorCMYKInput')
                this.$target.hide()
                this._closeCbCache = null //关闭时候触发的回调函数, 关闭之后将被清空
            },
            /**
             * @param $elem 相对dom节点做偏移, 在节点下方10px位置
             */
            open: function($elem,openCb,closeCb){ //todo 回调函数整理
                if(this.isOpen)  return
                this._opts.startFn &&  this._opts.startFn.call(this,this._opts)
                openCb.call(this,this._opts)
                this._closeCbCache = closeCb
                this.$target.show()
                //设置位置
                this.setPopupOffset($elem)
                //绑定事件
                this._bindEvent()
                this.isOpen = true
            },
            /**
            updateOpts: function(newOpts){
                objs.extend(this._opts,newOpts)
            },
            **/
            _bindEvent: function(){
                var that = this
                $('#colorPickerBox').on('mousemove.colorPick', function(e){
                    that._setPickerPos(e.clientX, e.clientY)
                    that.setColor("#"+that.getRGBColor())
                }).on('click.colorPick',function(){
                    that.close()
                })
                this.$target.on('click.colorPick',function(e){
                    e.stopPropagation() //防止触发document click
                })
                $(document).on('click.colorPick',function(e){
                    that.close()
                })
            },
            _unBindEvent: function(){
                $(document).off('.colorPick')
                $('#colorPickerBox').off('.colorPick')
                this.$target.off('.colorPick')
            },
            getColor: function(){
                return this.color
            },
            setColor: function(color){
                this.color = $.Color(color).toHexString() //todo
                //颜色显示框
                this.$showBox.css('background-color', color)
                //颜色输入框
                this.$rgbInput.val(this.color.slice(1)).select()
                //this._setPickerPosByColor() //todo
                //var CMYK = colorConvert.RGBtoCMYK(that.color)
                //todo cmyK
                //console.log(CMYK)
            },
            /**
             * 设置拾起白色框的位置
             */
            _setPickerPos: function(clientX, clientY){
                var $picker = this.$picker
                    , x,y
                $picker.offset({
                    left: clientX,
                    top: clientY
                })
                x = parseInt($picker.position().left)
                y = parseInt($picker.position().top)
                x = x - x%11 //11的倍数
                y = y - y%11
                $picker.css({
                    left: x,
                    top: y
                })
                //设置颜色的位置
                this.colorPos[0] = x/11
                this.colorPos[1] = y/11
            },
            /**
             *      设置弹框位置
             * @param $elem 相对dom节点做偏移, 在节点下放10px位置
             */
            setPopupOffset: function($elem){
                this.$target.offset({
                    left: $elem.offset().left,
                    top: $elem.offset().top + $elem.height()+5
                })
            },
            close: function(){
                this._unBindEvent()
                this.$target.hide()
                this.isOpen = false
                this._opts.endFn &&  this._opts.endFn.call(this,this._opts)
                this._closeCbCache && this._closeCbCache.call(this,this._opts)
                this._closeCbCache = null //关闭时候触发的回调函数, 关闭之后将被清空
            },
            dispose: function(){
                this.$target.remove()
                this.$target = null
                this.$picker = null
                this.$showBox = null
                this.$rgbInput = null
            },
            /**
             * 通过拾起器位置获取rgb颜色
             */
            getRGBColor: function(){
                var x = this.colorPos[0]
                    ,y = this.colorPos[1]
                    ,cache,red,blue,green
                if(x > 1) {
                    x = x - 2
                    return getRed(x,y) + getGreen(x) + getBlue(y)
                }else if(1 === x) {
                    //垂直第二项
                    return "000000" //黑色
                }else if(0 === x) {
                    //垂直第一项
                    if(y <= 5) {
                        //灰色
                        cache = toHex(y*3*16+y*3)
                        return cache + cache + cache
                    }else {
                        switch(y) {
                            case 6:
                                return "FF0000"
                            case 7:
                                return "00FF00"
                            case 8:
                                return "0000FF"
                            case 9:
                                return "FFFF00"
                            case 10:
                                return "00FFFF"
                            case 11:
                                return "FF00FF"
                        }
                    }
                }
            }
        })


    function getRed(x,y) {
        var pos = (x-x%6)/6 + (y-y%6)/6*3
        return toHex(pos*3*16 + pos*3)
    }
    function getBlue(y){
        var pos = y%6
        return toHex(pos*3*16 + pos*3)
    }
    function getGreen(x){
        var pos = x%6
        return toHex(pos*3*16 + pos*3)
    }
    /*
     * 将数转换为16进制并大写
     */
    function toHex(num) {
        if(num == 0) {
            return "00"
        }else {
            return num.toString(16).toUpperCase()
        }
    }

    return new ColorPicker
})