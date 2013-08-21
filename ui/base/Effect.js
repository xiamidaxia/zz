/**
 * 一些效果如rotable,draggable,resizable,droppable的基础父类
 *
 * @author by liuwencheng
 * @date 2013-6-13
 *
 * todo scroll,delay
 *
 */
define(function (require, exports) {
    "use strict"
    require('zz/ui/plugins/state')

    var objs = require('zz/utils/objs')
    var Class = require('zz/core/Class')
    var Effect = Class()
        .attr({
            DEFAULT_OPTS: {
            },
            TYPE: 'effect'
        })
        .init(function (target,opts) {
            var superDefault = this.superClass.DEFAULT_OPTS
            this._opts = objs.extend({},superDefault,this.DEFAULT_OPTS,opts)
            this.$target = target
            this.$target.data(this.TYPE + "EffectObj", this)   //将效果实例保存到jquery对象上, 保证唯一
        })
        .method({
            /**
             * 在jquery节点上绑定效果
             */
            bindEffect: function() {
                //配置
                this.$target.setState(this.TYPE)
                return this
            },
            /**
             * 解除jquery节点上的效果
             */
            unBindEffect: function() {
                this.$target.unState(this.TYPE)
                this.$target.removeData(this.TYPE + "EffectObj") //移出数据
                return this
            },
            updateOpts: function(opts){
                objs.extend(this._opts, opts)
                return this
            }
        })

    return Effect
})