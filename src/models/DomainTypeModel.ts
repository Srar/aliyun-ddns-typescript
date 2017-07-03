import { DnsServerTypeModel } from "./DnsServerTypeModel";

export interface DomainTypeModel {
    DomainId: string,
    DomainName: string,
    AliDomain: boolean,
    GroupId: string,
    InstanceId: string,
    VersionCode: string,
    PunyCode: string,
    DnsServers: {
        DnsServer: Array<DnsServerTypeModel>
    }
}