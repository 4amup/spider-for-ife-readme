const request = require('superagent')
const cheerio = require('cheerio')
const h2m = require('h2m')
const fs = require('fs')

// 定义请求url的基本样式
const urlSource = 'http://ife.baidu.com/course/detail/id/'

let idCount = 0

request
  .get('http://ife.baidu.com/course/detail/id/90')
  .end((err, res) => {
    // 错误处理
    if(err) throw err

    // 处理请求到的内容
    let $ = cheerio.load(res.text, {decodeEntities: false}); // 加参数解决中文乱码问题
    $('.deadline-tip').remove()
    let html = $('.md-content-wrap').html()
    let md = h2m(html)

    fs.writeFile('./md/test.md', md, err => {
      if(err) throw err
      console.log('The file has been saved!')
    })
  })