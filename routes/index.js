const router = require('koa-router')();

const users = require('./users');

const api = require('./api');

const checkWeChat = require('../app/controllers/weChats/checkWeChat');

const getAccessToken = require('../middlewares/getAccessToken');

const postMessage = require('../app/controllers/weChats/postMessage');

// router.use('/users', users.routes(), users.allowedMethods());
// router.use('/api', api.routes(), api.allowedMethods());

//微信验证
router.get('/wechat', checkWeChat);

//微信消息
router.post('/wechat', postMessage, async (ctx, next) => {
    ctx.state = {
        content: 'Hello,你好',
        type: 'text'
    };
    next('world');
});

module.exports = router;
