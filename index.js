const request = require('superagent')
const cheerio = require('cheerio')
const h2m = require('h2m')
const fs = require('fs')
const Q = require('q')

// 定义请求url的基本样式
const url = 'http://ife.baidu.com'
const root = './dist/'

let mkdir = Q.denodeify(fs.mkdir)

mkdir(root)
.then(() => {
  return request(url)
})
.then(res => {
  let colleges = []
  let $ = cheerio.load(res.text, {decodeEntities: false}) // 加参数解决中文乱码问题
  $('.home-college-item').each(function(index, element) {
    let $element = $(element)
    colleges.push({
      title: $element.find('.college-content-title').text(),
      href: $element.find('a').attr('href')
    })
  })
  return colleges
})
.then(colleges => {
  let promise = Promise.resolve()
  colleges.forEach(college => {
    promise = promise.then(() => {
      return mkdir('./dist/'+ college.title)
    })
  })
  return colleges
})
.then(colleges => {
  let promise = Promise.resolve()
  colleges.map(college => {
    return request(url + college.href)
  })
})
.then(res => {
  //
})
.catch(err => {
  console.log(err.stack)
})