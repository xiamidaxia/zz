/**
 * @author by liuwencheng
 * @date 2013-3-10
 */
 define(function(require){
    var $ = require('jquery')
     $.fn.serializeObject = function () {
         var _object = {}
         var arr = this.serializeArray()
         var _checkboxItems = {}
         arr.forEach(function(item){
             if (item.value.trim() !== "") {

                //为checkbox
                if (_checkboxItems[item.name]) {
                    _object[item.name].push(item.value)
                    return
                }

                //把checkbox选项缓存
                if (_object[item.name]) {
                    _checkboxItems[item.name] = true
                    _object[item.name] = [_object[item.name], item.value]
                    return
                }

                 _object[item.name] = item.value
             }
         })
         return _object
     }
 })
