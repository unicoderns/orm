import { Fields } from "../../interfaces/db/fields";
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
    id: Fields.DataType;
    created: Fields.DataTimestampType;
    username: Fields.DataType;
    user: Fields.ForeignKey;
}
