import { ListPublicModel } from "./ListPublicModel";
import { DomainTypeModel } from "./DomainTypeModel";

export interface DomainListModel extends ListPublicModel {
    Domains: {
        Domain: Array<DomainTypeModel>
    }
}