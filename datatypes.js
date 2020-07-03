"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORMDatatypes = void 0;
const enums_1 = require("./enums");
/**
 * JSloth DB Datatypes
 */
class ORMDatatypes {
    /**
     * Merge 2 objects
     *
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mergeTypes(commonType, customType) {
        const type = { ...commonType, ...customType };
        return type;
    }
    /**
     * Fill SQl defaults for fields
     *
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    fillDefault(settings = {}) {
        const type = {
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
        };
        return type;
    }
    /////////////////////////////////////////////////////////////////////
    // Numbers
    /////////////////////////////////////////////////////////////////////
    TINYINT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.TINYINT,
        };
        return this.mergeTypes(commonType, customType);
    }
    SMALLINT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.SMALLINT,
        };
        return this.mergeTypes(commonType, customType);
    }
    INT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.INT,
        };
        return this.mergeTypes(commonType, customType);
    }
    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    ID(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.INT,
            size: settings.size || 0,
            primaryKey: true,
            notNull: true,
            unique: true,
            unsigned: true,
            autoincrement: true,
        };
        return this.mergeTypes(commonType, customType);
    }
    /**
     * Define a foreign key
     *
     * @param name Name of the db field.
     * @param ORMModel Db ORMModel to link.
     * @param settings Field settings.
     */
    FOREIGNKEY(localField, linkedField, model, settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.INT,
            size: settings.size || 0,
            model,
            localField,
            linkedField,
        };
        return this.mergeTypes(commonType, customType);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    STATICKEY(keys, settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.INT,
            size: settings.size || 0,
            keys: keys,
        };
        return this.mergeTypes(commonType, customType);
    }
    // ------------------------------------------------------------------
    // Float Numbers
    // ------------------------------------------------------------------
    FLOAT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.FLOAT,
        };
        return this.mergeTypes(commonType, customType);
    }
    DOUBLE(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.DOUBLE,
        };
        return this.mergeTypes(commonType, customType);
    }
    DECIMAL(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.DECIMAL,
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////
    CHAR(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.CHAR,
            size: settings.size || 0,
        };
        return this.mergeTypes(commonType, customType);
    }
    VARCHAR(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.VARCHAR,
            size: settings.size || 0,
        };
        return this.mergeTypes(commonType, customType);
    }
    TINYTEXT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.TINYTEXT,
            size: settings.size || 0,
        };
        return this.mergeTypes(commonType, customType);
    }
    TEXT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.TEXT,
        };
        return this.mergeTypes(commonType, customType);
    }
    LONGTEXT(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.LONGTEXT,
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////
    BOOL(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.BOOL,
            default: settings.default || 0,
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Date/Time
    /////////////////////////////////////////////////////////////////////
    YEAR(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.YEAR,
        };
        return this.mergeTypes(commonType, customType);
    }
    DATE(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.DATE,
        };
        return this.mergeTypes(commonType, customType);
    }
    TIME(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.TIME,
        };
        return this.mergeTypes(commonType, customType);
    }
    DATETIME(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.DATETIME,
        };
        return this.mergeTypes(commonType, customType);
    }
    TIMESTAMP(settings = {}) {
        const commonType = this.fillDefault(settings);
        const customType = {
            type: enums_1.ORMSupportedFields.TIMESTAMP,
            default: settings.default || enums_1.ORMTimestampDefault['CURRENT_TIMESTAMP'],
        };
        return this.mergeTypes(commonType, customType);
    }
}
exports.ORMDatatypes = ORMDatatypes;
//# sourceMappingURL=datatypes.js.map