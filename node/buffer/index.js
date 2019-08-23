var buffer = Buffer.from('www.baidu.com');
//  缓冲区长度--13
console.log("buffer length: " + buffer.length);

var buffer1 = Buffer.from('ABC');
var buffer2 = Buffer.from('1ABCD');
var result = buffer1.compare(buffer2);

if(result < 0) {
   console.log(buffer1 + " 在 " + buffer2 + "之前");
}else if(result == 0){
   console.log(buffer1 + " 与 " + buffer2 + "相同");
}else {
   console.log(buffer1 + " 在 " + buffer2 + "之后");
}

const buf = Buffer.from('runoob', 'ascii');
// 输出 cnVub29i
console.log(buf.toString('base64'));
console.log(buf.toString());