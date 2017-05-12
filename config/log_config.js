/**
 * Created by qq2575896094 on 2017/5/3.
 *
 * 日志配置文件
 */

const path = require('path');


const baseLogPath = path.resolve(__dirname, '../logs');             //日志基础路径

const errorPath = '/error';                                         //错误日志目录

const errorFileName = 'error';                                      //错误日志文件名

const errLogPath = baseLogPath + errorPath + '/' + errorFileName;   //错误日志输出完整路径

const resPath = '/response';                                        //响应日志目录

const resFileName = 'response';                                     //响应日日志文件名

const resLogPath = baseLogPath + resPath + '/' + resFileName;       //响应日志输出完整路径

module.exports = {
    "appenders": [
        //错误之日
        {
            "category": "errorLogger",                              //logger名称
            "type": "dateFile",                                     //日志类型
            "filename": errLogPath,                                 //日志输出位置
            "alwaysIncludePattern": true,                           //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",                        //后缀，每小时创建一个新的日志文件
            "path":errorPath                                        //自定义属性，错误日志的根目录
        },
        //响应日志
        {
            "category": "resLogger",
            "type": "dateFile",
            "filename": resLogPath,
            "alwaysIncludePattern": true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path":resPath
        }
    ],
    "levels": {                                                     //设置logger名称对应的的日志等级
        "errorLogger": "ERROR",
        "resLogger": "ALL"
    },
    baseLogPath: baseLogPath                                        //日志根目录
};