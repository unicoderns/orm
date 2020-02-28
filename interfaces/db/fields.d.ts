import { Defaults } from './defaults';
import { Model } from '../../model';
export declare namespace Fields {
    enum Supported {
        'TINYINT' = 0,
        'SMALLINT' = 1,
        'BIGINT' = 2,
        'INT' = 3,
        'FLOAT' = 4,
        'REAL' = 5,
        'DOUBLE' = 6,
        'DECIMAL' = 7,
        'CHAR' = 8,
        'VARCHAR' = 9,
        'TINYTEXT' = 10,
        'TEXT' = 11,
        'LONGTEXT' = 12,
        'BOOL' = 13,
        'YEAR' = 14,
        'DATE' = 15,
        'TIME' = 16,
        'DATETIME' = 17,
        'TIMESTAMP' = 18,
        'BLOB' = 19,
        'BINARY' = 20,
        'LONGVARBINARY' = 21,
        'VARBINARY' = 22
    }
    interface Allowed {
        [key: string]: SystemTypes;
    }
    interface SystemTypes {
        type?: Supported;
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
