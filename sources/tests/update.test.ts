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

import * as users from './dummy/usersModel';

import { DB } from "../connection"
import { Models } from "../interfaces/db/models"


/**
 * Starting mock system
 */
let db = new DB({
    dev: true,
    connection: {
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

let usersTable: users.Users;

beforeAll(done => {
    usersTable = new users.Users(db);
    done();
});

describe('Update', () => {
    it('Fails if where is an object', () => {
        var expected = {
            sql: 'UPDATE `users` SET `users`.`firstName` = ?ERROR;',
            values: ["Chriss"]
        };
        usersTable.returnQuery().update({
            data: {
                firstName: "Chriss"
            },
            where: {}
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Fails if where is an array', () => {
        var expected = {
            sql: 'UPDATE `users` SET `users`.`firstName` = ?ERROR;',
            values: ["Chriss"]
        };
        usersTable.returnQuery().update({
            data: {
                firstName: "Chriss"
            },
            where: []
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Fails if data is empty', () => {
        var expected = {
            sql: 'UPDATE `users` SET ;',
            values: []
        };
        usersTable.returnQuery().update({
            data: {},
            where: "*"
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('1 field 1 where', () => {
        var expected = {
            sql: 'UPDATE `users` SET `users`.`firstName` = ? WHERE `users`.`id` = ?;',
            values: ["Chriss", 3]
        };
        usersTable.returnQuery().update({
            data: {
                firstName: "Chriss"
            },
            where: { id: 3 }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    // Special mysql functions

    it('1 field 1 where spacial now() function', () => {
        var expected = {
            sql: 'UPDATE `users` SET `users`.`created` = now() WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().update({
            data: {
                created: "now()"
            },
            where: { id: 3 }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });    

});