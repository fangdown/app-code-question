(function(){
  let msg = 'hello'
  function getMsg(){
    return msg
  }
  window.dataService = { getMsg }
})()