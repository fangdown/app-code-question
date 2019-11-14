const puppeteer = require('puppeteer')

const screenshot = async () => {
  const browser = await puppeteer.launch({
   // 是否运行浏览器无头模式(boolean)
   headless: false,
   // 是否自动打开调试工具(boolean)，若此值为true，headless自动置为fasle
   devtools: true,
   // 设置超时时间(number)，若此值为0，则禁用超时
   timeout: 20000,
  })
  const page = await browser.newPage()
  await page.goto('https://www.baidu.com')
  await page.screenshot({
    path: './assets/one.png',
    fullPage: true
  })
  await browser.close()
}

screenshot()