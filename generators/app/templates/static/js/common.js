/*!
* @project : common
* @version : 0.1.0
* @author  : xxx
* @created : xxx
* @description: xxx
*/

;(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define('Common', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory('Common', require('jquery'));
    } else {
        // return
        // root.Common = factory(root.jQuery);
        // no trun, as jquery Plugin
        factory(root.jQuery);
    }

}(this, function ($) {
  var exports = {

  };

  return exports;
}));
