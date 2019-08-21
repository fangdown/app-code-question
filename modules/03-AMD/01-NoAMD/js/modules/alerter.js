(function(window, dataService){
  let name = 'fangdown'
  function showMsg (){
    alert(`${dataService.getMsg()}-${name}`)
  }
  window.alerter = { showMsg }
})(window, dataService)