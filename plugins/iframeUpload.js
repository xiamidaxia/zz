/**
 * [废弃] 请使用arale上传组件
 * iframe异步文件提交
 * @author by liuwencheng
 * @date 2013-8-8
 */
define(function(require,exports) {
    "use strict"
    var $ = require('jquery')

    function onLoad(targetName, cb) {
        var $target = $("#" + targetName)
            ,data = $target[0].contentWindow.document.body.innerHTML.trim()
        if(data) {
            data = JSON.parse(data)
            cb(data)
        }
        //移除
        $target.remove()
        this.find(":file").each(function(){
            var $this = $(this)
            $this.after($this.clone(true).val("")).remove() //清除原来的并复制
        })
    }

    $.fn.extend({
        iframeUpload: function(fn, context){
            var targetName = "iframe-" + $.now()
                ,$iframe = $('<iframe id="NAME" name="NAME" style="display:none">'.replace(/NAME/g,targetName))
                            .appendTo(document.body)
            //todo
            context || $iframe.attr('src','javascript:document.open();document.close();') //document.domain="";
            $iframe.on('load', onLoad.bind(this, targetName, fn))
            this.attr('target', targetName).submit()
        }
    })
})