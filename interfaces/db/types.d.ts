import { ORMCommonFields, ORMBinaryDefault, ORMTimestampDefault } from '../../enums';
/**
 * Internal abstract types
 */
export interface ORMGeneralFieldType extends ORMCommonFields {
    size?: number;
}
export interface ORMBoolFieldType extends ORMCommonFields {
    default?: ORMBinaryDefault;
}
export interface ORMTimestampFieldType extends ORMCommonFields {
    default?: ORMTimestampDefault;
}
