///<reference path="../node_modules/@types/node/index.d.ts"/>

import tools from "./tools";
import { DomainListModel, DomainTypeModel, RecordListModel, RecordTypeModel } from "./models/models";

async function main() {
    if(!await tools.isFileExists("./config.json")) {
        console.error("[config.json]文件不存在, 请将[config-sample.json]文件修改完毕后重命名为[config.json]并与[app.js 或 可执行文件]保持在同一个目录下.");
        process.exit(-1);
    }

    const config: {
        AccessKeyId: string,
        AccessKeySecret: string,
        Domain: string,
        Record: string,
        CheckTimer: number
    } = JSON.parse(await tools.readFile("./config.json"));
    config.AccessKeySecret += "&"

    const aliyunApiRootUrl: string = "https://alidns.aliyuncs.com/";

    async function request(requestType: "GET" | "POST", action: string, privateArguments: any): Promise<any> {
        var publicArguments = {
            Action: action,
            Format: "json",
            Version: "2015-01-09",
            AccessKeyId: config.AccessKeyId,
            SignatureMethod: "HMAC-SHA1",
            Timestamp: new Date().toISOString(),
            SignatureVersion: "1.0",
            SignatureNonce: tools.getTime(),
        };

        var waittingSignArguments: string = tools.convertObjectToQueryString(publicArguments, privateArguments);
        var sign = tools.getSha1HMAC(config.AccessKeySecret, `${requestType}&${tools.percentEncode("/")}&${tools.percentEncode(waittingSignArguments)}`);

        if (requestType === "POST") {
            return tools.postRequest(aliyunApiRootUrl, Object.assign(
                publicArguments, privateArguments, { Signature: sign }
            ), {}, true);
        }

        return tools.getRequest(`${aliyunApiRootUrl}?${waittingSignArguments}&Signature=${tools.percentEncode(sign)}`, {}, true);
    }

    async function getDomainsListWithSearch(searchKey: string): Promise<DomainListModel> {
        var domainsList: DomainListModel = await request("GET", "DescribeDomains", {
            PageSize: 100,
            KeyWord: searchKey
        });
        return domainsList
    }

    async function getRecordsListForDomain(domain: string, searchKey: string) {
        var recordsList = await request("GET", "DescribeDomainRecords", {
            DomainName: domain,
            PageSize: 500,
            RRKeyWord: searchKey
        });
        return recordsList;
    }

    async function updateRecordValueForTypeA(record: RecordTypeModel, newValue: string) {
        if (record.Value === newValue) return;
        await request("POST", "UpdateDomainRecord", {
            RecordId: record.RecordId,
            RR: record.RR,
            Type: record.Type,
            Value: newValue,
            TTL: record.TTL
        });
    }


    async function checkLoop() {
        try {
            var hostIP: string = await tools.getHostIP();

            var domain: DomainTypeModel = null;
            var domains = await getDomainsListWithSearch(config.Domain);
            domains.Domains.Domain.map(domainInfo => {
                if (domainInfo.DomainName === config.Domain) {
                    domain = domainInfo;
                    return;
                }
            });
            if (domain === null) return console.error(`未知的[${config.Domain}]域名, 请确认.`);

            var record: RecordTypeModel = null;
            var records: RecordListModel = await getRecordsListForDomain(domain.DomainName, config.Record)
            records.DomainRecords.Record.map(recordInfo => {
                if (recordInfo.RR === config.Record) {
                    record = recordInfo
                    return;
                }
            });
            if (record === null) return console.error(`未知的[${config.Record}]记录, 请确认.`);

            if (record.Value === hostIP) return;
            await updateRecordValueForTypeA(record, hostIP);
            console.log(`[${record.RR}.${domain.DomainName}] -> ${hostIP}`);
        } catch (err) {
            if (err.status == undefined) return console.error(`网络连接错误: ${err}`);
            console.error(`服务器返回错误: ${err.status} ${err.response.res.text}`);
        }
    }

    checkLoop();
    setInterval(checkLoop, 1000 * config.CheckTimer);
}

main();