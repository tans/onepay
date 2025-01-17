import { createHash } from 'crypto'
import { js2xml, xml2js } from 'xml-js'

let exp = {}
exp.nonceStr = function (length) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var len = chars.length;
    var nonceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        nonceStr += chars.charAt(Math.floor(Math.random() * len));
    }
    return nonceStr;
};

exp.toXML = function (json) {
    return js2xml({ xml: json }, {
        compact: true,
        spaces: 4,
    })
};


// <xml>
//     <trade_type>NATIVE</trade_type>
//     <body>onepay 支付</body>
//     <product_id>1737032668079</product_id>
//     <out_trade_no>1737032668079</out_trade_no>
//     <total_fee>2</total_fee>
//     <spbill_create_ip>127.0.0.1</spbill_create_ip>
//     <notify_url>http://localhost:4321/api/notify</notify_url>
//     <appid>wx777ac7e0eb7611e9</appid>
//     <mch_id>1464916202</mch_id>
//     <nonce_str>3vZ6ZnTsKTpnKY26sW4pppdUbKbybmzH</nonce_str>
//     <sign>37102B4491B0F79D9981E2FC62BA3FF0</sign>
// </xml>
exp.fromXML = function (str) {
    return xml2js(str, { compact: true, cdataKey: 'value' });
};

exp.checkFields = function (obj, requireFields) {
    var missFields = [];
    for (var i = 0; i < requireFields.length; i++) {
        var field = requireFields[i];
        if (obj.hasOwnProperty(field)) {
            continue;
        }
        missFields.push(field);
    }
    return missFields;
};

exp.sign = function (signMethod, data, secretKey) {
    console.log(signMethod)
    console.log(data)
    console.log(secretKey)
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
};

// 退款结果解密
exp.aes256Decode = function (secret, base64Data) {
    var key = exp.signMethods["MD5"](secret).toLowerCase();
    var decipher = crypto.createDecipheriv("aes-256-ecb", key, "");
    decipher.setAutoPadding(true);

    var decipherChunks = [];
    decipherChunks.push(decipher.update(base64Data, "base64", "utf8"));
    decipherChunks.push(decipher.final("utf8"));
    return decipherChunks.join("");
};

exp.rsaEncrypt = function (pemKey, data) {
    return ''
    // var encrypted = crypto.publicEncrypt(pemKey, buffer.Buffer.from(data));
    // return encrypted.toString("base64");
};

exp.signMethods = {
    "HMAC-SHA256": function (data, secret) {
        return crypto
            .createHmac("sha256", secret)
            .update(data)
            .digest("hex");
    },
    MD5: function (data) {
        // return createHash('md5').update(data).toString()
        return createHash("md5")
            .update(data)
            .digest("hex");
    }
};

exp.createError = function (name, message, extra) {
    var err = new Error(message);
    err.name = name;
    err.extra = extra;
    return err;
};

exp.wrapError = function (err, name, extra) {
    err.name = name;
    err.extra = extra;
    return err;
};

export default exp;