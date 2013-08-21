/**
 * ui等涉及到的一些数学算法
 * @author by liuwencheng
 * @date 2013-5-25
 */
define(function(require,exports) {
    "use strict"


    /**
     *  计算目标旋转后外围包裹的矩形
     *
     * @param {Number} width
     * @param {Number} height
     * @param {Number} angle  角度
     */
    exports.getRotateRect = function(width,height,angle){
        angle = Math.round(angle || 0)
        angle = angle%180
        if(angle>90){
            var temp
            angle=angle-90
            temp = width
            width = height
            height = temp
        }
        var newWidth,newHeight;
        var a =height/2;  //  a 高度的一半
        var b =width/2;   // b 宽度的一半
        var alpha=angle*Math.PI/180;
        var c= Math.sqrt(a*a+b*b)  //  得到c的 长度

        //  var alpha_value=Math.cos(alpha)    取到cos alpha  的值 注意是弧度
        var initial_angle=Math.asin(a/c)  // 求得 初始弧度
        var new_angle= (90*Math.PI/180-initial_angle-alpha)  // 这里要全部都是弧度来 计算
        newHeight= (Math.cos(new_angle))*c*2   //   旋转后的 高度 ==> new_height =d*2
        var w=(Math.cos(initial_angle-alpha ))*c
        newWidth = w*2                           // 现在的宽度 是 w*2

        return [newWidth, newHeight]
    }

    exports.getGridNum = function(num,grid) {
        if(!grid) return Math.round(num)
        num = Math.round(num)
        var y = num % grid
        if(y<grid/2) {
            return num - y
        }else {
            return num - y + grid
        }
    }
    exports.getSnapNum = function(num, snapArr, snapLen) {
        var diffArr = []
            ,getMin
            ,key
        snapArr.forEach(function(item) {
            diffArr.push(Math.abs(item-num))
        })
        getMin = Math.min.apply(null, diffArr)
        if(getMin <= snapLen) {
            key = diffArr.indexOf(getMin)
            return snapArr[key]
        }else{
            return num
        }
    }


})