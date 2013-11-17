/**
 * 引导页面弹出遮盖层，可定制布遮盖矩形的位置
 * @author by liuwencheng
 * @date 2013-10-15
 */
define(function(require,exports) {
    "use strict"
    var objs = require('zz/utils/objs')
    var Mask = require("./Mask")
    var Class = require("zz/core/Class")
    var $ = require('jquery')

    var MaskRect = Class()
            .attr({
                DEFAULT_OPTS: {
                    color:'#000',
                    opacity : 0.6,
                    zIndex : 10000,
                    isAnim : false,
                    canClick: true, //未遮盖的地方是否可点击， 默认可点击
                    closeToDispose:true,
                    rect: [0,0,0,0],  //不遮盖矩形的位置, 分别代表：left, top, width, height
                    focusRect: null,       //指定需要标记的选择框[30,30,30,30]， 若为null将不指定
                    focusBorder: "3px solid red"
                }
            })
            .init(function(opts){
                this._opts = objs.extend({}, this.DEFAULT_OPTS, opts)
                this.rect = this._opts.rect
                this.maskList = {}
                this.$focusRect
                this._createMasks()
                if (this._opts.focusRect) this._createFocusRect()
            })
            .method({
                _createMasks: function () {
                    var maskKey = ["top","bottom", "left", "right", "bottom"]
                    if (!this._opts.canClick) maskKey.push("main")
                    var maskList = this.maskList
                    var that = this
                    maskKey.forEach(function(item){
                        var opts  = objs.extend({},that._opts)
                        switch (item) {
                            case "left":
                                opts.width = "unAutoSize"
                                opts.height = "unAutoSize"
                                ;break
                            case "right":
                                opts.height = "unAutoSize"
                                ;break
                            case "top":
                                opts.height = "unAutoSize"
                                ;break
                            case "main":
                                opts.width = "unAutoSize"
                                opts.height = "unAutoSize"
                                opts.opacity =  0
                        }
                        maskList[item] = new Mask(opts)
                    })
                },
                _createFocusRect: function () {
                    this.$focusRect = $("<div class='ui-mask-rect'></div>").css({
                        "position": "fixed",
                        "border": this._opts.focusBorder,
                        "zIndex": this._opts.zIndex + 1
                    })
                },
                open: function () {
                    objs.forEach(this.maskList, function(item){
                        item.open() //打开遮盖层
                    })
                    this._setMaskList()
                    if(this.$focusRect){
                        this.$focusRect.appendTo(document.body)
                        this.setFocusRect(this._opts.focusRect)
                    }
                },
                close: function () {
                    objs.forEach(this.maskList, function(item){
                        item.close() //关闭遮盖层
                    })
                    this.$focusRect && this.$focusRect.remove()
                    if (this.focusInterval) clearInterval(this.focusInterval)
                    this.destroy()
                },
                /**
                 * @param {Array}[20,30,40,50]
                 * @param {String} 嵌入图片
                 */
                setFocusRect: function(newRect, imgSrc) {
                    var that = this
                    if (!this.$focusRect) {
                        this._createFocusRect()
                        this.$focusRect.appendTo(document.body)
                    }
                    //设定rect
                    this.$focusRect.css({
                        "left": newRect[0],
                        "top": newRect[1],
                        "width": newRect[2],
                        "height": newRect[3]
                    })
                    //添加图片
                    if (imgSrc) {
                        var rectImg = this.$focusRect.children('img')
                        if (!rectImg[0]) {
                            rectImg = "<img style='width:100%;height:100%' src='"+imgSrc+"' />"
                            this.$focusRect.append(rectImg)
                        } else {
                            rectImg.attr("src", imgSrc)
                        }
                    } else {
                        this.$focusRect.html("") //清空图片
                    }
                    //动画闪烁
                    if (!this.focusInterval) {
                        anim()
                        this.focusInterval = setInterval(anim, 1000)
                    }
                    function anim() {
                        setTimeout(function(){that.$focusRect && that.$focusRect.css("borderColor","transparent")},100);
                        setTimeout(function(){that.$focusRect && that.$focusRect.css("border",that._opts.focusBorder)},300);
                        setTimeout(function(){that.$focusRect && that.$focusRect.css("borderColor","transparent")},600);
                        setTimeout(function(){that.$focusRect && that.$focusRect.css("border",that._opts.focusBorder)},900);
                    }
                },
                setRect: function (newRect) {
                    this.rect = newRect
                    this._setMaskList()
                },
                _setMaskList: function () {
                    //topMask, bottomMask, leftMask, rightMask, mainMask
                    var rect = {
                            "left": this.rect[0],
                            "top": this.rect[1],
                            "width": this.rect[2],
                            "height": this.rect[3]
                        }
                    var top = {left:0, top:0, height: rect.top},
                        bottom = {left:0, top:rect.top+rect.height},
                        left = {left:0, top:rect.top, width:rect.left, height:rect.height},
                        right = {left:rect.left+rect.width, top:rect.top, height:rect.height}
                    var cssList = {left:left,top:top,right:right,bottom:bottom,main:rect}
                    objs.forEach(this.maskList, function(mask, key){
                        mask.$target.css(cssList[key])
                    })
                },
                _bindEvent: function () {
                },
                _unBindEvent: function () {

                }
            })
    return MaskRect

})