// (function(window, dataService){
//   let name = 'fangdown'
//   function showMsg (){
//     alert(`${dataService.getMsg()}-${name}`)
//   }
//   window.alerter = { showMsg }
// })(window, dataService)

define([
  'dataService',
], function(dataService) {
  'use strict';
  let name = 'fangdown'
  function showMsg (){
    alert(`${dataService.getMsg()}-${name}`)
  }
  return { showMsg }
});