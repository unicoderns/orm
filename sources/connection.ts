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

import { Config } from "./interfaces/config";
import { Promise } from "es6-promise";

import { Models } from "./interfaces/db/models";
import * as mysql from "mysql";

/**
* Unicoderns DB Connection
*/
export class DB {
    protected connections: mysql.Pool;
    public config: Config;

    /**
     * Configuration methods 
     * 
     * Create a connection pool
     * 
     * @var config system configuration file
     */
    constructor(config: Config) {
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
    public query(query: Models.Query): Promise<any> {
        // Create promise
        const p: Promise<any> = new Promise(
            (resolve: (data: any) => void, reject: (err: mysql.MysqlError) => void) => {
                // Get connection
                this.connections.getConnection((err: mysql.MysqlError, connection) => {
                    if (err) { // Improve error log
                        reject(err);
                        throw err;
                    }
                    // Query Mysql
                    let mysqlQuery = connection.query(query.sql, query.values, (err: mysql.MysqlError | null, rows: any) => {
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
            }
        );
        return p;
    }
}
