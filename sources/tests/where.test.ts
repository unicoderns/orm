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

describe('Get general', () => {
    it('Simple with empty where array should fail', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`ERROR;',
            values: []
        };
        usersTable.returnQuery().getAll({
            where: []
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple update with empty where object should fail', () => {
        var expected = {
            sql: 'UPDATE `users` SET `username` = ?ERROR;',
            values: ["chriss"]
        };
        usersTable.returnQuery().update({
            data: {
                username: "chriss"
            },
            where: {}
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple delete with empty where object should fail', () => {
        var expected = {
            sql: 'DELETE FROM `users`ERROR;',
            values: []
        };
        usersTable.returnQuery().delete({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with where string different than "*" should fail', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`ERROR;',
            values: []
        };
        usersTable.returnQuery().getAll({
            where: "hello"
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });    

    it('Simple with OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = ?);',
            values: [3, "chriss"]
        };
        usersTable.returnQuery().getAll({
            where: [
                { id: 3 },
                { username: "chriss" }
            ]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with string literal', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = \'chriss\');',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            where: [
                { id: 3 },
                { username: "\\'chriss'" }
            ]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Multiple fields with OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ? AND `users`.`email` = ?) OR (`users`.`username` = ?);',
            values: [3, "chriss@unicoderns.com", "chriss"]
        };
        usersTable.returnQuery().getAll({
            where: [
                { id: 3, email: "chriss@unicoderns.com" },
                { username: "chriss" }
            ]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with multiple OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = ?) OR (`users`.`email` = ?);',
            values: [3, "chriss", "chriss@unicoderns.com"]
        };
        usersTable.returnQuery().getAll({
            where: [{ id: 3 }, { username: "chriss" }, { email: "chriss@unicoderns.com" }]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with groupBy', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` GROUP BY username, active;',
            values: []
        };
        usersTable.returnQuery().getAll({
            groupBy: "username, active"
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with orderBy', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` ORDER BY id ASC;',
            values: []
        };
        usersTable.returnQuery().getAll({
            orderBy: "id ASC"
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple with orderBy and groupBy', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` GROUP BY username, active ORDER BY id ASC;',
            values: []
        };
        usersTable.returnQuery().getAll({
            orderBy: "id ASC",
            groupBy: "username, active"
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

});