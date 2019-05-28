/**
 * Created by qq2575896094 on 2018/4/16.
 *
 * 微信消息回复
 */

const tplUtils = require('./tplUtils');

const _ = require('lodash');

exports.tpl = (content, message) => {
    let replyInfo = {};

    let type = 'text';

    if (Array.isArray(content)) {
        type = 'news';
    } else {

    }
    replyInfo.content = content;


    type = content.type || type;

    replyInfo.msgType = type;
    replyInfo.toUserName = message.FromUserName;
    replyInfo.fromUserName = message.ToUserName;
    replyInfo.createTime = new Date().getTime();

    console.log('被动回复消息: ', replyInfo);

    return tplUtils.compiled(replyInfo);
};

