/**
 *  缓存图片
 *
 * @author liuwencheng
 * @date 2012-12-20
 *
 * @update by liuwencheng 2013-6-2 重新处理已加载的图片缓存
 * @update by z 2013-6-15 添加参数处理图片附加数据
 * @update by liuwencheng 2013-8-28 包装成Class以实现多个实例加载, 增加loaded
 */

define(function(require,exports){
    var $ = require('jquery')
      , objs = require('zz/utils/objs')
      , Class = require('zz/core/Class')
    var defaultOpts = {
            imgs: [],
            infos: [],
            done: null,
            sync: false,
            loaded: null
        }


    var ImgsLoader = Class()
        .init(function (opts) {
            this._opts = objs.extend({},defaultOpts, opts) //配置
            this._leftNum = this._opts.imgs.length //剩余加载的数量
            this._start()
        })
        .method({
            /**
             *  开始加载图片
             */
            _start: function () {
                var len = this._opts.imgs.length
                //异步加载
                if (! this._opts.sync) {
                    while (len--) {
                        this.loadImg(len)
                    }
                }
                //同步加载
                else {
                    this.loadImg(0) //加载第一张
                }
            },
            /**
             * 加载单个图片
             * @param index {Number} img在数组中的位置
             */
            loadImg: function (index) {
                var img = new Image
                  , that = this
                  , _opts = this._opts
                  , info
                //超出数组大小
                if(index >= _opts.imgs.length) return
                //获取信息
                info = _opts.infos && _opts.infos[index]
                //加载成功
                img.onload = function(){
                    _opts.done && _opts.done(img,index,info)
                    //数量-1
                    that._leftNum = that._leftNum - 1
                    //全部加载完
                    if (that._leftNum === 0) {
                        _opts.loaded && _opts.loaded()
                        that.destroy()    //销毁
                        return
                    }
                    // 顺序加载时加载下一个图片
                    _opts.sync && that.loadImg(index+1)
                }
                //加载失败
                img.onerror = function(){
                    _opts.sync && that.loadImg(index+1)
                }
                img.src = _opts.imgs[index]
            }
        })

    /*
     * opts = {
     *  imgs:   {Array}
     *  infos:{Array}    图片附加信息，和图片对应
     *  done:   {Function} ( {Object} ImgObj 图片对象, {Number} index, {*} info )回调函数，加载完图片后执行
     *  loaded {Function}  图片全部加载完成的回调
     *  sync:   {Boolean}   顺序加载图片, 默认false
     * }
     */
    return function(opts){
        return new ImgsLoader(opts)
    }
});
