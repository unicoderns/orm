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
export declare class Users extends Model {
    id: import("../..").Fields.CommonTypes;
    created: import("../..").Fields.DataTimestampType;
    username: import("../..").Fields.VarCharType;
    email: import("../..").Fields.VarCharType;
    password: import("../..").Fields.VarCharType;
    salt: import("../..").Fields.VarCharType;
    firstName: import("../..").Fields.VarCharType;
    lastName: import("../..").Fields.VarCharType;
    admin: import("../..").Fields.BoolType;
    verified: import("../..").Fields.BoolType;
    active: import("../..").Fields.BoolType;
}
