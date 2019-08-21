;(function(){
  require.config({
    baseUrl: 'js/',
    paths: {
      alerter: './modules/alerter',
      dataService: './modules/dataService',
      jquery: './libs/jquery.min'
    }
  })
  require(['alerter', 'jquery'], function(alerter, $){
    alerter.showMsg()
    $('body').css('color', 'red')
  })
})()