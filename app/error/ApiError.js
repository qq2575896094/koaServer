/**
 * Created by qq2575896094 on 2017/5/12.
 *
 * API异常处理
 */

const ApiErrorName = require('./ApiErrorName');

class ApiError extends Error {
    //构造方法
    constructor(error_name) {
        super();
        let error_info = ApiErrorName.getErrorInfo(error_name);

        this.name = error_name;
        this.code = error_info.code;
        this.message = error_info.message;
    }
}

module.exports = ApiError;