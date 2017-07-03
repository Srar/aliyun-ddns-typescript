import * as fs from "fs"
import * as crypto from "crypto";
import * as superagent from "superagent"

export default {

    getTime(): number {
        return Math.floor(new Date().getTime() / 1000);
    },

    getSha1HMAC(key, value): string {
        return crypto.createHmac("sha1", key).update(value).digest("base64");
    },

    getHostIP: async function (): Promise<string>  {
        var response = await this.getRequest("https://api.ipify.org?format=json");
        return response["ip"];
    },

    /* From https://github.com/yyqian/aliyun-ddns/blob/master/alidns.js */
    percentEncode: function (x) {
        return encodeURIComponent(x)
            .replace("!", "%21")
            .replace("'", "%27")
            .replace("(", "%28")
            .replace(")", "%29")
            .replace("+", "%20")
            .replace("*", "%2A")
            .replace("%7E", "~");
    },

    /* From https://github.com/yyqian/aliyun-ddns/blob/master/alidns.js */
    convertObjectToQueryString: function (publicArguments, privateArguments) {
        var args = Object.assign(publicArguments, privateArguments);
        return Object.keys(args)
            .sort()
            .map(x => this.percentEncode(x) + "=" + this.percentEncode(args[x]))
            .join("&");
    },

    readFile(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function (err, content) {
                if (err) return reject(err)
                resolve(content.toString());
            });
        });
    },

    postRequest: function (url: string, data?: any, header?: object, toJson?: boolean, returnResponse?: boolean): Promise<string | object> {
        return new Promise((resolve, reject) => {
            superagent.post(url).type('form').timeout(1000 * 10).set(header || {}).send(data || {}).end(function (err, res) {
                if (err) return reject(err);
                if (returnResponse === true) resolve(res);
                toJson === false ? resolve(res.text) : resolve(JSON.parse(res.text));
            });
        });
    },

    getRequest: function (url: string, header?: object, toJson?: boolean, returnResponse?: boolean): Promise<string | object> {
        return new Promise((resolve, reject) => {
            superagent.get(url).timeout(1000 * 10).set(header || {}).end(function (err, res) {
                if (err) return reject(err);
                if (returnResponse === true) resolve(res);
                toJson === false ? resolve(res.text) : resolve(JSON.parse(res.text));
            });
        });
    }
}
