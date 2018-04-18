/**
 * Created by qq2575896094 on 2018/4/16.
 *
 * 微信消息回复
 */

const tplUtils = require('./tplUtils');

exports.tpl = (content, message) => {
    let replyInfo = {};

    let type = 'text';

    if (Array.isArray(content)) {
        type = 'news';
    }

    replyInfo.content = content;

    type = content.type || type;

    replyInfo.msgType = type;
    replyInfo.toUserName = message.FromUserName;
    replyInfo.fromUserName = message.ToUserName;
    replyInfo.createTime = new Date().getTime();

    return tplUtils.compiled(replyInfo);
};

