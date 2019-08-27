const arr = ['a', 'abc', 'b','bdc', 'abcd']
let searchInput = document.getElementById('searchInput')
searchInput.addEventListener('input', function(e){
  e = e || window.event
  let target = e.target|| e.srcElement
  let value= target.value
  if(!value) return
  autocomplete(value, arr)
})
function autocomplete(str, arr){
  let list = []
  const ul = document.getElementById('ul')
  for(let i = 0; i< arr.length;i++){
    if(arr[i].startsWith(str)){
      list.push(`<li>${arr[i]}</li>`)
    }
  }
  ul.innerHTML = list.join('')
  ul.style.display = 'block'
}
ul.addEventListener('click', function(e){
  e = e || window.event
  let target = e.target|| e.srcElement
  if(target.tagName.toLowerCase() === 'li'){
    searchInput.value = target.innerText
    ul.style.display = 'none'
  }
})