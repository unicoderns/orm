import { Model } from "../../model";
export interface Row {
    id?: number;
    created?: number;
    ip: string;
    user: number;
}
/**
 * User Model
 */
export declare class Sessions extends Model {
    id: import("../../interfaces/db/fields").Fields.CommonTypes;
    created: import("../../interfaces/db/fields").Fields.DataTimestampType;
    ip: import("../../interfaces/db/fields").Fields.VarCharType;
    user: import("../../interfaces/db/fields").Fields.ForeignKey;
}
