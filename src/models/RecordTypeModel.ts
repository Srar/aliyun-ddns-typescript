
export interface RecordTypeModel {
    DomainName: string,
    RecordId: string,
    RR: string,
    Type: "A" | "MX" | "CNAME",
    Value: string,
    TTL: number,
    Priority: number,
    Line: string,
    Status: "Enable" | "Disable",
    Locked: boolean,
    Weight: number
}