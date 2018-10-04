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
    id: import("../../interfaces/db/fields").Fields.CommonTypes;
    created: import("../../interfaces/db/fields").Fields.DataTimestampType;
    username: import("../../interfaces/db/fields").Fields.VarCharType;
    user: import("../../interfaces/db/fields").Fields.ForeignKey;
}
