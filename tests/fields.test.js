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
let usersUnsafeTable;
beforeAll(done => {
    usersTable = new users.Users(db);
    usersUnsafeTable = new users.Users(db, "unsafe");
    done();
});
describe('Fields', () => {
    it('Model to have fields', () => {
        expect(usersTable.getFields()).not.toBeNull();
    });
    it('Model returns correct map', () => {
        let map = new Map([
            ['id', 'id'],
            ['created', 'created'],
            ['username', 'username'],
            ['email', 'email'],
            ['firstName', 'first_name'],
            ['lastName', 'last_name'],
            ['admin', 'admin'],
            ['verified', 'verified'],
            ['active', 'active']
        ]);
        expect(usersTable.getFields()).toEqual(map);
    });
    it('Unsafe Model returns correct map', () => {
        let map = new Map([
            ['id', 'id'],
            ['created', 'created'],
            ['username', 'username'],
            ['email', 'email'],
            ['firstName', 'first_name'],
            ['lastName', 'last_name'],
            ['admin', 'admin'],
            ['verified', 'verified'],
            ['active', 'active'],
            ['salt', 'added_salt'],
            ['password', 'password']
        ]);
        expect(usersUnsafeTable.getFields()).toEqual(map);
    });
});
//# sourceMappingURL=fields.test.js.map