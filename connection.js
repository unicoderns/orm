"use strict";
////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Chriss Mejía - me@chrissmejia.com - chrissmejia.com                //
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const es6_promise_1 = require("es6-promise");
const mysql = __importStar(require("mysql"));
/**
* Unicoderns DB Connection
*/
class DB {
    /**
     * Configuration methods
     *
     * Create a connection pool
     *
     * @var config system configuration file
     */
    constructor(config) {
        this.config = config;
        this.connections = mysql.createPool(config.connection);
    }
    /**
     * Plain query
     *
     * @var sql MySQL query
     * @var params Object (key/value) with parameters to replace in the query
     * @return Promise with query result
     */
    query(query) {
        // Create promise
        const p = new es6_promise_1.Promise((resolve, reject) => {
            // Get connection
            this.connections.getConnection((err, connection) => {
                if (err) { // Improve error log
                    reject(err);
                    throw err;
                }
                // Query Mysql
                let mysqlQuery = connection.query(query.sql, query.values, (err, rows) => {
                    connection.release();
                    if (this.config.dev) {
                        console.log("SQL Query: " + mysqlQuery.sql);
                    }
                    if (err) { // Improve error log
                        reject(err);
                        throw err;
                    }
                    // Resolve promise
                    resolve(rows);
                });
            });
        });
        return p;
    }
}
exports.DB = DB;
//# sourceMappingURL=connection.js.map