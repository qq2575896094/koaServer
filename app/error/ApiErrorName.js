/**
 * Created by qq2575896094 on 2017/5/12.
 *
 * 封装API异常信息
 */

let ApiErrorName = {};

ApiErrorName.UNKNOW_ERROR = "unknowError";

ApiErrorName.USER_NOT_EXIST = "userNotExist";

/**
 * API错误名称对应的错误信息
 */

const errorMap = new Map();

errorMap.set(ApiErrorName.UNKNOW_ERROR, {code: -1, message: '未知错误'});
errorMap.set(ApiErrorName.USER_NOT_EXIST, {code: 101, message: '用户不存在'});

/**
 * 根据错误名称获取错误信息
 */

ApiErrorName.getErrorInfo = (error_name) => {
    let error_info;
    if (error_name)
        error_info = errorMap.get(error_name);

    //如果没有对应的错误信息,默认'未知错误'
    if (!error_info) {
        error_name = this.UNKNOW_ERROR;
        error_info = errorMap.get(error_name);
    }

    return error_info;
};

module.exports = ApiErrorName;