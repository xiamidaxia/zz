/**
 * 放置, 与拖拽配合使用
 *
 * @author by liuwencheng
 * @date 2013-6-15
 *
 *  Thanks to jquery ui
 */
define(function(require,exports) {
    "use strict"
    require('zz/ui/plugins/state')

    var $ = require('jquery')
        ,objs = require('zz/utils/objs')
        ,Effect = require('zz/ui/base/Effect')
        ,Class = require('zz/core/Class')
    var defaultOpts = {
    }

    var Draggable =  Class(Effect)
        .init(function(target, opts){
            this.TYPE = "droppable"
            this._defaultOpts = defaultOpts
            this.superInit(target,opts)
        })
        .method({
            bindEffect: function() {
                //调用父类bindEffect方法
                this.superClass.bindEffect.call(this)

                var target = this.$target
                    ,opts = this._opts
                target.addClass('ui-droppable')
                return this
            },
            unBindEffect: function() {
                this.superClass.unBindEffect.call(this)
                this.$target.removeClass('ui-droppable')
                return this
            }
        })

    //jquery插件配置
    $.fn.extend({
        droppable: function(opts) {
            //已经存在效果
            if(this.isState('droppable')) {
                var effectObj = this.data('droppableEffectObj') //获得effect实例对象
                effectObj.updateOpts(opts) //更新操作
                return this
            }
            var effectObj = new Draggable(this, opts) //创建新的实例
            effectObj.bindEffect()
            return this
        },
        unDroppable: function() {
            if(this.isState('droppable')) {
                var effectObj = this.data('droppableEffectObj')
                effectObj
                    .unBindEffect()
                    .destroy()
            }
            return this
        }
    })
    return Draggable

})