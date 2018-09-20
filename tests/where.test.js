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
describe('Get general', () => {
    it('Simple with empty where array should fail', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE ();',
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
    it('Simple with empty where object should fail', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`` = ?;',
            values: []
        };
        usersTable.returnQuery().getAll({
            where: {}
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple with OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = ?);',
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
    it('Multiple fields with OR', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ? AND `users`.`email` = ?) OR (`users`.`username` = ?);',
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
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = ?) OR (`users`.`email` = ?);',
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
});
//# sourceMappingURL=where.test.js.map