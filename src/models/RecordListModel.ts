import { ListPublicModel } from "./ListPublicModel";
import { RecordTypeModel } from "./RecordTypeModel";

export interface RecordListModel extends ListPublicModel {
    DomainRecords: {
        Record: Array<RecordTypeModel>
    }
}