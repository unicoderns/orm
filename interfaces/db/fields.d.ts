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
    }
    /*** Datatype interface. */
    interface DataType extends CommonTypes {
        size?: number;
    }
    interface VarCharType extends CommonTypes {
        size: number;
    }
    interface FloatType extends CommonTypes {
        size?: number;
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
    interface ForeignKey extends DataType {
        localField: string;
        linkedField: string;
        model: Model;
    }
    /**
     * Foreign key to static enum model
     */
    interface StaticKey extends DataType {
        keys: any;
    }
}
