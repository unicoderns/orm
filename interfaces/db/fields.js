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
var Fields;
(function (Fields) {
    let Supported;
    (function (Supported) {
        Supported[Supported["TINYINT"] = 0] = "TINYINT";
        Supported[Supported["SMALLINT"] = 1] = "SMALLINT";
        Supported[Supported["BIGINT"] = 2] = "BIGINT";
        Supported[Supported["INT"] = 3] = "INT";
        Supported[Supported["FLOAT"] = 4] = "FLOAT";
        Supported[Supported["REAL"] = 5] = "REAL";
        Supported[Supported["DOUBLE"] = 6] = "DOUBLE";
        Supported[Supported["DECIMAL"] = 7] = "DECIMAL";
        Supported[Supported["CHAR"] = 8] = "CHAR";
        Supported[Supported["VARCHAR"] = 9] = "VARCHAR";
        Supported[Supported["TINYTEXT"] = 10] = "TINYTEXT";
        Supported[Supported["TEXT"] = 11] = "TEXT";
        Supported[Supported["LONGTEXT"] = 12] = "LONGTEXT";
        Supported[Supported["BOOL"] = 13] = "BOOL";
        Supported[Supported["YEAR"] = 14] = "YEAR";
        Supported[Supported["DATE"] = 15] = "DATE";
        Supported[Supported["TIME"] = 16] = "TIME";
        Supported[Supported["DATETIME"] = 17] = "DATETIME";
        Supported[Supported["TIMESTAMP"] = 18] = "TIMESTAMP";
        Supported[Supported["BLOB"] = 19] = "BLOB";
        Supported[Supported["BINARY"] = 20] = "BINARY";
        Supported[Supported["LONGVARBINARY"] = 21] = "LONGVARBINARY";
        Supported[Supported["VARBINARY"] = 22] = "VARBINARY";
    })(Supported = Fields.Supported || (Fields.Supported = {}));
})(Fields = exports.Fields || (exports.Fields = {}));
//# sourceMappingURL=fields.js.map