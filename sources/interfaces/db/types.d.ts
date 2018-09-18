import { Fields } from "./fields";
import { Defaults } from "./defaults";
/**
 * Internal abstract types
 */
export declare namespace Types {
    interface General extends Fields.CommonTypes {
        size?: number;
    }
    interface Bool extends Fields.CommonTypes {
        default?: Defaults.Binary;
    }
    interface Timestamp extends Fields.CommonTypes {
        default?: Defaults.Timestamp;
    }
}
