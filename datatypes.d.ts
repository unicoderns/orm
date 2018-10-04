import { Fields } from "./interfaces/db/fields";
import { Types } from "./interfaces/db/types";
import { Model } from "./model";
/**
 * JSloth DB Datatypes
 */
export declare class Datatypes {
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
    TINYINT(settings?: Types.General): Fields.CommonTypes;
    SMALLINT(settings?: Types.General): Fields.CommonTypes;
    INT(settings?: Types.General): Fields.CommonTypes;
    ID(settings?: Types.General): Fields.CommonTypes;
    /**
     * Define a foreign key
     *
     * @param name Name of the db field.
     * @param model Db Model to link.
     * @param settings Field settings.
     */
    FOREIGNKEY(localField: string, linkedField: string, model: Model, settings?: Types.General): Fields.ForeignKey;
    STATICKEY(keys: any, settings?: Types.General): Fields.StaticKey;
    FLOAT(settings?: Types.General): Fields.FloatType;
    DOUBLE(settings?: Types.General): Fields.FloatType;
    DECIMAL(settings?: Types.General): Fields.FloatType;
    CHAR(settings?: Types.General): Fields.VarCharType;
    VARCHAR(settings?: Types.General): Fields.VarCharType;
    TINYTEXT(settings?: Types.General): Fields.VarCharType;
    TEXT(settings?: Types.General): Fields.CommonTypes;
    LONGTEXT(settings?: Types.General): Fields.CommonTypes;
    BOOL(settings?: Types.Bool): Fields.BoolType;
    YEAR(settings?: Types.Timestamp): Fields.DataTimestampType;
    DATE(settings?: Types.Timestamp): Fields.DataTimestampType;
    TIME(settings?: Types.Timestamp): Fields.DataTimestampType;
    DATETIME(settings?: Types.Timestamp): Fields.DataTimestampType;
    TIMESTAMP(settings?: Types.Timestamp): Fields.DataTimestampType;
}
