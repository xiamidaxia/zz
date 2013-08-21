/**
 *
 * @author by liuwencheng
 * @date 2013-5-22
 */
define(function(require,exports) {
    "use strict"
    var $ = require('jquery')

    $.fn.extend({
        toggleState: function(str) {
            if(this.data('state-'+str)) {
                this.data('state-'+state, false)
                return true //返回旧的状态
            }else {
                this.data('state-'+state, true)
                return false //返回旧的状态
            }
        },
        isState: function(state) {
            if(this.data('state-'+state)) {
                return true
            }else {
                return false
            }  //处理undefined
            //return this.data('state-'+state)
        },
        setState: function(state) {
            this.data('state-'+state, true)
        },
        unState: function(state) {
            this.data('state-'+state, false)
        }
    })
})