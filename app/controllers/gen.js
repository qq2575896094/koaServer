"use strict";

/**
 * Created by qq2575896094 on 2018/4/29.
 */


function* makeIterator(arr) {
    for (let i = 0; i < arr.length; i++) {
        yield arr[i];
    }
}

const gen = makeIterator([1, 2, 3]);
console.log(gen);//{}
console.log(gen.next());// { value: 1, done: false }
console.log(gen.next());// { value: 2, done: false }
console.log(gen.next());// { value: 3, done: false }
console.log(gen.next());// { value: undefined, done: true }