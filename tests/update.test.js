"use strict";
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
    dev: true, connection: {
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
describe('Update', () => {
    it('Fails if where is an object', () => {
        var expected = {
            sql: 'UPDATE `users` SET `user` = ? WHERE `users`.`` = ?;',
            values: ["Chriss Mejía"]
        };
        usersTable.returnQuery().update({
            data: {
                user: "Chriss Mejía"
            },
            where: {}
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Fails if where is an array', () => {
        var expected = {
            sql: 'UPDATE `users` SET `user` = ? WHERE ();',
            values: ["Chriss Mejía"]
        };
        usersTable.returnQuery().update({
            data: {
                user: "Chriss Mejía"
            },
            where: []
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('1 field 1 where', () => {
        var expected = {
            sql: 'UPDATE `users` SET `user` = ? WHERE `users`.`id` = ?;',
            values: ["Chriss Mejía", 3]
        };
        usersTable.returnQuery().update({
            data: {
                user: "Chriss Mejía"
            },
            where: { id: 3 }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=update.test.js.map