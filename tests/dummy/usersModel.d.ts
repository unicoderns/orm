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
    id: import("../../interfaces/db/fields").Fields.CommonTypes;
    created: import("../../interfaces/db/fields").Fields.DataTimestampType;
    username: import("../../interfaces/db/fields").Fields.VarCharType;
    email: import("../../interfaces/db/fields").Fields.VarCharType;
    password: import("../../interfaces/db/fields").Fields.VarCharType;
    salt: import("../../interfaces/db/fields").Fields.VarCharType;
    firstName: import("../../interfaces/db/fields").Fields.VarCharType;
    lastName: import("../../interfaces/db/fields").Fields.VarCharType;
    admin: import("../../interfaces/db/fields").Fields.BoolType;
    verified: import("../../interfaces/db/fields").Fields.BoolType;
    active: import("../../interfaces/db/fields").Fields.BoolType;
}
