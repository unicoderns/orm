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
let usersUnsafeTable;
beforeAll(done => {
    usersTable = new users.Users(db);
    usersUnsafeTable = new users.Users(db, "unsafe");
    done();
});
describe('Get general', () => {
    it('Simple with plain text', () => {
        var expected = {
            sql: 'SELECT username AS user FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: "username AS user"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with empty fields array', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: []
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple unsafe', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active`, `users`.`password`, `users`.`salt` AS `added_salt` FROM `users`;',
            values: []
        };
        usersUnsafeTable.returnQuery().getAll({
            fields: []
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get all', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"]
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get Some', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple without limit', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getSome({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            where: {
                id: 3
            },
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            where: {
                id: 3
            },
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get one', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"]
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=select.test.js.map