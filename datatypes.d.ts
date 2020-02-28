import { ORMCommonFields, ORMDataTimestampField, ORMForeignKeyField, ORMStaticKeyField, ORMFloatField, ORMVarCharField, ORMBoolField } from './enums';
import { ORMGeneralFieldType, ORMTimestampFieldType, ORMBoolFieldType } from './interfaces/db/types';
import { ORMModel } from '.';
/**
 * JSloth DB Datatypes
 */
export declare class ORMDatatypes {
    /**
     * Merge 2 objects
     *
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    private mergeTypes;
    /**
     * Fill SQl defaults for fields
     *
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    private fillDefault;
    TINYINT(settings?: ORMGeneralFieldType): ORMCommonFields;
    SMALLINT(settings?: ORMGeneralFieldType): ORMCommonFields;
    INT(settings?: ORMGeneralFieldType): ORMCommonFields;
    ID(settings?: ORMGeneralFieldType): ORMCommonFields;
    /**
     * Define a foreign key
     *
     * @param name Name of the db field.
     * @param ORMModel Db ORMModel to link.
     * @param settings Field settings.
     */
    FOREIGNKEY(localField: string, linkedField: string, model: ORMModel, settings?: ORMGeneralFieldType): ORMForeignKeyField;
    STATICKEY(keys: any, settings?: ORMGeneralFieldType): ORMStaticKeyField;
    FLOAT(settings?: ORMGeneralFieldType): ORMFloatField;
    DOUBLE(settings?: ORMGeneralFieldType): ORMFloatField;
    DECIMAL(settings?: ORMGeneralFieldType): ORMFloatField;
    CHAR(settings?: ORMGeneralFieldType): ORMVarCharField;
    VARCHAR(settings?: ORMGeneralFieldType): ORMVarCharField;
    TINYTEXT(settings?: ORMGeneralFieldType): ORMVarCharField;
    TEXT(settings?: ORMGeneralFieldType): ORMCommonFields;
    LONGTEXT(settings?: ORMGeneralFieldType): ORMCommonFields;
    BOOL(settings?: ORMBoolFieldType): ORMBoolField;
    YEAR(settings?: ORMTimestampFieldType): ORMDataTimestampField;
    DATE(settings?: ORMTimestampFieldType): ORMDataTimestampField;
    TIME(settings?: ORMTimestampFieldType): ORMDataTimestampField;
    DATETIME(settings?: ORMTimestampFieldType): ORMDataTimestampField;
    TIMESTAMP(settings?: ORMTimestampFieldType): ORMDataTimestampField;
}
