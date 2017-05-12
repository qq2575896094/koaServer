/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * API接口
 */

/**
 *  获取用户信息
 */

const ApiErrorName = require('../error/ApiErrorName');

const ApiError = require('../error/ApiError');

exports.getUser = async (ctx, next) => {
    if (ctx.query.id != 1) {
        throw new ApiError(ApiErrorName.USER_NOT_EXIST);
    }
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