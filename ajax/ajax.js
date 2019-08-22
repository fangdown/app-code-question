function ajax(url, method){
  var xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.send()
  xhr.onreadystatechange = function(e){
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        console.log(xhr.responseText)
        document.body.innerText = xhr.responseText
      }
    }
  }
}
