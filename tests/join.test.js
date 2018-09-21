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
const sessions = __importStar(require("./dummy/sessionsModel"));
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
let sessionsTable;
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
        }).getAll({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
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
        }).getAll({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=join.test.js.map