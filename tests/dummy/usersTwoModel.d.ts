import { Model } from "../../model";
export interface Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
}
/**
 * User Model
 */
export declare class UsersTwo extends Model {
    id: import("../..").Fields.CommonTypes;
    created: import("../..").Fields.DataTimestampType;
    username: import("../..").Fields.VarCharType;
    user: import("../..").Fields.ForeignKey;
}
