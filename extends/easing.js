define(function() {
    "use strict"
    var
        pow = Math.pow
        ,sin = Math.sin
        ,PI = Math.PI
        ,BACK_CONST = 1.70158

    return  {
        linear : function(t){
            return t
        },
        easeIn : function (t) {
            return t * t
        },
        easeOut : function (t) {
            return ( 2 - t) * t
        },
        easeBoth : function (t) {
            return (t *= 2) < 1 ?
                    .5 * t * t :
                    .5 * (1 - (--t) * (t - 2))
        },
        easeInStrong : function (t) {
            return t * t * t * t
        },
        easeOutStrong : function (t) {
            return 1 - (--t) * t * t * t
        },
        easeBothStrong: function (t) {
            return (t *= 2) < 1 ?
                    .5 * t * t * t * t :
                    .5 * (2 - (t -= 2) * t * t * t)
        },
        easeOutQuart : function(t){
            return -(pow((t-1), 4) -1)
        },
        easeInOutExpo : function(t){
            if(t===0) return 0
            if(t===1) return 1
            if((t/=0.5) < 1) return 0.5 * pow(2,10 * (t-1))
            return 0.5 * (-pow(2, -10 * --t) + 2)
        },
        easeOutExpo : function(t){
            return (t===1) ? 1 : -pow(2, -10 * t) + 1
        },
        swingFrom : function(t) {
            return t*t*((BACK_CONST+1)*t - BACK_CONST)
        },
        swingTo: function(t) {
            return (t-=1)*t*((BACK_CONST+1)*t + BACK_CONST) + 1
        },
        sinusoidal : function(t) {
            return (-Math.cos(t*PI)/2) + 0.5
        },
        flicker : function(t) {
            var t = t + (Math.random()-0.5)/5
            return this.sinusoidal(t < 0 ? 0 : t > 1 ? 1 : t)
        },
        backIn : function (t) {
            if (t === 1) t -= .001
            return t * t * ((BACK_CONST + 1) * t - BACK_CONST)
        },
        backOut : function (t) {
            return (t -= 1) * t * ((BACK_CONST + 1) * t + BACK_CONST) + 1
        },
        bounce : function (t) {
            var s = 7.5625, r
            if (t < (1 / 2.75)) {
                r = s * t * t
            }
            else if (t < (2 / 2.75)) {
                r = s * (t -= (1.5 / 2.75)) * t + .75
            }
            else if (t < (2.5 / 2.75)) {
                r = s * (t -= (2.25 / 2.75)) * t + .9375
            }
            else {
                r = s * (t -= (2.625 / 2.75)) * t + .984375
            }
            return r
        }
    }
})