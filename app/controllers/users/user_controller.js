/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * API接口
 */

/**
 *  获取用户信息
 */

const ApiErrorName = require('../../error/ApiErrorName');

const ApiError = require('../../error/ApiError');

exports.getUser = async (ctx, next) => {
    // console.log(ctx);
    //从上下文的request对象中获取  -----> koa封装的request
    let requestQuery = ctx.request.query;
    console.log(requestQuery);
    //从上下文中直接获取   -------->原生node的request
    let query = ctx.query;
    console.log(query);
    // if (ctx.query.id != 1) {
    //     throw new ApiError(ApiErrorName.USER_NOT_EXIST);
    // }

    //设置cookies
    ctx.cookies.set(
        'cid',
        'hello world',
        {
            domain: 'localhost',
            path: '/api/users/getUser',
            maxAge: 10 * 60 * 1000,//10分钟 失效时间
            expires: new Date('2017-02-15'),  // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        });

    ctx.body = {
        username: 'hello world',
        age: 30
    };
};

/**
 *  用户注册
 */
exports.registerUser = async (ctx, next) => {
    console.log('registerUser', ctx.request.body);
};