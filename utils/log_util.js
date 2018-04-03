/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * 日志输出工具
 */

const log4js = require('log4js');

const config = require('../config/log_config');

//加载日志配置文件

log4js.configure(config);

const logUtil = {};

const errLogger = log4js.getLogger('errorLogger');

const resLogger = log4js.getLogger('resLogger');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error)
        errLogger.error(formatError(ctx, error, resTime));
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatResponseLog(ctx, resTime));
    }
};

//格式化错误日志
function formatError(ctx, error, resTime) {
    let logTxt = "";

    //错误信息开始
    logTxt += "\n" + "*************** error log start ***************" + "\n";
    //添加请求日志
    logTxt += formatRequestLog(ctx.request, resTime);
    //错误名称
    logTxt += "err name: " + error.name + "\n";
    //错误信息
    logTxt += "err message: " + error.message + "\n";
    //错误详情
    logTxt += "err stack: " + error.stack + "\n";

    //错误信息结束
    logTxt += "*************** error log end ***************" + "\n";

    return logTxt;
}

//格式化请求日志
function formatRequestLog(request, resTime) {
    let logTxt = "";
    let method = request.method;
    //访问方法
    logTxt += "request method: " + method + "\n";
    //请求原始地址
    logTxt += "request originalUrl: " + request.originalUrl + "\n";
    //客户端ip
    logTxt += "request client ip:  " + request.ip + "\n";
    //开始时间
    let startTime;
    //请求参数
    if (method === 'GET') {
        logTxt += "request query:  " + JSON.stringify(request.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logTxt += "request body: " + "\n" + JSON.stringify(request.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logTxt += "response time: " + resTime + "\n";

    return logTxt;
}

//格式化响应日志
function formatResponseLog(ctx, resTime) {
    let logTxt = "";
    //响应日志开始
    logTxt += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logTxt += formatRequestLog(ctx.request, resTime);

    //响应状态码
    logTxt += "response status: " + ctx.status + "\n";

    //响应内容
    logTxt += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logTxt += "*************** response log end ***************" + "\n";

    return logTxt;

}


module.exports = logUtil;