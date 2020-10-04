"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var msgpack_1 = require("@msgpack/msgpack");
var typescript_1 = require("typescript");
function isDataPacket(obj) {
    return obj.streamName !== undefined;
}
var buf = 8;
function createStream(data) {
    return __asyncGenerator(this, arguments, function createStream_1() {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < data.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, __await(data.slice(i, buf))];
                case 2: return [4 /*yield*/, _a.sent()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i += buf;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var extensionCodec = new msgpack_1.ExtensionCodec();
var SET_EXT_TYPE = 0;
extensionCodec.register({
    type: SET_EXT_TYPE,
    encode: function (obj) {
        if (!isDataPacket(obj)) {
            return null;
        }
        var s = msgpack_1.encode(obj.streamName);
        var i = msgpack_1.encode(obj.packetIndex);
        var d = msgpack_1.encode(obj.data);
        var bs = new Uint8Array(s.length + i.length + d.length);
        bs.set(s);
        bs.set(i, s.length);
        bs.set(d, s.length + i.length);
        return bs;
    },
    decode: function (data) {
        var src = createStream(data);
        var p = (function () { return __awaiter(void 0, void 0, void 0, function () {
            var dp, pos, _a, _b, v, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        dp = {
                            streamName: "",
                            packetIndex: 0,
                            data: null
                        };
                        pos = 0;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _a = __asyncValues(msgpack_1.decodeStream(src));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _a.next()];
                    case 3:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                        v = _b.value;
                        switch (pos) {
                            case 0:
                                if (typeof (v) == "string") {
                                    dp.streamName = v;
                                }
                                else {
                                    throw new typescript_1.OperationCanceledException();
                                }
                                pos++;
                                break;
                            case 1:
                                if (typeof (v) == "number") {
                                    dp.packetIndex = v;
                                }
                                else {
                                    throw new typescript_1.OperationCanceledException();
                                }
                                pos++;
                                break;
                            case 2:
                                if (v instanceof Uint8Array) {
                                    dp.data = v;
                                }
                                else {
                                    throw new typescript_1.OperationCanceledException();
                                }
                                pos = 0;
                                break;
                            default:
                                throw new typescript_1.OperationCanceledException();
                        }
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _c.call(_a)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/, dp];
                }
            });
        }); })();
        var result;
        p.then(function (r) { return result = r; })["catch"](result = null);
        return result;
    }
});
var dp = {
    streamName: "s",
    packetIndex: 1,
    data: Uint8Array.from([0x01, 0x02])
};
console.log(dp);
var encoded = msgpack_1.encode(dp, { extensionCodec: extensionCodec });
console.log(encoded.reduce(function (s, d, _) { return s + d.toString(16).padStart(2, '0'); }, ""));
var decoded = msgpack_1.decode(encoded, { extensionCodec: extensionCodec });
console.log(decoded);
//# sourceMappingURL=index.js.map