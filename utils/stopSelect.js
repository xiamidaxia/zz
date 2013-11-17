/**
*  未测试, 有bug
 * 阻止浏览器文本选择
 * @author by liuwencheng
 * @date 2013-
 */
define(function(require,exports) {
    /**
    或使用CSS： div {

          -moz-user-select:none;

          -webkit-user-select:none;

          user-select:none;
    }
    **/
    var $ = require('jquery')

    exports.init = function(ignores, cmds) {
        // IE下禁止元素被选取
/*        if (typeof document.onselectstart != "undefined") {
            document.onselectstart=new Function ("return false")
        //其他浏览器
        } else {*/
            //忽略的
            //object/embed 用于解决flash上传组件不能用问题
            var ignoreTags=["input", "textarea", "select", "object", "embed"]

            ignoreTags=ignoreTags.join("|")

            $(document).on('mousedown',function(e){
                if (ignoreTags.indexOf(e.target.tagName.toLowerCase()) == -1)
                    return false
            })
            $(document).on('mouseup',function(){
                return true
            })
            //document.onmousedown= disableselect
            //document.onmouseup= reEnable
        //}

    }
})
