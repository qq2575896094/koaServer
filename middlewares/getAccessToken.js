/**
 * Created by qq2575896094 on 2018/4/7.
 *
 * 获取微信access_token
 *
 */

const WeChat = require('../constants/WeChat');

module.exports = async (ctx, next) => {
    const accessToken = new WeChat(weChatConf).instance;
    let at = await accessToken.getAccessToken();
    console.log(at);
    next();
};