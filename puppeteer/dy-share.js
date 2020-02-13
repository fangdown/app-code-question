const fs = require('fs');
const puppeteer = require('puppeteer');
const moment= require('moment')
// 获取抖音用户作品列表~
const douyinList = (id) => {
  return new Promise(async resolve => {
    const browser = await (puppeteer.launch({ headless: false }));
    const page = await browser.newPage();
    let allInfo = [];
    page.on('requestfailed', request => {
      console.log(request.url() + ' ' + request.failure().errorText);
    });
    page.on('requestfinished', request => {
      // 查看所有请求地址
      if (request.resourceType() === "xhr") {
        // 匹配所需数据的请求地址
        if(request.url().indexOf('https://www.iesdouyin.com/web/api/v2/aweme/post') !== -1) {
          const waitResult = async () => {
            try {
              // 获取数据并转为json格式
              console.log('等待请求结果')
              let res = await request.response();
              let result = await res.json();
              const awemeList = result.aweme_list
              const {min_cursor, max_cursor} = result
              const startDate = moment(min_cursor).format('YYYY-MM-DD')
              const endDate = moment(max_cursor).format('YYYY-MM-DD')

              const list = awemeList.map(item => {
                const {aweme_id, desc, video,statistics} = item
                const video_src = `https://www.iesdouyin.com/share/video/${aweme_id}/?region=CN&mid=&u_code=&titleType=title&utm_source=copy_link&utm_campaign=client_share&utm_medium=android&app=aweme`
                return {
                  aweme_id, desc, video_src,video,statistics,startDate,endDate  
                }
              })
              allInfo.push(...list)
            } catch(err){
              console.log(err)
            }
          }
          waitResult()
        }
      }
    })
    // 进入页面
    await page.goto(`https://www.iesdouyin.com/share/user/${id}`);
    const title = await page.$eval('.nickname', el => el.innerHTML);
    console.log(title);

    console.log('开始滚动到底部')
    await autoScroll(page);
    console.log(`共获取到${allInfo.length}个作品信息`);
    
    // 将作品信息写入文件
    let writerStream = fs.createWriteStream(`douyin-${id}.json`);
    writerStream.write(JSON.stringify(allInfo, undefined, 2), 'UTF8');
    writerStream.end();
    await page.waitFor(5000);
    browser.close();
    resolve()
    // 滑动屏幕，滚至页面底部
    function autoScroll(page) {
      return page.evaluate(() => {
        return new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          // 每500毫秒让页面下滑100像素的距离
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 500);
        })
      });
    }
  })
}

const arr = ['102269017585', '58146392181']
let index = 0
const doTask = async (arr) => {
  console.log('index', index)
  await douyinList(arr[index++])
  if(index <= arr.length -1){
    doTask(arr)
    return
  }
  console.log('task is done')
}
doTask(arr)