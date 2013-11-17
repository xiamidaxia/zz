/**
 * tab切换
 *
 * @例子
 *          var Tab = require('zz/ui/Tabs')
 *          var tabs = new Tabs({
 *              $controls:                  //tabs所有节点
*               $panels:                    //panels节点数组(要切换的面板)
 *              activeClass: 'select'       //选择时要加的class
 *              selectCb: function(index){ //选择元素触发的回调
 *              }
 *          })
 *
 * @author by xuhaiqiang
 * @update by liuwencheng 2013-6-21
 * @update by xuhaiqiang 2013-06-25 添加 getSelect 方法，获取当前选择项
 */
define(function(require){
    var $ = require('jquery'),
        objs = require('zz/utils/objs'),
        Class = require('zz/core/Class');

    var Tabs = Class()
        .init(function(opts){
            var $controls = opts.$controls,
                that = this;
            this._opts = objs.extend({},opts);

            $controls.click(function(e){
                that._select($controls.index(this));
            });
        }).method({
            _select: function(index){
                this.selectedIndex = index;
                this._opts.$panels && this._opts.$panels
                    .hide()
                    .eq(index)
                    .show();
                this._opts.$controls
                    .removeClass(this._opts.activeClass)
                    .eq(index)
                    .addClass(this._opts.activeClass);
                this._opts.selectCb && this._opts.selectCb.call(this, index)
            },
            getSelect: function(){
                return this.selectedIndex || 0;
            }
        });

    return Tabs;
});