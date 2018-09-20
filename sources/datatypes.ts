////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
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

import { Fields } from "./interfaces/db/fields";
import { Types } from "./interfaces/db/types";
import { Defaults } from "./interfaces/db/defaults";

import { Model } from "./model"

/**
 * JSloth DB Datatypes
 */
export class Datatypes {

    /**
     * Merge 2 objects
     * 
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    private mergeTypes(commonType: any, customType: any) {
        let type = { ...commonType, ...customType };
        return type;
    }

    /**
     * Fill SQl defaults for fields
     * 
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    private fillDefault(settings: Types.General = {}): Types.General {
        let type: Types.General = {
            primaryKey: settings.primaryKey || false,
            notNull: settings.notNull || false,
            unique: settings.unique || false,
            // binary: settings.binary || false,
            unsigned: settings.unsigned || false,
            zeroFill: settings.zeroFill || false,
            autoincrement: settings.autoincrement || false,
            generated: settings.generated || false,
            protected: settings.protected || false,
            private: settings.private || false
        };
        return type;
    }

    /////////////////////////////////////////////////////////////////////
    // Numbers
    /////////////////////////////////////////////////////////////////////

    public TINYINT(settings: Types.General = {}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "TINYINT"
        };
        return this.mergeTypes(commonType, customType);
    }

    public SMALLINT(settings: Types.General = {}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "SMALLINT"
        };
        return this.mergeTypes(commonType, customType);
    }

    public INT(settings: Types.General = {}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "INT"
        };
        return this.mergeTypes(commonType, customType);
    }

    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    public ID(settings: Types.General = {}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "INT",
            size: settings.size || 0,
            primaryKey: true,
            notNull: true,
            unique: true,
            unsigned: true,
            autoincrement: true
        };
        return this.mergeTypes(commonType, customType);
    }

    /**
     * Define a foreign key
     * 
     * @param name Name of the db field.
     * @param model Db Model to link.
     * @param settings Field settings.
     */
    public FOREIGNKEY(localField: string, linkedField: string, model: Model, settings: Types.General = {}): Fields.ForeignKey {
        let commonType = this.fillDefault(settings);
        let customType: Fields.ForeignKey = {
            type: "INT",
            size: settings.size || 0,
            model: model,
            localField: localField,
            linkedField: linkedField
        };
        return this.mergeTypes(commonType, customType);
    }

    public STATICKEY(keys: any, settings: Types.General = {}): Fields.StaticKey {
        let commonType = this.fillDefault(settings);
        let customType: Fields.StaticKey = {
            type: "INT",
            size: settings.size || 0,
            keys: keys
        };
        return this.mergeTypes(commonType, customType);
    }

    // ------------------------------------------------------------------
    // Float Numbers
    // ------------------------------------------------------------------
    public FLOAT(settings: Types.General = {}): Fields.FloatType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "FLOAT"
        };
        return this.mergeTypes(commonType, customType);
    }

    public DOUBLE(settings: Types.General = {}): Fields.FloatType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "DOUBLE"
        };
        return this.mergeTypes(commonType, customType);
    }

    public DECIMAL(settings: Types.General = {}): Fields.FloatType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "DECIMAL"
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////

    public CHAR(settings: Types.General = <Types.General>{}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "CHAR",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }

    public VARCHAR(settings: Types.General = <Types.General>{}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.VarCharType = {
            type: "VARCHAR",
            size: settings.size || 0
        };
        return this.mergeTypes(commonType, customType);
    }

    public TINYTEXT(settings: Types.General = <Types.General>{}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "TINYTEXT",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }

    public TEXT(settings: Types.General = <Types.General>{}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "TEXT"
        };
        return this.mergeTypes(commonType, customType);
    }

    public LONGTEXT(settings: Types.General = <Types.General>{}): Fields.DataType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "LONGTEXT",
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////

    public BOOL(settings: Types.Bool = <Types.Bool>{}): Fields.BoolType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.BoolType = {
            type: "BOOL",
            default: settings.default || 0
        };
        return this.mergeTypes(commonType, customType);
    }

    /////////////////////////////////////////////////////////////////////
    // Date/Time
    /////////////////////////////////////////////////////////////////////

    public YEAR(settings: Types.Timestamp = <Types.Timestamp>{}): Fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "YEAR"
        };
        return this.mergeTypes(commonType, customType);
    }

    public DATE(settings: Types.Timestamp = <Types.Timestamp>{}): Fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "DATE"
        };
        return this.mergeTypes(commonType, customType);
    }

    public TIME(settings: Types.Timestamp = <Types.Timestamp>{}): Fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "TIME"
        };
        return this.mergeTypes(commonType, customType);
    }

    public DATETIME(settings: Types.Timestamp = <Types.Timestamp>{}): Fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataType = {
            type: "DATETIME"
        };
        return this.mergeTypes(commonType, customType);
    }

    public TIMESTAMP(settings: Types.Timestamp = <Types.Timestamp>{}): Fields.DataTimestampType {
        let commonType = this.fillDefault(settings);
        let customType: Fields.DataTimestampType = {
            type: "TIMESTAMP",
            default: settings.default || Defaults.Timestamp["CURRENT_TIMESTAMP"]
        };
        return this.mergeTypes(commonType, customType);
    }

}