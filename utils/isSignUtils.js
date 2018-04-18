/**
 * Created by qq2575896094 on 2018/4/12.
 *
 * 签名验证
 */


const sha1 = require('sha1');

/**
 * 验签
 * @param signature 签名
 * @param params
 * @returns {boolean}
 */
module.exports = (signature, ...params) => {
    let sSignParams = params.sort().join('');
    let sSign = sha1(sSignParams);
    return sSign === signature ? true : false;
};