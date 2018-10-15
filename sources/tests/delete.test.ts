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
    connection:
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

let usersTable: users.Users;

beforeAll(done => {
    usersTable = new users.Users(db);
    done();
});

describe('Delete', () => {
    it('Delete all', () => {
        var expected = {
            sql: 'DELETE FROM `users`;',
            values: []
        };
        usersTable.returnQuery().delete("*").then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Delete with 1 condition', () => {
        var expected = {
            sql: 'DELETE FROM `users` WHERE `users`.`id` = ?;',
            values: [1]
        };
        usersTable.returnQuery().delete({ id: 1 }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('DELETE FROM `users` WHERE `users`.`user` = ? AND `users`.`id` = ?;', () => {
        var expected = {
            sql: 'DELETE FROM `users` WHERE `users`.`username` = ? AND `users`.`id` = ?;',
            values: ["chriss", 3]
        };
        usersTable.returnQuery().delete({ username: "chriss", id: 3 }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

});
