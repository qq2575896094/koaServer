"use strict";

/**
 * Created by qq2575896094 on 2018/5/2.
 */

class Student {
    constructor(num) {
        this._num = num;
    }

    get num() {
        return this._num;
    }

    set num(num) {
        this._num = num;
    }
}

const stu = new Student(12);
console.log(stu.num);
stu.num = 15;
console.log(stu.num);