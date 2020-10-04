import { encode, decode, decodeStream, ExtensionCodec } from "@msgpack/msgpack";
import { deepStrictEqual } from "assert";

interface StreamDatum {
    stream: string
    data: Uint8Array
}

function isStreamDatum(obj: any): obj is StreamDatum {
    return (obj as StreamDatum).stream !== undefined
}

const buf = 64;
async function* createStream(data: Uint8Array): AsyncIterable<ArrayLike<number>> {
    for (let i = 0; i < data.length; i += buf) {
        yield data.slice(i, buf);
    }
}

class Context {
    bytes: Uint8Array;

    keep(bytes: Uint8Array) {
        this.bytes = bytes;
    }

    async decode(): Promise<StreamDatum | null> {
        const src = createStream(this.bytes);

        const d: StreamDatum = {
            stream: "",
            data: new Uint8Array(),
        };

        let pos = 0;
        for await (const v of decodeStream(src)) {
            switch (pos) {
                case 0:
                    if (typeof (v) == "string") {
                        d.stream = v;
                    } else {
                        return null;
                    }
                    pos++;
                    break;
                case 1:
                    if (v instanceof Uint8Array) {
                        d.data = v;
                    } else {
                        return null;
                    }
                    pos = 0;
                    break;
                default:
                    return null;
            }
        }

        return d;
    }
}

const extensionCodec = new ExtensionCodec<Context>();

extensionCodec.register({
    type: 0,
    encode: (obj: unknown, context): Uint8Array | null => {
        if (!isStreamDatum(obj)) {
            return null;
        }

        const s = encode(obj.stream);
        const d = encode(obj.data);

        const bs = new Uint8Array(s.length + d.length);
        bs.set(s);
        bs.set(d, s.length);

        return bs;
    },
    decode: (data: Uint8Array, _, ctx) => {
        ctx.keep(data);
        return null
    },
});

const d = {
    stream: "s",
    data: Uint8Array.from([0x01, 0x02])
}
console.log(d);

const context = new Context()

const encoded = encode(d, { extensionCodec, context: context });
console.log(encoded.reduce((s, d, _) => s + d.toString(16).padStart(2, '0'), ""));

decode(encoded, { extensionCodec, context });
context.decode().then(dd => {
    deepStrictEqual(d, dd)
    console.log(dd);
}).catch(console.error)
