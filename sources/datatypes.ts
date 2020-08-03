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
import { ORMTinyIntDatatype } from './datatypes/tinyint'
import { ORMSmallIntDatatype } from './datatypes/smallint'
import { ORMIntDatatype } from './datatypes/int'
import { ORMIdDatatype } from './datatypes/id'
import { ORMForeignKeyDatatype } from './datatypes/foreignkey'
import { ORMStaticKeyDatatype } from './datatypes/statickey'
import { ORMFloatDatatype } from './datatypes/float'
import { ORMDoubleDatatype } from './datatypes/double'
import { ORMDecimalDatatype } from './datatypes/decimal'
import { ORMCharDatatype } from './datatypes/char'
import { ORMVarCharDatatype } from './datatypes/varchar'
import { ORMTinyTextDatatype } from './datatypes/tinytext'
import { ORMTextDatatype } from './datatypes/text'
import { ORMLongTextDatatype } from './datatypes/longtext'
import { ORMBoolDatatype } from './datatypes/bool'
import { ORMYearDatatype } from './datatypes/year'
import { ORMDateDatatype } from './datatypes/date'
import { ORMDatetimeDatatype } from './datatypes/datetime'
import { ORMTimeDatatype } from './datatypes/time'
import { ORMTimestampDatatype } from './datatypes/timestamp'

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
        return new ORMTinyIntDatatype(settings).getConfig()
    }

    public SMALLINT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        return new ORMSmallIntDatatype(settings).getConfig()
    }

    public INT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        return new ORMIntDatatype(settings).getConfig()
    }

    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    public ID(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        return new ORMIdDatatype(settings).getConfig()
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
        return new ORMForeignKeyDatatype(localField, linkedField, model, settings).getConfig()
    }

    public STATICKEY(keys: any, settings: ORMGeneralFieldType = {}): ORMStaticKeyField {
        return new ORMStaticKeyDatatype(keys, settings).getConfig()
    }

    // ------------------------------------------------------------------
    // Float Numbers
    // ------------------------------------------------------------------
    public FLOAT(settings: ORMGeneralFieldType = {}): ORMFloatField {
        return new ORMFloatDatatype(settings).getConfig()
    }

    public DOUBLE(settings: ORMGeneralFieldType = {}): ORMFloatField {
        return new ORMDoubleDatatype(settings).getConfig()
    }

    public DECIMAL(settings: ORMGeneralFieldType = {}): ORMFloatField {
        return new ORMDecimalDatatype(settings).getConfig()
    }

    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////

    public CHAR(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        return new ORMCharDatatype(settings).getConfig() as ORMVarCharField
    }

    public VARCHAR(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        return new ORMVarCharDatatype(settings).getConfig() as ORMVarCharField
    }

    public TINYTEXT(settings: ORMGeneralFieldType = {}): ORMVarCharField {
        return new ORMTinyTextDatatype(settings).getConfig() as ORMVarCharField
    }

    public TEXT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        return new ORMTextDatatype(settings).getConfig()
    }

    public LONGTEXT(settings: ORMGeneralFieldType = {}): ORMCommonFields {
        return new ORMLongTextDatatype(settings).getConfig()
    }

    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////

    public BOOL(settings: ORMBoolFieldType = {}): ORMBoolField {
        return new ORMBoolDatatype(settings).getConfig()
    }

    /////////////////////////////////////////////////////////////////////
    // Date/Time
    /////////////////////////////////////////////////////////////////////

    public YEAR(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        return new ORMYearDatatype(settings).getConfig()
    }

    public DATE(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        return new ORMDateDatatype(settings).getConfig()
    }

    public TIME(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        return new ORMTimeDatatype(settings).getConfig()
    }

    public DATETIME(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        return new ORMDatetimeDatatype(settings).getConfig()
    }

    public TIMESTAMP(settings: ORMTimestampFieldType = {}): ORMDataTimestampField {
        return new ORMTimestampDatatype(settings).getConfig()
    }
}
