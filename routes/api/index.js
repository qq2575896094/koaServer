/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * 配置API模块路由
 */

const router = require('koa-router')();

const user_router = require('./user_router');

const oauth = require('./oauth');

// router.use('/users', user_router.routes(), user_router.allowedMethods());
//
// router.use('/oauths', oauth.routes(), oauth.allowedMethods());


module.exports = router;

