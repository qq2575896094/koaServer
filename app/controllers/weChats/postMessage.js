/**
 * Created by qq2575896094 on 2018/4/8.
 *
 * 微信 post MESSAGE
 *
 * 1.处理POST类型的控制逻辑，接收xml数据包
 *
 * 2.解析数据包，获取数据包的消息类型或数据类型；
 *
 * 3.拼装自定义的消息；
 *
 * 4.包装成xml格式；
 *
 * 5.在5秒钟内返回消息。
 */


const getRawBody = require('raw-body');


const ejs = require('ejs');

const isSignUtils = require('../../../utils/isSignUtils');

const XMLUtils = require('../../../utils/XMLUtils');

const weChatConf = require('../../../config/weChatConf');

const wxReply = require('../../../utils/wxReply');

const WeChat = require('../../../constants/WeChat');
const path = require('path');

module.exports = async (ctx, next) => {
    //获取token
    const token = weChatConf.token;

    //获取请求参数
    const signature = ctx.request.query.signature; //签名
    const nonce = ctx.request.query.nonce; //随机数
    const timestamp = ctx.request.query.timestamp; //时间戳

    //判断签名是否正确
    let isSign = isSignUtils(signature, nonce, timestamp, token);
    if (!isSign) {
        console.log('签名验证失败');
        return;
    }

    //取原始数据
    const xml = await getRawBody(ctx.req, {
        length: ctx.request.length,
        limit: '1mb',
        encoding: ctx.request.charset || 'utf-8'
    });

    let oXml = await XMLUtils.parseXML(xml);
    let oBody = XMLUtils.formatMessage(oXml.xml);

    let replyMessageXml = '';
    switch (oBody.MsgType) {
        case 'event': {
            if (oBody.Event === 'subscribe') {//关注事件
                if (oBody.EventKey) { //扫描带参数二维码事件
                    console.log(oBody.EventKey + ' ' + oBody.ticket);

                }

                await next();

                replyMessageXml = wxReply.tpl(ctx.state, oBody);

                console.log('replyMessageXml', replyMessageXml);

                ctx.body = replyMessageXml;
            }
            if (oBody.Event === 'unsubscribe') {//取消关注事件
                let resBody = '取消关注';

                ctx.body = resBody;
            }

            if (oBody.Event === 'LOCATION') { //上报地理位置事件
                let str = oBody.Latitude + ' ' + oBody.Longitude + ' ' + oBody.Precision;
                console.log(str);
                ctx.body = str;
            }
            if (oBody.Event === 'CLICK') {//自定义菜单事件
                ctx.body = '您点击了菜单';
            }

            if (oBody.Event === 'SCAN') {//关注后扫描二维码
                ctx.body = '关注后扫描二维码';
            }

            if (oBody.Event === 'VIEW') {//点击菜单中的链接
                ctx.body = '点击菜单中的链接';
            }

            break;
        }
        case 'text': {

            let content = oBody.Content;
            let sRes = '您说的' + content + '太复杂了!';

            if (content === '1') {
                sRes = {
                    type: 'text',
                    content: '竹杖芒鞋轻胜马,谁怕?一蓑烟雨任平生。\r\n' +
                    '醉后不知天在水,满船清梦压星河。\r\n' +
                    '对一张琴,一壶酒,一溪云。\r\n' +
                    '山中何事?松花酿酒,春水煮茶。\r\n' +
                    '鹿门月照开烟树,忽到庞公栖隐处。\r\n' +
                    '春水碧于天,画船听雨眠\r\n' +
                    '掬水月在手,弄花香满衣。\r\n' +
                    '采菊东篱下,悠然见南山。\r\n' +
                    '我醉欲眠卿且去,明朝有意抱琴来。'
                }
            }

            if (content === '2') {
                let weChat = new WeChat(weChatConf).instance;
                let mediaId = await weChat.uploadMaterial('image', path.join(__dirname, '../../../material/v8.png'));
                sRes = {
                    type: 'image',
                    mediaId: mediaId
                }
            }

            if (content === '3') {
                let weChat = new WeChat(weChatConf).instance;
                let mediaId = await weChat.uploadMaterial('image', path.join(__dirname, '../../../material/v8.png'), {type: 'image'});
                sRes = {
                    type: 'image',
                    mediaId: mediaId
                }
            }

            if (content === '4') {
                let weChat = new WeChat(weChatConf).instance;
                let mediaId = await weChat.uploadMaterial('video', path.join(__dirname, '../../../material/4.mp4'), {
                    type: 'video',
                    description: '{"title":"天下", "introduction":"天下武功唯快不破"}'
                });
                console.log(mediaId);
                sRes = {
                    type: 'video',
                    mediaId: mediaId,
                    title: "天下",
                    description: "天下武功唯快不破"
                }
            }

            if (content === '11') {//音频
                let weChat = new WeChat(weChatConf).instance;
                let mediaId = await weChat.uploadMaterial('video', path.join(__dirname, '../../../material/5.mp4'), {
                    type: 'video',
                    description: '{"title":"天==下", "introduction":"天下武功唯快不破"}'
                });
                // console.log(mediaId);
                sRes = {
                    type: 'video',
                    mediaId: mediaId,
                    title: "天下",
                    description: "天下武功唯快不破"
                }
            }

            replyMessageXml = wxReply.tpl(sRes, oBody);

            ctx.body = replyMessageXml;
            break;
        }

    }
};
