/**
 * 浏览器字体检测
 * !!只支持支持 canvas 对象的浏览器
 * !!默认字体的检测不可靠，可能返回错误结果
 *
 * @author by xuhaiqiang
 * @date 2013-06-22
 *
 * 不同字体渲染出来的图形是不一样的
 * 浏览器将依次使用指定的字体来渲染图像。当指定的字体不存在时，浏览器使用默认字体
 * 如果指定的字体渲染出来后和默认（备用）字体一样，则可以认为指定的字体不存在
 *
 * 为了检测不同文字（中文/英文/...），需要多个实例
 *
 * var fontDetect = new FontDetect(opts)
 * @param opts{
 *  defaultFont: '宋体',  // 检测时用的参照字体
 *  testString: '木',     // 渲染时用的文本
 *  fontSize: '12px',     // 渲染时用的字体大小
 *  width: 100,           // 画布宽度
 *  height: 100           // 画面高度
 * }
 *
 */

define(function(require){
    var objs = require('zz/utils/objs'),
        defaultModes = [];

    try{
        var cv = document.createElement('canvas'),
            ctx = cv.getContext('2d'),
            defaultOpts = {
                fontSize:'12px',
                defaultFont:'宋体',
                testString:'木',
                width:100,
                height:100
            };
    }catch(e){
        throw new Error('当前浏览器不支持 canvas 对象！');
    }

    function FontDetect(opts){
        objs.extend(this,defaultOpts,opts);
        this.defaultMode = this.getFontMode(this.defaultFont);
    }

    /**
     * 检测多个字体
     */
    function detectFonts(fonts){
        fonts = fonts.split?
            fonts.split(','):
            fonts;

        var validFont = [],
            invalidFont = [];
    }

    /**
     * 检测字体
     * @param fontName {String}
     * @param callback {function || Ignore}
     */
    function detect(fontName,callback){
        if(fontName === this.defaultFont){
            return this.detectDefaultFont(defaultModes);
        }

        var mode = this.getFontMode(fontName),
            ret = mode !== this.defaultMode;

        return callback ?
            callback.call(this,fontName,ret) :
            ret;
    }

    /**
     * 使用预置数据检测默认字体
     * @param modes {Array}
     */
    function detectDefaultFont(modes){
        var mode, i,
            defMode = this.defaultMode;

        for(i=modes.length;i--;){
            mode = modes[i];
            if(mode===defMode || mode&&mode.data===defMode){
                return mode;
            }
        }

        return false;
    }

    /**
     * 获取渲染图形
     * @param fontName {String}
     */
    function getFontMode(fontName){
        cv.width = this.width;
        cv.height = this.height;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = this.fontSize+' '+
            fontName+','+
            this.defaultFont;

        ctx.fillText(this.testString,0,0);
        // todo 在(0,0)位置可能因为对齐方式而取不到完全内容
        // todo 使用自动收缩程序收缩图像，裁剪空白部分

        return cv.toDataURL();
    }

    FontDetect.prototype = {
        constructor:FontDetect,
        detect:detect,
        detectDefaultFont:detectDefaultFont,
        getFontMode:getFontMode
    };

    return FontDetect;
});