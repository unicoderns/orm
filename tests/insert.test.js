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
describe('Insert', () => {
    it('1 value', () => {
        var expected = {
            sql: 'INSERT INTO `users` (`user`) VALUES (?);',
            values: ["Chriss Mejía"]
        };
        usersTable.returnQuery().insert({
            user: "Chriss Mejía"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('2 values', () => {
        var expected = {
            sql: 'INSERT INTO `users` (`user`, `username`) VALUES (?, ?);',
            values: ["Chriss Mejía", "chriss"]
        };
        usersTable.returnQuery().insert({
            user: "Chriss Mejía",
            username: "chriss"
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=insert.test.js.map