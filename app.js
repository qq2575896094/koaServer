const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const httpProxy = require('http-proxy-middleware');
const bodyParser = require('koa-bodyparser')({ enableTypes:['json', 'form', 'text'] });
const k2c = require('koa2-connect');

const logger = require('koa-logger');
const logUtil = require('./utils/log_util');

const router = require('./routes');


// const url_filter = require('./response_formatter');

// 转发中间件
app.use(async(ctx, next) => {
    if (ctx.url.startsWith('/api')) { //匹配有api字段的请求url
        ctx.respond = false // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
        await k2c(httpProxy({
                target: 'http://172.21.28.13:8081',
                changeOrigin: true,
                secure: false,
                // pathRewrite: {
                //     '^/api': ''
                // }
            }
        ))(ctx,next);
    }
    await next()
})

// error handler
onerror(app);

// middlewares
app.use(bodyParser);
app.use(json());
app.use(logger());

app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname + '/views', {
    extension: 'html'
}));


// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    console.log('start', start);
    //响应间隔时间
    let ms;
    try {
        //开始进入下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        console.log('end', new Date());
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});

//仅对/api开头的url进行格式化处理
// app.use(url_filter('^/api'));


// routes
app.use(router.routes(), router.allowedMethods());


app.on('error', (err, ctx) => {
    console.log(err);
    logger.error('server error', err, ctx);
});

module.exports = app;
