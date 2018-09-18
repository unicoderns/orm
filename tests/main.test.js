"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = __importStar(require("chai"));
const test = __importStar(require("./dummy/testModel"));
const connection_1 = require("../connection");
const expect = chai.expect;
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
let testTable = new test.Users(db);
let testUnsafeTable = new test.Users(db, "unsafe");
tests();
/**
 * Tests
 */
function tests() {
    describe('General', () => {
        it('Model has correct table name', () => {
            expect(testTable.getTableName()).be.eql("users");
        });
        it('Safe Model should be a safe model', () => {
            expect(testTable.isSafe()).to.be.true;
        });
        it('Unsafe Model should be a unsafe model', () => {
            expect(testUnsafeTable.isSafe()).to.be.false;
        });
    });
    describe('Fields', () => {
        it('Model to have fields', () => {
            expect(testTable.getFields()).to.exist;
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
            expect(testTable.getFields()).to.eql(map);
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
            console.log(testUnsafeTable.getFields());
            expect(testUnsafeTable.getFields()).to.eql(map);
        });
    });
}
//# sourceMappingURL=main.test.js.map