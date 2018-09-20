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

import * as sessions from './dummy/sessionsModel';

import { DB } from "../connection"
import { Models } from "../interfaces/db/models"

/**
 * Starting mock system
 */
let db = new DB({
    dev: true, connection:
    {
        "user": "apiUser",
        "password": "password",
        "database": "apiDB",
        "port": 3306,
        "host": "localhost",
        "connectionLimit": 10,
        "validations": {
            "fields": true
        }
    }
});

let sessionsTable: sessions.Sessions

beforeAll(done => {
    sessionsTable = new sessions.Sessions(db);
    done();
});

describe('Joins', () => {
    it('Left join sessions with users', () => {
        var expected = {
            sql: 'SELECT `sessions`.`id`, `sessions`.`created`, `sessions`.`ip`, `sessions`.`user`, `users`.`username` AS `users__username`, `users`.`email` AS `users__email`, `users`.`firstName` AS `users__firstName`, `users`.`lastName` AS `users__lastName` FROM `sessions` LEFT JOIN `users` ON `sessions`.`user` = `users`.`id`;',
            values: []
        };
        sessionsTable.returnQuery().join({
            keyField: sessionsTable.user,
            fields: ["username", "email", "firstName", "lastName"],
            kind: "LEFT"
        }).getAll({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Right join sessions with users', () => {
        var expected = {
            sql: 'SELECT `sessions`.`id`, `sessions`.`created`, `sessions`.`ip`, `sessions`.`user`, `users`.`username` AS `users__username`, `users`.`email` AS `users__email` FROM `sessions` RIGHT JOIN `users` ON `sessions`.`user` = `users`.`id`;',
            values: []
        };
        sessionsTable.returnQuery().join({
            keyField: sessionsTable.user,
            fields: ["username", "email"],
            kind: "RIGHT"
        }).getAll({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });
});