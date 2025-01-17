import { createHash, createHmac, createDecipheriv } from 'crypto';
import xmljs from 'xml-js';

const { js2xml, xml2js } = xmljs;

interface SignMethods {
    [key: string]: (data: string, secret: string) => string;
}

interface Exp {
    nonceStr: (length?: number) => string;
    toXML: (json: any) => string;
    fromXML: (str: string) => any;
    checkFields: (obj: any, requireFields: string[]) => string[];
    sign: (signMethod: string, data: any, secretKey: string) => string;
    aes256Decode: (secret: string, base64Data: string) => string;
    rsaEncrypt: (pemKey: string, data: string) => string;
    signMethods: SignMethods;
    createError: (name: string, message: string, extra?: any) => Error;
    wrapError: (err: Error, name: string, extra?: any) => Error;
}

const exp: Exp = {
    nonceStr: function (length = 32): string {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const len = chars.length;
        let nonceStr = "";
        for (let i = 0; i < length; i++) {
            nonceStr += chars.charAt(Math.floor(Math.random() * len));
        }
        return nonceStr;
    },

    toXML: function (json: any): string {
        return js2xml({ xml: json }, {
            compact: true,
            spaces: 4,
        });
    },

    fromXML: function (str: string): any {
        let result = xml2js(str, { compact: true, cdataKey: 'value' });
        function loopChildren(obj: any) {
            for (let key in obj) {
                if (obj[key].value) {
                    obj[key] = obj[key].value;
                } else if (typeof obj[key] === 'object') {
                    loopChildren(obj[key]);
                }
            }
        }
        loopChildren(result);
        return result;
    },

    checkFields: function (obj: any, requireFields: string[]): string[] {
        const missFields: string[] = [];
        for (let i = 0; i < requireFields.length; i++) {
            const field = requireFields[i];
            if (obj.hasOwnProperty(field)) {
                continue;
            }
            missFields.push(field);
        }
        return missFields;
    },

    sign: function (signMethod: string, data: any, secretKey: string): string {
        console.log(signMethod);
        console.log(data);
        console.log(secretKey);
        let qs = Object.keys(data)
            .filter(function (key) {
                return (
                    key !== "sign" &&
                    data.hasOwnProperty(key) &&
                    data[key] !== undefined &&
                    data[key] !== null &&
                    data[key] !== ""
                );
            })
            .sort()
            .map(function (key) {
                return key + "=" + data[key];
            })
            .join("&");

        qs += "&key=" + secretKey;
        return exp.signMethods[signMethod](qs, secretKey).toUpperCase();
    },

    aes256Decode: function (secret: string, base64Data: string): string {
        const key = exp.signMethods["MD5"](secret).toLowerCase();
        const decipher = createDecipheriv("aes-256-ecb", key, "");
        decipher.setAutoPadding(true);

        const decipherChunks: string[] = [];
        decipherChunks.push(decipher.update(base64Data, "base64", "utf8"));
        decipherChunks.push(decipher.final("utf8"));
        return decipherChunks.join("");
    },

    rsaEncrypt: function (pemKey: string, data: string): string {
        return '';
        // const encrypted = crypto.publicEncrypt(pemKey, Buffer.from(data));
        // return encrypted.toString("base64");
    },

    signMethods: {
        "HMAC-SHA256": function (data: string, secret: string): string {
            return createHmac("sha256", secret)
                .update(data)
                .digest("hex");
        },
        MD5: function (data: string): string {
            return createHash("md5")
                .update(data)
                .digest("hex");
        }
    },

    createError: function (name: string, message: string, extra?: any): Error {
        const err = new Error(message);
        err.name = name;
        (err as any).extra = extra;
        return err;
    },

    wrapError: function (err: Error, name: string, extra?: any): Error {
        err.name = name;
        (err as any).extra = extra;
        return err;
    }
};

export default exp;