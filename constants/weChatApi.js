/**
 * Created by qq2575896094 on 2018/4/7.
 *
 * 微信接口API
 */

const PREFIX = 'https://api.weixin.qq.com/cgi-bin/';//微信API地址前缀

class WeChatApi {
    constructor() {
        this.accessTokenUrl = PREFIX + 'token?grant_type=client_credential';//获取access_token
        this.temporaryMaterialUrl = PREFIX + 'media/upload?';//上传临时素材
        this.permanentMaterial = {
            uploadNews: PREFIX + 'material/add_news?',//新增永久图文素材
            uploadNewsPic: PREFIX + 'media/uploadimg?', //上传图文消息内的图片获取URL
            uploadMaterial: PREFIX + 'material/add_material?'//新增其他类型永久素材
        }
    }
}

module.exports = new WeChatApi();