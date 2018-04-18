/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * 用户API
 */

const router = require('koa-router')();

const user_controller = require('../../app/controllers/users/user_controller');

router.get('/getUser', user_controller.getUser);

router.get('/registerUser', user_controller.registerUser);

module.exports = router;