/**
 * Created by qq2575896094 on 2017/5/12.
 *
 * 封装response报文
 */

const ApiError = require('./app/error/ApiError');

const response_formatter = (ctx) => {
    //如果数据有返回,将返回数据放到data中
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success',
        }
    }

};

const url_filter = (pattern) => {
    return async (ctx, next) => {
        let reg = new RegExp(pattern);

        try {
            //现执行路由
            await next();
        } catch (error) {
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if(error instanceof ApiError && reg.test(ctx.originalUrl)){
                ctx.status = 200;
                ctx.body={
                    code:error.code,
                    message:error.message
                }
            }
            //继续向外层抛出错误,让外层服务中间件来处理日志.
            throw error;
        }

        //通过正则表达式的url进行处理
        if (reg.test(ctx.originalUrl))
            response_formatter(ctx);
    }
};

module.exports = url_filter;