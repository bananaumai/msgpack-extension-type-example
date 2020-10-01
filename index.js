"use strict";
exports.__esModule = true;
var msgpack_1 = require("@msgpack/msgpack");
var encoded = msgpack_1.encode({ foo: "bar" });
console.log(encoded);
