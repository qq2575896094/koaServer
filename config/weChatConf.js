/**
 * Created by qq2575896094 on 04/04/2018.
 */

const path = require('path');

const filePath = path.join(__dirname, './weChat.txt');

const fileUtils = require('../utils/fileUtils');


class WeChatConf {
    constructor() {
        this.appId = 'wx6970d6939dc10862';
        this.appSecret = '3c8c5e999d28a302f67c4e01c62d1576';
        this.token = 'zL18232053662';
    }

    async getAccessTokenFromFile() {
        return await fileUtils.readFileAsync(filePath);
    }

    async saveAccessTokenToFile(data) {
        data = JSON.stringify(data);
        return await fileUtils.writeFileAsync(filePath, data);
    }
}

module.exports = new WeChatConf();
