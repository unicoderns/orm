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
    id: import("../..").Fields.CommonTypes;
    created: import("../..").Fields.DataTimestampType;
    ip: import("../..").Fields.VarCharType;
    user: import("../..").Fields.ForeignKey;
}
