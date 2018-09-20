import { Fields } from "../../interfaces/db/fields";
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
    id: Fields.DataType;
    created: Fields.DataTimestampType;
    ip: Fields.DataType;
    user: Fields.ForeignKey;
}
