"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./interfaces/db/defaults");
/**
 * JSloth DB Datatypes
 */
class Datatypes {
    /**
     * Merge 2 objects
     *
     * @var commonType Object 1
     * @var customType Object 2 (will overwrite Object 1 keys)
     * @return Merged object
     */
    mergeTypes(commonType, customType) {
        let type = Object.assign({}, commonType, customType);
        return type;
    }
    /**
     * Fill SQl defaults for fields
     *
     * @var settings Object with custom settings
     * @return Object with defaults
     */
    fillDefault(settings = {}) {
        let type = {
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
    TINYINT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "TINYINT"
        };
        return this.mergeTypes(commonType, customType);
    }
    SMALLINT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "SMALLINT"
        };
        return this.mergeTypes(commonType, customType);
    }
    INT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "INT"
        };
        return this.mergeTypes(commonType, customType);
    }
    // ------------------------------------------------------------------
    // Special Numbers
    // ------------------------------------------------------------------
    ID(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
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
    FOREIGNKEY(localField, linkedField, model, settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "INT",
            size: settings.size || 0,
            model: model,
            localField: localField,
            linkedField: linkedField
        };
        return this.mergeTypes(commonType, customType);
    }
    STATICKEY(keys, settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "INT",
            size: settings.size || 0,
            keys: keys
        };
        return this.mergeTypes(commonType, customType);
    }
    // ------------------------------------------------------------------
    // Float Numbers
    // ------------------------------------------------------------------
    FLOAT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "FLOAT"
        };
        return this.mergeTypes(commonType, customType);
    }
    DOUBLE(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "DOUBLE"
        };
        return this.mergeTypes(commonType, customType);
    }
    DECIMAL(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "DECIMAL"
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Strings
    /////////////////////////////////////////////////////////////////////
    CHAR(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "CHAR",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }
    VARCHAR(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "VARCHAR",
            size: settings.size || 0
        };
        return this.mergeTypes(commonType, customType);
    }
    TINYTEXT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "TINYTEXT",
            size: settings.size
        };
        return this.mergeTypes(commonType, customType);
    }
    TEXT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "TEXT"
        };
        return this.mergeTypes(commonType, customType);
    }
    LONGTEXT(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "LONGTEXT",
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Binary
    /////////////////////////////////////////////////////////////////////
    BOOL(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "BOOL",
            default: settings.default || 0
        };
        return this.mergeTypes(commonType, customType);
    }
    /////////////////////////////////////////////////////////////////////
    // Date/Time
    /////////////////////////////////////////////////////////////////////
    YEAR(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "YEAR"
        };
        return this.mergeTypes(commonType, customType);
    }
    DATE(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "DATE"
        };
        return this.mergeTypes(commonType, customType);
    }
    TIME(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "TIME"
        };
        return this.mergeTypes(commonType, customType);
    }
    DATETIME(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "DATETIME"
        };
        return this.mergeTypes(commonType, customType);
    }
    TIMESTAMP(settings = {}) {
        let commonType = this.fillDefault(settings);
        let customType = {
            type: "TIMESTAMP",
            default: settings.default || defaults_1.Defaults.Timestamp["CURRENT_TIMESTAMP"]
        };
        return this.mergeTypes(commonType, customType);
    }
}
exports.Datatypes = Datatypes;
//# sourceMappingURL=datatypes.js.map