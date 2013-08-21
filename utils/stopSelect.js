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

    exports.do = function(ignores, cmds) {
        //忽略的
        var ignoreTags=["input", "textarea", "select"]

        ignoreTags=ignoreTags.join("|")

        $(document).on('mousedown',function(e){
            if (ignoreTags.indexOf(e.target.tagName.toLowerCase())==-1)
            return false
        })
        $(document).on('mouseup',function(){
            return true
        })
        /**
        // IE下禁止元素被选取
        if (typeof document.onselectstart != "undefined")
            document.onselectstart=new Function ("return false") //todo 不能对input等忽略取消选择
        //其他浏览器
        else{
            document.onmousedown= disableselect
            document.onmouseup= reEnable
        }
        **/

    }
})