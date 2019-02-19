'use strict'

import Koa from 'koa'
import json from 'koa-json'
import logger from 'koa-logger'
import bodyparser from 'koa-bodyparser'
import onerror from 'koa-onerror'
import views from 'koa-views'
import cors from 'koa-cors'
import path from 'path'


//router路由列表
import upload from './routes/upload'
import index from './routes/index'






const app = new Koa()

//错误处理中间件
onerror(app)

//cors跨域处理
app.use(cors())

//post参数获取中间件
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))

//json格式化
app.use(json())

//router日志中间件
app.use(logger())

//静态资源中间件
app.use(require('koa-static')(__dirname + '/public'))

//模板引擎中间件
app.use(views(path.join(__dirname + '/public'), {
    extension: 'html',
    map: {
        html: 'handlebars'
    }
}))




//router路由挂载
app.use(upload.routes(), upload.allowedMethods())
app.use(index.routes(), index.allowedMethods())





//错误监听
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

//监听端口
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})