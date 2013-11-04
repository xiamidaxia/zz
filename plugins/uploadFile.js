/**
 * 异步上传文件插件
 *
 * @author by liuwencheng
 * @date 2013-9-2
 */
define(function(require,exports) {
    "use strict"
    var $ = require('jquery')

    var tpl = '<form action="{{action}}" method="post" enctype="multipart/form-data"><input type="file" name="file" class="none" {{attr}} /></form>'

    $.fn.extend({
        /**
         * 选择文件
         * @param {Object} opts
         *    {
         *      action: {String} "/upload/"
         *      change: {Function} ({String} fileName) 参数为file的名字
         *      success: {Function}
         *      error: {Function}
         *      attr: {String || Ignore}  "multiple ..."
         *      isPrevent: {Boolean} 是否阻止提交到服务器，用于nodewebkit不提交上传
         *    }
         */
        uploadFile: function (opts) {
            var $form = $(tpl.replace("{{attr}}", opts.attr || "")
                        .replace("{{action}}", opts.action))
                        .appendTo(document.body)
              , that = this
            //change
            $form.find(":file").change(function(e){
                //change回调
                opts.change.call(that, $(this).val())
                //阻止提交
                if (opts.isPrevent) return
                //提交
                if (window.FormData) {
                    //formDataUpload($form, opts.success)
                    formDataUpload($form, opts.success)
                    $form.remove() //移除
                } else {
                    iframeUpload($form, opts.success)
                    $form.remove() //移除
                }
            })
            .click() //触发
        }
    })

    /**
     * formData 异步提交
     */
    function formDataUpload($form, cb) {
        var formData
           ,files = $form.find(':file').get(0).files
        //创建formData
        formData = new FormData($form.get(0))
        $.each(files, function(i, file){
            formData.append("file", file)
        })
        //formData.append('_uploader_', 'formData')
        //formData提交
        $.ajax({
            url: $form.attr('action'),
            type: "post",
            processData: false,
            contentType: false,
            data: formData,
            //context: $form,
            success: function(data){
                //data = JSON.parse(data) //todo
                cb(data)
            }
            //error: opts.error //mark
        })
    }

    /**
     * iframe 异步提交
      */
    function iframeUpload($target, cb) {
        var iframeName = "iframe-" + $.now()
          , $iframe
        //创建iframe
        $iframe = $('<iframe id="NAME" name="NAME" style="display:none">'.replace(/NAME/g,iframeName)).appendTo(document.body)
        $iframe.attr('src','javascript:document.open();document.domain="zhubajie.com";document.close();') //document.domain=""; //mark
        //提交成功后回调
        $iframe.on('load', function(){
            var data = $iframe[0].contentWindow.document.body.innerHTML.trim()
            if(data) {
                data = JSON.parse(data) //todo
                cb(data)
            }
            //移除iframe
            $iframe.remove()
            $target.find(":file").each(function(){
                $target.after($target.clone(true).val("")).remove() //清除原来的并复制 //mark
            })
        })
        //提交
        $target.attr('target', iframeName)
        $target.submit()
    }
})