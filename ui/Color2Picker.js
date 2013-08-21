/**
 * 颜色选择器(单例)
 *
 * @author by liuwencheng
 * @date 2013-6-24
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
        ,colorHtml = require('./Color2Picker.tpl')
        ,colorConvert = require('./utils/colorConvert')
        ,single = require('zz/extends/single')

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
                "<button class='ui-color2-btn'>确定</button>"+
            "</div>"+
        "</div>";

    var Color2Picker = Class(Panel)
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
            //destroy,create,
            _create: function(){
                this.$target = $(tpl)
                this.$seleColorBox = this.$target.find('.ui-color2-select')
                this.triggerState('CREATE')
                return this
            },
            /**
             * 相对元素
             */
            open: function($elem){
                this.superMethod('open')
                if($elem) this.setOffset($elem)
                return this
            },
            close: function() {
                this.superMethod('close')
                return this
            },
            /**
            updateOpts: function(newOpts){
                objs.extend(this._opts,newOpts)
            },
            **/
            _bindEvent: function(){
                var that = this
                this.$target.find('.ui-color2-item')
                    .on('hover.color2picker', function(e){
                        that._color = $.Color($(e.target).css('background-color')).toHexString()
                        that._setCmyk()
                        that.$seleColorBox.css('background-color',that._color)
                    })
                    .on('click.color2picker',function(e){
                        that.close()
                    })
                this.$target.find('input').onInput((function(e){ //todo jquery.input插件ie未测试
                    var $target = $(e.target)
                        ,val = $target.val().trim().substr(0,3)
                    $target.val(val)
                    if(val.trim()==="") val = 0
                    this._cmyk[$target.attr('data-type')] = val
                    this._color = colorConvert.cmyk2rgb(this._cmyk)
                    this.$seleColorBox.css('background-color',this._color)
                }).bind(this))
                    .on('keydown', function(e){
                        if(e.keyCode == 13) {
                            that.close()
                            e.preventDefault()
                        }
                    })
                this.$target.find('.ui-color2-btn')
                    .on('keydown.color2picker', function(e){
                        if(e.keyCode == 13) {
                            that.close()
                            e.preventDefault()
                        }
                    })
                    .on('click.color2picker', function(e){
                        that.close()
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
            getColor: function(){
                return this._color
            },
            /**
             * @param {String} #ffffff
             */
            setColor: function(color){
                //todo  格式检测
                this._color = $.Color(color).toHexString()
                this._setCmyk()
                this.$seleColorBox.css('background-color',color)
            },
            _setCmyk: function() {
                var cmyk = this._cmyk = colorConvert.rgb2cmyk(this._color)
                for(var i in cmyk) {
                    this.$target.find('.ui-color2-'+i).val(cmyk[i])
                }
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