/**
 * Created by qq2575896094 on 2018/4/7.
 *
 * 文件操作
 */

const fs = require('fs');

exports.readFileAsync = async (filePath, encoding = 'utf-8') => {
    return await new Promise((resolve) => {
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                resolve(null);
            } else {
                resolve(data.toString());
            }
        });
    });
};

exports.writeFileAsync = async (filePath, data, encoding = 'utf-8') => {
    return await new Promise((resolve) => {
        fs.writeFile(filePath, data, encoding, (err, data) => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
};
