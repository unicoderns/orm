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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const users = __importStar(require("./dummy/usersModel"));
const connection_1 = require("../connection");
/**
 * Starting mock system
 */
let db = new connection_1.DB({
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
let usersTable;
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple delete with empty where object should fail', () => {
        var expected = {
            sql: 'DELETE FROM `users`ERROR;',
            values: []
        };
        usersTable.returnQuery().delete({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with where string different than "*" should fail', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`ERROR;',
            values: []
        };
        usersTable.returnQuery().getAll({
            where: "hello"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with multiple OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = ?) OR (`users`.`email` = ?);',
            values: [3, "chriss", "chriss@unicoderns.com"]
        };
        usersTable.returnQuery().getAll({
            where: [{ id: 3 }, { username: "chriss" }, { email: "chriss@unicoderns.com" }]
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with groupBy', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` GROUP BY username, active;',
            values: []
        };
        usersTable.returnQuery().getAll({
            groupBy: "username, active"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with orderBy', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` ORDER BY id ASC;',
            values: []
        };
        usersTable.returnQuery().getAll({
            orderBy: "id ASC"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=where.test.js.map