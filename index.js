const request = require('superagent')
const cheerio = require('cheerio')
const h2m = require('h2m')
const fs = require('fs')

// 定义请求url的基本样式
const url = 'http://ife.baidu.com/course/detail/id/'
const dist = './md/'

let flag = false
let college = []
let Count = 1

// md对象的构造函数
function MdObject(path, title, order, content ) {
  this.path = path
  this.title = title
  this.order = order
  this.content = content
}

for (let i=1; i<200; i++) {
  let order = 1
  request
  .get(url + i)
  .end((err, res) => {
    // 错误处理
    if(err) {
      console.log('请求太快了...')
      i--
    }
      // 请求内容源
    let $ = cheerio.load(res.text, {decodeEntities: false}) // 加参数解决中文乱码问题
    let main = $('main')
    let obj = new MdObject()
    

    // 跳出处理
    if(main.hasClass('not-found-wrap')) {
      return false
    }
    // 处理请求到的内容
    $('.deadline-tip').remove() // 删掉截止日期

    let path = main.find('div .course-from a').eq(1).text()
    // college.push(path)
    if(college.indexOf(path) === -1) { // 当前遍历是新的文件夹
      college.push(path)
      obj.path = path
      order = 1
      fs.mkdir(dist + path, (err) => {
        if(err){
          console.log('文件夹建立错误...')
         }else{
          console.log("建立" + path + '文件夹')
         }
      })
      
    } else {
      obj.path = path
      order++
    }

    // 对标题格式进行检查
    let title = main.find('.course-title').text().trim().replace('\/', ' or ')
    obj.title = title + '.md'
    let html = main.find('.md-content-wrap').html()
    let md = h2m(html)

    fs.writeFile(dist + obj.path + '/' + obj.title, md, err => {
      if(err) throw err      
    })
  })
}