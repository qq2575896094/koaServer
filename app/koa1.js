"use strict";

/**
 * Created by qq2575896094 on 2018/5/3.
 *
 * koa v.1.x版本middleware
 */

const Koa1 = require('koa');
const app = new Koa1();

function md1() {
    return function* (next) {
        this.body = '<h3>generator function first 1</h3>';
        yield next;
        this.body += '<h3>generator function last 1</h3>';
    }
}

function md2() {
    return function* (next) {
        this.body += '<h3>generator function first 2</h3>';
        yield next;
        this.body += '<h3>generator function last 2</h3>';
    }
}

function md3() {
    return function* (next) {
        this.body += '<h3>generator function first 3</h3>';
        yield next;
        this.body += '<h3>generator function last 3</h3>';
    }
}

app.use(md1());
app.use(md2());
app.use(md3());
app.listen(2345);