const fs = require('fs');
const puppeteer = require('puppeteer');

// 本次模拟获取苏宁易购的数据，来抓取在售的所有笔记本电脑信息~
const suning = async () => {
  const browser = await (puppeteer.launch({ headless: false }));
  const page = await browser.newPage();

  // 进入页面
  // await page.goto('https://search.suning.com/笔记本电脑/');
  await page.goto('https://www.suning.com');

  // 获取页面标题
  let title = await page.title();
  console.log(title);

  // 点击搜索框拟人输入“笔记本电脑”
  await page.type('#searchKeywords', '笔记本电脑', { delay: 500 });
  console.log('搜索页');
  // 点击搜索按钮
  await page.click('.search-btn');
  // await page.click('#searchKeywords');
  // await page.type('#searchKeywords', String.fromCharCode(13));
  console.log('点击后');
  // 等待页面跳转，注意：如果 click() 触发了一个跳转，会有一个独立的 page.waitForNavigation()对象需要等待
  // await page.waitForNavigation({
  //   networkidle0: '500',
  //   waitUntil: 'load'
  // });
  console.log('waitForNavigation');
  // 获取当前搜索项商品最大页数，为节约爬取时间，暂只爬取前5页数据
  // const maxPage = await page.evaluate(() => {
  //   return Number($('#bottomPage').attr('max'));
  // })
  const maxPage = 5;

  let allInfo = [];
  console.log('开始循环')
  for (let i = 0; i < maxPage; i++) {
    // 因为苏宁页面的商品信息用了懒加载，所以需要把页面滑动到最底部，保证所有商品数据都加载出来
    console.log('开始滚动到底部')
    await autoScroll(page);
    // 保证每个商品信息都加载出来
    await page.waitFor(5000);
    // 获取每个
    const SHOP_LIST_SELECTOR = 'ul.general.clearfix';
    const shopList = await page.evaluate((sel) => {
      const shopBoxs = Array.from($(sel).find('li div.res-info'));
      const item = shopBoxs.map(v => {
        // 获取每个商品的名称、品牌、价格
        const title = $(v).find('div.title-selling-point').text().trim();
        const brand = $(v).find('b.highlight').text().trim();
        const price = $(v).find('span.def-price').text().trim();
        return {
          title,
          brand,
          price,
        };
      });
      return item;
    }, SHOP_LIST_SELECTOR);
    allInfo = [...allInfo, ...shopList];
    console.log('allInfo',allInfo)
    // 当当前页面并非最大页的时候，跳转到下一页
    if (i < maxPage - 1) {
      const nextPageUrl = await page.evaluate(() => {
        const url = $('#nextPage').get(0).href;
        return url;
      });
      await page.goto(nextPageUrl, { waitUntil:'networkidle0' });
      // waitUntil对应的参数如下：
      // load - 页面的load事件触发时
      // domcontentloaded - 页面的 DOMContentLoaded 事件触发时
      // networkidle0 - 不再有网络连接时触发（至少500毫秒后）
      // networkidle2 - 只有2个网络连接时触发（至少500毫秒后）
    }
  }

  console.log(`共获取到${allInfo.length}台笔记本电脑信息`);

  // 将笔记本电脑信息写入文件
  writerStream = fs.createWriteStream('notebook.json');
  writerStream.write(JSON.stringify(allInfo, undefined, 2), 'UTF8');
  writerStream.end();

  browser.close();

  // 滑动屏幕，滚至页面底部
  function autoScroll(page) {
    return page.evaluate(() => {
      return new Promise((resolve) => {
        var totalHeight = 0;
        var distance = 100;
        // 每200毫秒让页面下滑100像素的距离
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      })
    });
  }
}
suning()