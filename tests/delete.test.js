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
describe('Delete', () => {
    it('Delete all', () => {
        var expected = {
            sql: 'DELETE FROM `users`;',
            values: []
        };
        usersTable.returnQuery().delete("*").then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Delete with 1 condition', () => {
        var expected = {
            sql: 'DELETE FROM `users` WHERE `users`.`id` = ?;',
            values: [1]
        };
        usersTable.returnQuery().delete({ id: 1 }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('DELETE FROM `users` WHERE `users`.`user` = ? AND `users`.`id` = ?;', () => {
        var expected = {
            sql: 'DELETE FROM `users` WHERE `users`.`username` = ? AND `users`.`id` = ?;',
            values: ["chriss", 3]
        };
        usersTable.returnQuery().delete({ username: "chriss", id: 3 }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=delete.test.js.map