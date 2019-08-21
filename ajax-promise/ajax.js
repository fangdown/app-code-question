function ajax(url, method = 'get', param = {}){
  return new Promise((resolve, reject)=> {
    const xhr = new XMLHttpRequest()
    const paramString = getParamString(param)
    if(method === 'get' && paramString){
      url.indexOf('?') > -1 ? url+= paramString: url+= `?${paramString}`
    }
    xhr.open(method, url)
    xhr.onload = function(){
      const result = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders(),
        data: xhr.response || xhr.responseText
      }
      if(xhr.status >= 200 && xhr.status < 300 || xhr.status === '304'){
        resolve(result)
      } else {
        reject(result)
      }
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-urlencoded')
    xhr.withCredentials = true
    xhr.onerror = function(){
      reject( new TypeError('请求出错'))
    }
    xhr.timeout = function(){
      reject(new TypeError('请求超时'))
    }
    xhr.onabort = function(){
      reject(new TypeError('请求中止'))
    }
    if(method === 'post'){
      xhr.send(paramString)
    } else {
      xhr.send()
    }
  })
}

function getParamString(param){
  let str = ''
  for(key in param){
    str +=`${key}=${param[key]}&`
  }
  return str
}