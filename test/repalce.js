let str = 'abcdefg'
str.replace(/a/g, function(res, key){
  console.log('====res',res)
  console.log('====key',key)
  return 'x'
})