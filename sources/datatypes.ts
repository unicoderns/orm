////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns S.A. - info@unicoderns.com - unicoderns.com             //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import {
    ORMCommonFields,
    ORMDataTimestampField,
    ORMSupportedFields,
    ORMForeignKeyField,
    ORMStaticKeyField,
    ORMFloatField,
    ORMVarCharField,
    ORMBoolField,
    ORMTimestampDefault,
} from './enums'
import { ORMGeneralFieldType, ORMTimestampFieldType, ORMBoolFieldType } from './interfaces/db/types'
import { ORMModel } from '.'

/**
 * JSloth DB Datatypes
 */
export class ORMDatatypes {
    /**
     * Merge 2 objects
     *
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mergeTypes(commonType: any, customType: any): any {
        const type = { ...commonType, ...customType }

        return type
    }

    /**
     * Fill SQL defaults for fields
     *
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    private fillDefault(settings: ORMGeneralFieldType = {}): ORMGeneralFieldType {
        const type: ORMGeneralFieldType = {
            primaryKey: settings.primaryKey || false,
            notNull: settings.notNull || false,
            unique: settings.unique || false,
            // binary: settings.binary || false,
            unsigned: settings.unsigned || false,
            zeroFill: settings.zeroFill || false,
            autoincrement: settings.autoincrement || false,
            generated: settings.generated || false,
            alias: settings.alias || undefined,
            protected: settings.protected || false,
            private: settings.private || false,
        }

        return type
    }

    /////////////////////////////////////////////////////////////////////
    // Numbers
    /////////////////////////////////////////////////////////////////////

    public TINYINT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.TINYINT,
        }

        return this.mergeTypes(commonType, customType)
    }

    public SMALLINT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.SMALLINT,
        }

        return this.mergeTypes(commonType, customType)
    }

    public INT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.INT,
        }

        return this.mergeTypes(commonType, customType)
    }

    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    public ID(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.INT,
            size: settings.size || 0,
            primaryKey: true,
            notNull: true,
            unique: true,
            unsigned: true,
            autoincrement: true,
        }

        return this.mergeTypes(commonType, customType)
    }

    /**
     * Define a foreign key
     *
     * @param name Name of the db field.
     * @param ORMModel Db ORMModel to link.
     * @param settings Field settings.
     */
    public FOREIGNKEY(
        localField: string,
        linkedField: string,
        model: ORMModel,
        settings: ORMGeneralFieldType = {},
    ): ORMForeignKeyField {
        const commonType = this.fillDefault(settings)
        const customType: ORMForeignKeyField = {
            type: ORMSupportedFields.INT,
            size: settings.size || 0,
            model,
            localField,
            linkedField,
        }

        return this.mergeTypes(commonType, customType)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public STATICKEY(keys: any, settings: ORMGeneralFieldType = {}): ORMStaticKeyField {
        const commonType = this.fillDefault(settings)
        const customType: ORMStaticKeyField = {
            type: ORMSupportedFields.INT,
            size: settings.size || 0,
            keys: keys,
        }

        return this.mergeTypes(commonType, customType)
    }

    // ------------------------------------------------------------------
    // Float Numbers
    // ------------------------------------------------------------------
    public FLOAT(settings: ORMGeneralFieldType = {}): ORMFloatField {
        const commonType = this.fillDefault(settings)
        const customType: ORMFloatField = {
            type: ORMSupportedFields.FLOAT,
        }

        return this.mergeTypes(commonType, customType)
    }

    public DOUBLE(settings: ORMGeneralFieldType = {}): ORMFloatField {
        const commonType = this.fillDefault(settings)
        const customType: ORMFloatField = {
            type: ORMSupportedFields.DOUBLE,
        }

        return this.mergeTypes(commonType, customType)
    }

    public DECIMAL(settings: ORMGeneralFieldType = {}): ORMFloatField {
        const commonType = this.fillDefault(settings)
        const customType: ORMFloatField = {
            type: ORMSupportedFields.DECIMAL,
        }

        return this.mergeTypes(commonType, customType)
    }

    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////

    public CHAR(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        const commonType = this.fillDefault(settings)
        const customType: ORMVarCharField = {
            type: ORMSupportedFields.CHAR,
            size: settings.size || 0,
        }

        return this.mergeTypes(commonType, customType)
    }

    public VARCHAR(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        const commonType = this.fillDefault(settings)
        const customType: ORMVarCharField = {
            type: ORMSupportedFields.VARCHAR,
            size: settings.size || 0,
        }

        return this.mergeTypes(commonType, customType)
    }

    public TINYTEXT(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        const commonType = this.fillDefault(settings)
        const customType: ORMVarCharField = {
            type: ORMSupportedFields.TINYTEXT,
            size: settings.size || 0,
        }

        return this.mergeTypes(commonType, customType)
    }

    public TEXT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.TEXT,
        }

        return this.mergeTypes(commonType, customType)
    }

    public LONGTEXT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.LONGTEXT,
        }

        return this.mergeTypes(commonType, customType)
    }

    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////

    public BOOL(settings: ORMBoolFieldType = {}): ORMBoolField {
        const commonType = this.fillDefault(settings)
        const customType: ORMBoolField = {
            type: ORMSupportedFields.BOOL,
            default: settings.default || 0,
        }

        return this.mergeTypes(commonType, customType)
    }

    /////////////////////////////////////////////////////////////////////
    // Date/Time
    /////////////////////////////////////////////////////////////////////

    public YEAR(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.YEAR,
        }

        return this.mergeTypes(commonType, customType)
    }

    public DATE(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.DATE,
        }

        return this.mergeTypes(commonType, customType)
    }

    public TIME(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.TIME,
        }

        return this.mergeTypes(commonType, customType)
    }

    public DATETIME(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        const commonType = this.fillDefault(settings)
        const customType: ORMCommonFields = {
            type: ORMSupportedFields.DATETIME,
        }

        return this.mergeTypes(commonType, customType)
    }

    public TIMESTAMP(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        const commonType = this.fillDefault(settings)
        const customType: ORMDataTimestampField = {
            type: ORMSupportedFields.TIMESTAMP,
            default: settings.default || ORMTimestampDefault['CURRENT_TIMESTAMP'],
        }

        return this.mergeTypes(commonType, customType)
    }
}
