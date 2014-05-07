/**
 * 动态改变价格
 * @author by liuwencheng
 * @date 14-5-7
 */
define(function(require,exports) {
    "use strict"
    var anim = require('zz/utils/animate')
    /**
     * 改变报价
     *  @param {$} price节点
     *  @param {Number} 价格
     *  @param  {Number | Ignore}
     */
    function changePrice($price, newPrice,timeStamp) {
        var timeStamp = timeStamp || 500
            ,oldPrice = !!parseFloat($price.text()) || 0
            ,priceLength = newPrice - oldPrice
            ,changeFn = function(percent){
                $price.html((oldPrice + priceLength * percent).toFixed(2))
            }
        anim(changeFn, timeStamp)
    }

    return changePrice
})