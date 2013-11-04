/**
 *
 * 可视面板
 *
 * @version 0.1.3
 *
 * @author by liuwencheng
 * @date 2013-6-21
 *
 * @update 0.1.2 增加actions
 * @update 0.1.3 添加getID方法
 */
define(function (require) {
    "use strict"
    require('jquery.tmpl')
    require('zz/plugins/actionMap')

    var objs = require('zz/utils/objs')
    var Class = require('zz/core/Class')
    var $ = require('jquery')

    var _COUNT = 0 //计数器
    var Panel = Class()
        .defState('CLOSE','OPEN','DISPOSE','CREATE')
        //静态属性
        .attr({
            DEFAULT_OPTS: {
                appendTo: document.body,
                append: null,
                innerHTML: "",
                blankToClose: false,        //点击空白地方是否关闭
                closeToDispose: false,      //关闭时候是否销毁
                actions: {                  //注：重新制定actions若没有close，默认的close不会被覆盖，若有close将覆盖默认
                    'close': function(){
                        this.close()
                    }
                },
                css: null                       //设置样式
            },   //默认操作
            TMPL: "<div id='${id}' class='ui-panel ${className}'>${innerHTML}</div>"            //模版
        })
        .init(function (opts) {
            var superDefault = this.superClass.DEFAULT_OPTS
            this._opts = objs.extend({},superDefault,this.DEFAULT_OPTS,opts) //配置
            //处理actions
            if(opts && opts.actions) {
                this._opts.actions = objs.extend({}
                            ,superDefault.actions
                            ,this.DEFAULT_OPTS.actions
                            ,opts.actions)
            }
            this.$target = null                               //dom对象
            _COUNT++
            this._id = _COUNT     //用于保证唯一性
        })
        .method({
            _create: function() {
                //console.log('panel _create')
                this.$target = $.tmpl(this.TMPL, this._opts)       //渲染模版
                if(this._opts.append) {
                    this.$target.append(this._opts.append)
                }
                this._opts.css && this.$target.css(this._opts.css)
                this.triggerState('CREATE')
                return this
            },
            _bindEvent: function() {
                var that = this
                //注册点击空白关闭事件
                if(this._opts.blankToClose) {
                    $(document.body).on('click.panel' + this.getID(), function(){
                        that.close()
                    })
                    this.$target.on('click.panel',function(e){
                        e.stopPropagation() //放置触发document.body click
                    })
                }
                //添加actionMap
                var actions = this._opts.actions
                this.$target.actionMap(actions, this)
                return this
            },
            _unBindEvent: function() {
                //取消点击空白关闭事件
                if(this._opts.blankToClose) {
                    $(document.body).off('click.panel' + this.getID())
                    this.$target.off('click.panel')
                }
                //取消actionMap
                this.$target.unActionMap()
                return this
            },
            open: function() {
                //console.log('panel open')
                if (!this.$target) this._create()
                //添加到body或者指定的节点
                this.$target
                    .appendTo(this._opts.appendTo)
                    .show()
                //绑定事件
                this._bindEvent()
                this.triggerState('OPEN')
                return this
            },
            close: function() {
                //console.log('panel close')
                this.triggerState('CLOSE')
                //摧毁
                if (this._opts.closeToDispose) {
                    this._unBindEvent()
                    this.$target.remove()
                    this.dispose()
                } else {
                    this.$target.hide()

                }
                return this
            },
            dispose:  function() {
                this.triggerState('DISPOSE')
                this.destroy()
                return this
            },
            setOffset: function(offsetObj) {
                this.$target.offset(offsetObj)
                return this
            },
            css: function(cssObj) {
                this.$target.css(cssObj)
                return this
            },
            updateOpts: function(opts){
                objs.extend(this._opts, opts)
                return this
            },
            getTarget: function() {
                return this.$target
            },
            getID: function(){
                if (!this._id) {
                    _COUNT++
                    this._id = _COUNT     //用于保证唯一性
                }
                return this._id
            }
        })
        //.order('_create','open','close','_bindEvent','_unBindEvent')
        //.toggleOnce('_create')
        .toggleOnce('open','close')
        /**
        ,function(errorState){
            if(errorState) {
                console.log('panel 打开失败')
            } else {
                console.log('panel 关闭失败')
            }
        })
        **/
        .toggleOnce('_bindEvent','_unBindEvent')
        /**
        , function(errorState) {
            if(errorState) {
                console.log('panel 绑定失败')
            } else {
                console.log('panel 解除绑定失败')
            }
        })
        **/
    return Panel
})