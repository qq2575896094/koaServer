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
            let sRes = {type: 'text', content: '您说的' + content + '太复杂了!'};

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

            if (content === '2') {//临时图片
                let weChat = new WeChat(weChatConf).instance;
                let oMediaId = await weChat.uploadTemporaryMaterial('image', path.join(__dirname, '../../../material/v8.png'));
                sRes = {
                    type: 'image',
                    mediaId: oMediaId.media_id
                }
            }

            if (content === '3') {//临时video
                let weChat = new WeChat(weChatConf).instance;
                let oMediaId = await weChat.uploadTemporaryMaterial('video', path.join(__dirname, '../../../material/4.mp4'));

                console.log('mediaId: ', oMediaId.media_id);
                sRes = {
                    type: 'video',
                    mediaId: oMediaId.media_id,
                    title: "天下",
                    description: "天下武功唯快不破"
                }
            }

            if (content === '4') {//临时voice
                let weChat = new WeChat(weChatConf).instance;
                let oMediaId = await weChat.uploadTemporaryMaterial('voice', path.join(__dirname, '../../../material/s.mp3'));

                console.log('mediaId: ', oMediaId.media_id);
                sRes = {
                    type: 'voice',
                    mediaId: oMediaId.media_id,
                }
            }

            if (content === '5') {//永久素材-image
                let weChat = new WeChat(weChatConf).instance;
                let oMediaId = await weChat.uploadPermanentMaterial('image', path.join(__dirname, '../../../material/v8.png'));

                console.log('mediaId: ', oMediaId.media_id);
                sRes = {
                    type: 'image',
                    mediaId: oMediaId.media_id,
                }
            }

            if (content === '6') {//永久图文素材
                let weChat = new WeChat(weChatConf).instance;
                // let oImageId = await weChat.uploadPermanentMaterial('image', path.join(__dirname, '../../../material/4.mp4'));
                let oMediaId = await weChat.uploadPermanentMaterial('news',
                    [{
                        title: '天涯',
                        thumb_media_id: 'M_bq9t28HdsDw2UsRtupQqzSNw8bBuk5A0_QsCWnQWc',
                        author: '雨田',
                        digest: '海内存知己,天涯若比邻。',
                        show_cover_pic: 1,
                        content: '竹杖芒鞋轻胜马,谁怕?一蓑烟雨任平生。\r\n' +
                        '醉后不知天在水,满船清梦压星河。\r\n' +
                        '对一张琴,一壶酒,一溪云。\r\n' +
                        '山中何事?松花酿酒,春水煮茶。\r\n' +
                        '鹿门月照开烟树,忽到庞公栖隐处。\r\n' +
                        '春水碧于天,画船听雨眠\r\n' +
                        '掬水月在手,弄花香满衣。\r\n' +
                        '采菊东篱下,悠然见南山。\r\n' +
                        '我醉欲眠卿且去,明朝有意抱琴来。',
                        content_source_url: 'https://github.com/qq2575896094'
                    }]
                );

                console.log('mediaId: ', JSON.stringify(oMediaId));
                sRes = [{
                    title: oMediaId.title,
                    description: oMediaId.digest,
                    picUrl: oMediaId.thumb_media_id,
                    url: oMediaId.content_source_url
                }]


            }
            if (content === '7') {//永久图文素材
                // let weChat = new WeChat(weChatConf).instance;
                // let oImageId = await weChat.uploadPermanentMaterial('image', path.join(__dirname, '../../../material/4.mp4'));
                // let oMediaId = await weChat.uploadPermanentMaterial('news',
                //     [{
                //         title: '天涯',
                //         thumb_media_id: 'M_bq9t28HdsDw2UsRtupQqzSNw8bBuk5A0_QsCWnQWc',
                //         author: '雨田',
                //         digest: '海内存知己,天涯若比邻。',
                //         show_cover_pic: 1,
                //         content: '竹杖芒鞋轻胜马,谁怕?一蓑烟雨任平生。\r\n' +
                //         '醉后不知天在水,满船清梦压星河。\r\n' +
                //         '对一张琴,一壶酒,一溪云。\r\n' +
                //         '山中何事?松花酿酒,春水煮茶。\r\n' +
                //         '鹿门月照开烟树,忽到庞公栖隐处。\r\n' +
                //         '春水碧于天,画船听雨眠\r\n' +
                //         '掬水月在手,弄花香满衣。\r\n' +
                //         '采菊东篱下,悠然见南山。\r\n' +
                //         '我醉欲眠卿且去,明朝有意抱琴来。',
                //         content_source_url: 'https://github.com/qq2575896094'
                //     }]
                // );

                // console.log('mediaId: ', JSON.stringify(oMediaId));
                sRes = [{
                    title: '天涯',
                    description: '海内存知己,天涯若比邻。',
                    picUrl: 'M_bq9t28HdsDw2UsRtupQqzSNw8bBuk5A0_QsCWnQWc',
                    url: 'https://github.com/qq2575896094'
                }]


            }

            replyMessageXml = wxReply.tpl(sRes, oBody);

            ctx.body = replyMessageXml;
            break;
        }

    }
};
