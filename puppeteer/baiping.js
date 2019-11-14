// 获取白屏时间

const puppeteer = require('puppeteer')

// 检测页面url
const url = 'https://www.zhengcaiyun.cn';
// 检测次数
const times = 5;
const record = [];

const optimization = async () => {
  const calculate = (timing) => {
    const result = {}
    result.whiteScreenTime = timing.responseStart - timing.navigationStart
    result.requestTime = timing.responseEnd - timing.responseStart
    return result
  }
  
  for(let i =0 ;i < times; i++){
    const browser = await puppeteer.launch({
      headless: false
    })
    const page = await browser.newPage()
    await page.goto(url)
    await page.waitFor(5000)
    const timing = JSON.parse(await page.evaluate(()=>JSON.stringify(window.performance.timing)))
    record.push(calculate(timing))
    await browser.close()
  }
  let whiteScreenTime = 0
  let requestTime = 0
  for(let item of record){
    whiteScreenTime +=item.whiteScreenTime
    requestTime += item.requestTime
  }
  const result = []
  result.push(url)
  result.push(`页面平均白屏时间为:${whiteScreenTime/times}ms`)
  result.push(`页面平均请求时间为:${requestTime/times}ms`)
  console.log(result)

  
}
optimization()