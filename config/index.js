/**
 * Created by qq2575896094 on 2017/5/3.
 */

const development_env = require('./development');

const test_env = require('./test');

//根据不同的NODE_ENV,输出不同的配置对象,默认输出development的配置对象
module.exports = {
    development_env: development_env,
    test_env: test_env,
}[process.env.NODE_ENV || 'development_env'];
