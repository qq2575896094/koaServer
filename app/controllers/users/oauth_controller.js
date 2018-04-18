/**
 * Created by qq2575896094 on 03/04/2018.
 */

const request = require('request');

const ApiErrorName = require('../../error/ApiErrorName');

const ApiError = require('../../error/ApiError');


//get授权页面回调后的code
exports.getWeChatAccessToken = async () => {

};

//
exports.weChatLogin = async (ctx, next) => {
    // //第一步：用户同意授权，获取code
    const router = 'getWeChatAccessToken';
    //编码后的回调地址，这里一定要记得加端口号，因为我们在测试号里设置过的

    let return_uri = encodeURIComponent('http://qiusuomen.com/oauth/' + router);

    console.log(decodeURIComponent(return_uri));
    let scope = 'snsapi_userinfo';


    //重定向授权地址，回调页面是return_uri，中间有oauth是因为我下面写了虚拟目录的代理

};

exports.weChatCheck = async (ctx, next) => {

};

// exports.weChatLogin = async (ctx, next) => {
// };
