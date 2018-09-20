"use strict";
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