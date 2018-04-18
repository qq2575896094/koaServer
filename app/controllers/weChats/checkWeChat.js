/**
 * Created by qq2575896094 on 04/04/2018.
 *
 * 微信验证服务器
 */

const sha1 = require('sha1');

const weChatConf = require('../../../config/weChatConf');

const isSignUtils = require('../../../utils/isSignUtils');


module.exports = async (ctx, next) => {

    //获取token
    const token = weChatConf.token;

    //获取请求参数
    const signature = ctx.request.query.signature; //签名
    const nonce = ctx.request.query.nonce; //随机数
    const timestamp = ctx.request.query.timestamp; //时间戳
    const echostr = ctx.request.query.echostr;

    let isSign = isSignUtils(signature, nonce, timestamp, token);

    //比较签名,返回
    if (isSign) {
        console.log('======微信验证成功======');
        ctx.response.body = echostr + '';
    } else {
        console.log('======微信验证失败======');
        ctx.response.body = 'wechat checktout wrong';
    }
};

