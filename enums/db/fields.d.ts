import { ORMTimestampDefault, ORMBinaryDefault } from './defaults';
import { ORMModel } from '../../model';
export declare enum ORMSupportedFields {
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
export interface ORMAllowedFields {
    [key: string]: ORMSystemFields;
}
export interface ORMSystemFields {
    type?: ORMSupportedFields;
    alias?: string;
    protected?: boolean;
    private?: boolean;
}
export interface ORMCommonFields extends ORMSystemFields {
    primaryKey?: boolean;
    notNull?: boolean;
    unique?: boolean;
    unsigned?: boolean;
    zeroFill?: boolean;
    autoincrement?: boolean;
    generated?: boolean;
    size?: number;
}
export interface ORMVarCharField extends ORMCommonFields {
    size: number;
}
export interface ORMFloatField extends ORMCommonFields {
    precision?: number;
}
export interface ORMBoolField extends ORMCommonFields {
    default: ORMBinaryDefault;
}
export interface ORMDataTimestampField extends ORMCommonFields {
    default: ORMTimestampDefault;
}
/**
 * Foreign key to model
 */
export interface ORMForeignKeyField extends ORMCommonFields {
    localField: string;
    linkedField: string;
    model: ORMModel;
}
/**
 * Foreign key to static enum model
 */
export interface ORMStaticKeyField extends ORMCommonFields {
    keys: any;
}
