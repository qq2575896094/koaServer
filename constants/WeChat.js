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
     * 新增临时素材
     * @param type
     * @param material
     * @returns {Promise<any>}
     */
    async uploadTemporaryMaterial(type, material) {

        let oAccessToken = await this.getAccessToken();//获取access_token

        let form = {};

        form.media = fs.createReadStream(material);

        //默认是上传临时文件
        let uploadUrl = oWeChatApi.temporaryMaterialUrl + 'access_token=' + oAccessToken.access_token + '&type=' + type;


        return await new Promise((resolve, reject) => {
            let options = {
                url: uploadUrl,
                method: 'POST',
                json: true,
                formData: form
            };

            console.log(options);
            request.post(options, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (!body.errcode) {

                        console.log(JSON.stringify(body));

                        resolve(body);
                    } else {
                        console.log(body.errcode + ' ==>' + body.errmsg);
                        reject(body.errcode + ' ==>' + body.errmsg);
                    }

                }
            });
        }).catch((e) => {
            console.log(e);
        });
    }

    /**
     *
     * @returns {Promise<any>}
     */
    async uploadPermanentMaterial(type, material) {

        let oAccessToken = await this.getAccessToken();//获取access_token

        let form = {};


        //默认增加其他类型永久素材
        let uploadUrl = oWeChatApi.permanentMaterial.uploadMaterial + 'access_token=' + oAccessToken.access_token + '&type=' + type;


        if (type === 'news') {//新增永久图文素材
            uploadUrl = oWeChatApi.permanentMaterial.uploadNews + 'access_token=' + oAccessToken.access_token;

            form = material;
        } else {

            form.media = fs.createReadStream(material);
        }

        if (type === 'newsPic') {//上传图文消息内的图片获取URL
            uploadUrl = oWeChatApi.permanentMaterial.uploadNewsPic + 'access_token=' + oAccessToken.access_token;
        }


        let options = {
            url: uploadUrl,
            method: 'POST',
            json: true,

        };

        type === 'news' ? options.body = form : options.formData = form;

        console.log(options);
        return await new Promise((resolve, reject) => {

            request(options, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    if (!body.errcode) {

                        console.log(JSON.stringify(body));

                        resolve(body);
                    } else {
                        console.log(body.errcode + ' ==>' + body.errmsg);
                        reject(body.errcode + ' ==>' + body.errmsg);
                    }

                }
            });
        }).catch((e) => {
            console.log(e);
        });

    }

}

module.exports = WeChat;