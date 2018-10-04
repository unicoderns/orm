import { Defaults } from "./defaults";
import { Model } from "../../model";
export declare namespace Fields {
    interface SystemTypes {
        type?: string;
        alias?: string;
        protected?: boolean;
        private?: boolean;
    }
    interface CommonTypes extends SystemTypes {
        primaryKey?: boolean;
        notNull?: boolean;
        unique?: boolean;
        unsigned?: boolean;
        zeroFill?: boolean;
        autoincrement?: boolean;
        generated?: boolean;
        size?: number;
    }
    interface VarCharType extends CommonTypes {
        size: number;
    }
    interface FloatType extends CommonTypes {
        precision?: number;
    }
    interface BoolType extends CommonTypes {
        default: Defaults.Binary;
    }
    interface DataTimestampType extends CommonTypes {
        default: Defaults.Timestamp;
    }
    /**
     * Foreign key to model
     */
    interface ForeignKey extends CommonTypes {
        localField: string;
        linkedField: string;
        model: Model;
    }
    /**
     * Foreign key to static enum model
     */
    interface StaticKey extends CommonTypes {
        keys: any;
    }
}
