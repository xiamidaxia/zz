/**
 * 颜色选择器(单例)
 *
 * @author by liuwencheng
 * @date 2013-6-24
 * @update by liuwencheng 2013-9-3 add "SELECT" state
 *
 */
define(function (require, exports) {
    "use strict"
    require('jquery.color')
    require('zz/plugins/input')

    var objs = require('zz/utils/objs')
    var Class = require('zz/core/Class')
        ,$ = require('jquery')
        ,Panel = require('zz/ui/base/Panel')
        //,colorHtml = require('./Color2Picker.tpl')
        ,colorConvert = require('./utils/colorConvert')
        ,single = require('zz/extends/single')
        ,keyCode = require('zz/utils/keyCode')

    //var colorHtml = '<div style="background: none repeat scroll 0% 0% rgb(255, 255, 255);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(235, 235, 235);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(214, 214, 214);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(192, 192, 192);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(169, 169, 169);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(146, 146, 146);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(121, 121, 121);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(95, 95, 95);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(66, 66, 66);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(34, 34, 34);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 0, 0);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 0, 0);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 54, 74);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(22, 34, 85);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(22, 34, 85);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(47, 20, 60);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(56, 20, 33);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(86, 26, 23);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(88, 35, 15);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(85, 55, 21);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(82, 64, 25);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(103, 99, 45);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(81, 87, 38);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(44, 62, 32);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 77, 101);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(46, 58, 119);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(32, 19, 80);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(67, 25, 87);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(81, 25, 44);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(130, 24, 16);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(123, 46, 14);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(121, 77, 27);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(119, 90, 36);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(139, 137, 62);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(111, 121, 58);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(60, 87, 42);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 110, 144);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(48, 79, 161);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(50, 46, 114);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(96, 52, 122);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(121, 26, 61);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(180, 49, 41);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(173, 67, 39);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(167, 106, 46);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(166, 125, 52);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(195, 189, 65);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(153, 167, 74);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(79, 123, 65);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 142, 181);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(48, 79, 161);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(50, 46, 114);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(96, 52, 122);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(121, 26, 61);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(180, 49, 41);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(173, 67, 39);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(167, 106, 46);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(166, 125, 52);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(195, 189, 65);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(153, 167, 74);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(79, 123, 65);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 142, 181);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(70, 102, 179);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(64, 60, 142);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(121, 64, 153);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(153, 40, 80);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(227, 56, 47);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(218, 84, 48);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(213, 134, 52);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(210, 158, 55);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(244, 235, 4);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(195, 209, 66);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(102, 158, 81);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(0, 164, 215);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(80, 113, 185);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(87, 70, 164);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(145, 77, 165);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(186, 51, 96);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(247, 72, 43);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(248, 108, 41);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 169, 33);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 198, 22);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(250, 238, 70);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(216, 225, 68);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(119, 187, 87);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(70, 196, 239);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(90, 130, 194);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(99, 100, 177);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(156, 102, 175);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(231, 61, 122);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(249, 100, 85);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(250, 134, 76);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 179, 67);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(254, 201, 62);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 240, 114);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(227, 230, 106);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(152, 205, 99);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(102, 210, 245);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(128, 159, 210);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(120, 109, 180);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(168, 110, 177);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(238, 112, 159);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(250, 139, 130);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 164, 126);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 198, 120);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(255, 215, 120);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 243, 152);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(233, 235, 147);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(179, 215, 141);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(156, 222, 247);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(174, 195, 229);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(154, 137, 193);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(194, 149, 197);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(243, 163, 192);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 179, 176);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 195, 171);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(254, 218, 168);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(254, 228, 169);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 246, 187);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(242, 241, 185);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(207, 229, 181);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(206, 237, 249);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(215, 225, 243);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(212, 200, 226);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(228, 201, 225);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(248, 211, 224);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(252, 209, 208);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 219, 205);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(254, 232, 204);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 239, 203);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(253, 253, 213);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(246, 250, 211);" class="ui-color2-item" ></div>\n<div style="background: none repeat scroll 0% 0% rgb(217, 234, 202);" class="ui-color2-item" ></div>\n'
    var colorHtml = createColorHtml()
    var tpl =
        " <div class='ui-panel ui-color2-wrap'>"+
            "<div class='ui-color2-content oh clearfix'>"+
                //"<span id='colorPicker' class='ui-color-selector'></span>"+
                colorHtml+
            "</div>"+
            "<div class='ui-color2-cmyk'>"+
                "<div class='ui-color2-select'></div>"+
                "<div class='ui-color2-cmyk-item'>C：<input  type='text' data-type='c' class='ui-color2-c' /></div>"+
                "<div class='ui-color2-cmyk-item'>M：<input  type='text' data-type='m' class='ui-color2-m' /></div>"+
                "<div class='ui-color2-cmyk-item'>Y：<input  type='text' data-type='y' class='ui-color2-y' /></div>"+
                "<div class='ui-color2-cmyk-item'>K：<input  type='text' data-type='k' class='ui-color2-k' /></div>"+
                "<button class='ui-dialog-btn ui-color2-btn' style='display:none'>确定</button>"+
            "</div>"+
        "</div>";

    function createColorHtml() {
        var colorData = [
            [0,0,0,100], [0,0,0,90], [0,0,0,80], [0,0,0,70], [0,0,0,60], [0,0,0,50], [0,0,0,40], [0,0,0,30], [0,0,0,20], [0,0,0,10], [0,0,0,0],
            [0,0,20,0],
            [0,0,40,0],
            [0,0,60,0],
            [0,0,100,0],
            [0,20,100,0],
            [0,20,20,0],
            [0,20,40,0],
            [0,40,0,0],
            [0,40,20,0],
            [0,40,80,0],
            [0,40,40,0],
            [0,40,60,0],
            [0,60,40,0],
            [0,60,60,0],
            [0,60,80,0],
            [0,60,100,0],
            [0,80,40,0],
            [0,100,0,0],
            [0,100,60,0],
            [0,100,100,0], //hong
            [0,0,60,20],
            [0,20,0,20],
            [0,20,60,20],
            [0,40,20,20],
            [0,40,0,20],
            [0,40,60,20],
            [20,20,0,0],
            [20,40,0,0],
            [20,60,0,0],
            [20,0,60,0],
            [0,60,20,20],
            [0,60,40,20],
            [0,60,80,20],
            [20,80,0,0],
            [20,0,20,0],
            [20,40,0,20],
            [20,0,60,20],
            [20,60,0,20],
            [20,0,40,20],
            [20,0,20,20],
            [0,0,20,40],
            [0,0,40,40],
            [20,80,0,20],
            [20,0,0,20],
            [0,20,0,40],
            [0,20,40,40],
            [0,40,20,40],
            [40,60,0,0],
            [0,60,0,40],
            [40,100,0,0],
            [0,60,60,40],
            [40,40,0,0],
            [40,0,100,0],
            [20,40,0,40],
            [40,0,40,0],
            [20,0,20,40],
            [20,0,40,40],
            [40,80,0,20],
            [20,0,0,40],
            [40,40,0,20],
            [40,0,0,0],
            [0,0,20,60],
            [0,20,20,60],
            [0,20,40,60],
            [0,40,0,60],
            [60,80,0,0],
            [60,60,0,0],
            [60,40,0,0],
            [40,60,0,40],
            [40,20,0,40],
            [20,40,0,60],
            [60,80,0,20],
            [20,0,0,60],
            [40,0,20,40],
            [40,40,0,60],
            [0,0,20,80],
            [40,0,20,60],
            [60,40,0,40],
            [60,0,40,20],
            [60,0,60,20],
            [60,0,20,20],
            [20,0,0,80],
            [60,0,40,40],
            [60,0,20,0],
            [100,100,0,0],
            [100,0,0,0],
            [100,0,100,0],
            [100,20,0,0]
        ]
        var tpl = '<div style="background: none repeat scroll 0% 0% {{rgb}}" data-cmyk="{{cmyk}}" class="ui-color2-item" ></div>'
        var html = ""
        colorData.forEach(function(item){
            var rgb = colorConvert.cmyk2rgb({
                c: item[0], m: item[1], y: item[2], k: item[3]
            })
            html += tpl.replace("{{rgb}}", rgb).replace("{{cmyk}}", item.join(","))
        })
        return html
    }

    var Color2Picker = Class(Panel)
        .defState('SELECT')
        .attr({
            DEFAULT_OPTS: {
                appendTo: document.body,
                append: null,
                innerHTML: "",
                blankToClose: true, //点击空白关闭
                closeToDispose: false
            },   //默认操作
            TMPL: tpl

        })
        .init(function (opts) {
            this.superInit(opts)
            this.$seleColorBox
            this._color = "#000000"
            this._cmyk = {c:0,m:0,y:0,k:0}
            this._create()
        })
        .method({
            /**
             *  创建
             */
            _create: function(){
                this.$target = $(tpl)
                this.$seleColorBox = this.$target.find('.ui-color2-select')
                this.triggerState('CREATE')
                return this
            },
            /**
             * 打开面板
             */
            open: function($elem){
                this.superMethod('open')
                if($elem) this.setOffset($elem)
                this._isOpen = true
                return this
            },
            close: function() {
                this.superMethod('close')
                this._isOpen = false
                return this
            },
            isOpen: function() {
                return this._isOpen
            },
            select: function() {
                this.triggerState("SELECT")
                this.close()
            },
            /**
            updateOpts: function(newOpts){
                objs.extend(this._opts,newOpts)
            },
            **/
            _bindEvent: function(){
                var that = this
                this.$target.find('.ui-color2-item')
                    //hover不同颜色值
                    .on('hover.color2picker', function(e){
                        //that._color = $.Color($(e.target).css('background-color')).toHexString()
                        var cmyk = $(e.target).attr('data-cmyk')
                        that.setCMYK(cmyk)
                        //that.$seleColorBox.css('background-color',that._color)
                        e.stopPropagation()
                    })
                    //点击颜色
                    .on('click.color2picker',function(e){
                        that.select()
                        e.stopPropagation()
                    })
                //监听四个input输入框
                this.$target.find('input').onInput((function(e){
                    var $target = $(e.target)
                        ,val = $target.val().trim().substr(0,3)
                    $target.setInputVal(val) //使用setInputVal防止ie循环触发input事件
                    if(val.trim()==="") val = 0
                    this._cmyk[$target.attr('data-type')] = val
                    this._color = colorConvert.cmyk2rgb(this._cmyk)
                    this.$seleColorBox.css('background-color',this._color)
                }).bind(this))
                    .on('keydown', function(e){
                        if(e.keyCode == keyCode.get('enter')) {
                            that.select()
                            e.preventDefault()
                        }
                    })
                //监听cmyk确定按钮
                this.$target.find('.ui-color2-btn')
                    .on('keydown.color2picker', function(e){
                        if(e.keyCode == keyCode.get('enter')) { //点击确认
                            that.select()
                            e.preventDefault()
                        }
                    })
                    .on('click.color2picker', function(e){
                        that.select()
                        e.preventDefault()
                    })
                this.superMethod('_bindEvent')
            },
            _unBindEvent: function(){
                this.$target.find('.ui-color2-item').off('.color2picker')
                this.$target.find('input').unInput().off('keydown')
                this.$target.find('.ui-color2-btn').off('.color2picker')
                this.superMethod('_bindEvent')
            },
            getRGB: function(){
                return this._color
            },
            getCMYK: function(){
                return this._cmyk
            },
            getStrCMYK: function(){
                var cmyk = this._cmyk
                return "" + cmyk.c + "," + cmyk.m + "," + cmyk.y + "," + cmyk.k
            },
            /**
             * @param {String} #ffffff
             */
            setRGB: function(color){
                this._color = $.Color(color).toHexString()
                this._cmyk = colorConvert.rgb2cmyk(this._color)
                for(var i in this._cmyk) {
                    this.$target.find('.ui-color2-'+i).setInputVal(this._cmyk[i]) //使用setInputVal防止ie循环触发input事件
                }
                this.$seleColorBox.css('background-color',color)
            },
            /**
             * @param {String} "0,0,0,100"
             */
            setCMYK: function(cmyk) {
                cmyk = cmyk.split(",")
                this._cmyk = { c:cmyk[0],m:cmyk[1],y:cmyk[2],k:cmyk[3] }
                this._color = colorConvert.cmyk2rgb(this._cmyk)
                for(var i in this._cmyk) {
                    this.$target.find('.ui-color2-'+i).setInputVal(this._cmyk[i]) //使用setInputVal防止ie循环触发input事件
                }
                this.$seleColorBox.css('background-color',this._color)
            },
            /**
             *  设置弹框位置
             * @param $elem 相对dom节点做偏移, 在节点下放10px位置
             */
            setOffset: function($elem){
                this.$target.offset({
                    left: $elem.offset().left,
                    top: $elem.offset().top + $elem.height()+5
                })
            }
        })
        .wrap(single) //单例

    return Color2Picker
})