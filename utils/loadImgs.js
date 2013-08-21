/**
 *  缓存图片
 *
 * @author liuwencheng
 * @date 2012-12-20
 *
 * @update by liuwencheng 2013-6-2 重新处理已加载的图片缓存
 * @update by z 2013-6-15 添加参数处理图片附加数据
 */

define(function(require,exports){
    var $ = require('jquery'),
        objs = require('zz/utils/objs');

    var unloadImgsCache,
        _opts = {},
        defaultOpts = {
            sync: false,
            imgs: [],
            infoArr: [],
            done: null
        };

    /* @param url   {String}
     * @param info  {Ignore} 图片附加信息
     * @param index {Number} img在数组中的位置,防止冲突
     */
    function loadImg(url, info, index){
        var img = new Image;
        img.onload = function(){
            _opts.done && _opts.done(img,info,index);

            // 顺序加载时加载下一个图片
            loadNextImgs(index);
        }
        img.onerror = function(){
            loadNextImgs(index);
        }
        img.src = url;
    }

    /**
     * 顺序加载下一张图片
     * @param index:    {Number},   当前加载的图片索引
     */
    function loadNextImgs(index){
        index++;

        var nextImg = unloadImgsCache[index],
            nextInfo  = _opts.infoArr[index];

        _opts.sync && nextImg &&
            loadImg(nextImg, nextInfo, index);
    }

    /*
     * opts = {
     *  imgs:   {Array},
     *  infoArr:{Array},    图片附加信息，和图片对应
     *  done:   {function}, 回调函数，加载完图片后执行
     *  sync:   {boolean}   顺序加载图片
     * }
     */
    return function(opts){
        unloadImgsCache = null;
        _opts = objs.extend({},defaultOpts,opts);
        unloadImgsCache = _opts.imgs || [];

        // 顺序加载的时候先加载第一个图片
        var len = _opts.sync ? 1 : unloadImgsCache.length,
            i = 0,
            infoArr = _opts.infoArr;

        for(;i!=len;i++){
            loadImg(unloadImgsCache[i], infoArr[i], i);
        }
    }
});
