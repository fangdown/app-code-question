// (function(){
//   let msg = 'hello'
//   function getMsg(){
//     return msg
//   }
//   window.dataService = { getMsg }
// })()


define(function() {
  'use strict';
  let msg = 'hello'
  function getMsg(){
    return msg
  }
  return { getMsg }
});