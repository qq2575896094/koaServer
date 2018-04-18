/**
 * Created by qq2575896094 on 2018/4/7.
 *
 * class WeChat
 *
 */

const oWeChatApi = require('./weChatApi');
const weChatConf = require('../config/weChatConf');
const request = require('request');
const fs = require('fs');
const _ = require('lodash');

class WeChat {
    constructor(opts) {
        this.appId = opts.appId;
        this.appSecret = opts.appSecret;
        this.getAccessTokenFromFile = opts.getAccessTokenFromFile;
        this.saveAccessTokenToFile = opts.saveAccessTokenToFile;
    }

    get instance() {
        return new WeChat(weChatConf);
    }

    /**
     * 获取access_token
     * @returns {Promise<*>}
     */
    async getAccessToken() {
        let oAccessToken = await this.getAccessTokenFromFile();
        try {
            oAccessToken = JSON.parse(oAccessToken);

            //判断是否有效&合法
            if (!this.isValidAccessToken(oAccessToken)) {
                oAccessToken = await this.updateAccessToken();
            }
        } catch (e) {
            oAccessToken = await this.updateAccessToken();
        }
        this.access_token = oAccessToken.access_token;
        this.expires_in = oAccessToken.expires_in;
        await this.saveAccessTokenToFile(oAccessToken);
        return oAccessToken;
    }

    /**
     * 更新access_token
     * @param data
     */
    async updateAccessToken() {
        let appId = this.appId;
        let appSecret = this.appSecret;

        let url = oWeChatApi.accessTokenUrl + '&appid=' + appId + '&secret=' + appSecret;

        return await new Promise((resolve) => {
            request({url: url, json: true}, function (error, response, body) {
                let nowTime = new Date().getTime();

                let expires_in = nowTime + (body.expires_in - 20) * 1000;

                body.expires_in = expires_in;

                resolve(body);
            });
        });
    }

    /**
     * 验证access_token合法性
     * @param data
     */
    isValidAccessToken(data) {
        if (!data || !data.access_token || !data.expires_in) {
            return false;
        }
        // let accessToken = data.access_token;
        let expires_in = data.expires_in;

        let nowTime = new Date().getTime();

        if (nowTime < expires_in) {
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     * @param type
     * @param material
     * @param permanent
     * @returns {Promise<any>}
     */
    async uploadMaterial(type, material, permanent) {

        let oAccessToken = await this.getAccessToken();//获取access_token

        let form = {};

        //默认是上传临时文件
        let uploadUrl = oWeChatApi.temporaryMaterialUrl + 'access_token=' + oAccessToken.access_token + '&type=' + type;

        if (permanent) {
            uploadUrl = oWeChatApi.permanentMaterial.uploadMaterial + 'access_token=' + oAccessToken.access_token + '&type=' + type;

            _.extend(form, permanent);
        }

        if (type === 'newsPic') {
            uploadUrl = oWeChatApi.permanentMaterial.uploadNewsPic + 'access_token=' + oAccessToken.access_token;
        }

        if (type === 'news') {
            uploadUrl = oWeChatApi.permanentMaterial.uploadNews + 'access_token=' + oAccessToken.access_token;
            form = material;
        } else {
            form.access_token = oAccessToken.access_token;
            form.media = fs.createReadStream(material);
        }

        return await new Promise((resolve, reject) => {
            let options = {
                url: uploadUrl,
                method: 'POST',
                json: true
            };
            if (type === 'news') {
                options.body = form;
            } else {
                options.formData = form;
            }
            console.log(options);
            request.post(options, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (!body.errcode) {

                        resolve(body.media_id);
                    } else {
                        console.log(body.errcode + ' ==>' + body.errmsg);
                        reject(body.errcode + ' ==>' + body.errmsg);
                    }

                }
            });
        });
    }
}

module.exports = WeChat;