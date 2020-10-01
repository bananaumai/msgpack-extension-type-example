import { encode } from "@msgpack/msgpack";

const encoded: Uint8Array = encode({ foo: "bar" });
console.log(encoded);
