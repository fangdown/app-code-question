
const crypto = require('crypto')
// 打印所有算法
// console.log(crypto.getHashes());
// [ 'RSA-MD4',
//   'RSA-MD5',
//   'RSA-MDC2',
//   'RSA-RIPEMD160',
//   'RSA-SHA1',
//   'RSA-SHA1-2',
//   'RSA-SHA224',
//   'RSA-SHA256',
//   'RSA-SHA384',
//   'RSA-SHA512',
//   'blake2b512',
//   'blake2s256',
//   'md4',
//   'md4WithRSAEncryption',
//   'md5',
//   'md5-sha1',
//   'md5WithRSAEncryption',
//   'mdc2',
//   'mdc2WithRSA',
//   'ripemd',
//   'ripemd160',
//   'ripemd160WithRSA',
//   'rmd160',
//   'sha1',
//   'sha1WithRSAEncryption',
//   'sha224',
//   'sha224WithRSAEncryption',
//   'sha256',
//   'sha256WithRSAEncryption',
//   'sha384',
//   'sha384WithRSAEncryption',
//   'sha512',
//   'sha512WithRSAEncryption',
//   'ssl3-md5',
//   'ssl3-sha1',
//   'whirlpool' 
// ]

// md5
const md5 = crypto.createHash('md5')
let md5Sum = md5.update('hello')
md5Sum = md5.update('hello2')
const result = md5Sum.digest('hex')
console.log('result', result)


function aesEncrypt(data, key) {
  const cipher = crypto.createCipher('aes192', key);
  var crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function aesDecrypt(encrypted, key) {
  const decipher = crypto.createDecipher('aes192', key);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

var data = 'Hello, this is a secret message!';
var key = 'Password!';
var encrypted = aesEncrypt(data, key);
var decrypted = aesDecrypt(encrypted, key);

console.log('Plain text: ' + data);
console.log('Encrypted text: ' + encrypted);
console.log('decrypted text: ' + decrypted);

 
const hmac = crypto.createHmac('sha256', 'secret-key');
 
hmac.update('Hello, world!');
hmac.update('Hello, nodejs!');
 
console.log(hmac.digest('hex')); // 80f7e22570...