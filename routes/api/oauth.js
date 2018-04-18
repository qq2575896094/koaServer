/**
 * Created by qq2575896094 on 03/04/2018.
 *
 * 微信授权
 */


const router = require('koa-router')();

const oauth_controller = require('../../app/controllers/users/oauth_controller');

router.get('/getWeChatAccessToken', oauth_controller.getWeChatAccessToken);


router.get('/weChatLogin', oauth_controller.weChatLogin);

// router.get('/getWeChatUserInfo', oauth_controller.getWeChatUserInfo);

// router.get('/getWeChatUserInfo', oauth_controller.getWeChatUserInfo);

module.exports = router;