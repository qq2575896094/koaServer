/**
 * Created by qq2575896094 on 2018/4/12.
 *
 * 解析XML,谁出Promise json
 */

const XMLJS = require('xml2js');

/**
 * 解析XML
 * @param xml
 * @returns {Promise<any>} JSON
 */
exports.parseXML = async (xml) => {
    return await new Promise((resolve, reject) => {
        XMLJS.parseString(xml, {trim: true}, function (err, obj) {
            if (err) {
                return reject(err);
            }

            resolve(obj);
        })
    })
};

/**
 * 格式化JSON
 * @param result
 */
exports.formatMessage = (result) => {
    let message = {};
    if (typeof result === 'object') {
        for (let key in result) {
            if (!(result[key] instanceof Array) || result[key].length === 0) {
                continue;
            }
            if (result[key].length === 1) {
                let val = result[key][0];
                if (typeof val === 'object') {
                    message[key] = formatMessage(val);
                } else {
                    message[key] = (val || '').trim();
                }
            } else {
                message[key] = result[key].map(function (item) {
                    return formatMessage(item);
                })
            }
        }
    }
    return message;
};