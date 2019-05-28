"use strict";

/**
 * Created by qq2575896094 on 2018/4/29.
 */

const co = require('co');
const fetch = require('node-fetch');

co(function* () {
    let res = yield fetch('https://test.hulubank.com.cn/api/por/queryBannerInfoService');
    console.log(res);
    const json = yield res.json();
    console.log(json);
    const returnCode = json.returnCode;
    console.log(returnCode);
});