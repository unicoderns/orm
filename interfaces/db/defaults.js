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
var Defaults;
(function (Defaults) {
    let Timestamp;
    (function (Timestamp) {
        Timestamp[Timestamp["NULL"] = 0] = "NULL";
        Timestamp[Timestamp["ZERO"] = 1] = "ZERO";
        Timestamp[Timestamp["CURRENT_TIMESTAMP"] = 2] = "CURRENT_TIMESTAMP";
        Timestamp[Timestamp["NULL ON UPDATE CURRENT_TIMESTAMP"] = 3] = "NULL ON UPDATE CURRENT_TIMESTAMP";
        Timestamp[Timestamp["CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"] = 4] = "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";
    })(Timestamp = Defaults.Timestamp || (Defaults.Timestamp = {}));
    let Binary;
    (function (Binary) {
        Binary[Binary["FALSE"] = 0] = "FALSE";
        Binary[Binary["TRUE"] = 1] = "TRUE";
    })(Binary = Defaults.Binary || (Defaults.Binary = {}));
})(Defaults = exports.Defaults || (exports.Defaults = {}));
//# sourceMappingURL=defaults.js.map