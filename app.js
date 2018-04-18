const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
// const json = require('koa-json');
const onerror = require('koa-onerror');
// const bodyParser = require('koa-bodyparser')();

const logger = require('koa-logger');
const logUtil = require('./utils/log_util');

const router = require('./routes');


// const url_filter = require('./response_formatter');


// error handler
onerror(app);

// middlewares
// app.use(bodyParser);
// app.use(json());
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
