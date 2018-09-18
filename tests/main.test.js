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
tests();
/**
 * Tests
 */
function tests() {
    describe('General', () => {
        it('Test Model should be a safe model', () => {
            expect(testTable.unsafe).to.be.false;
        });
    });
    describe('Fields', () => {
        it('Test Model to have fields', () => {
            expect(testTable.getFields()).to.exist;
        });
        it('Test Model returns correct map', () => {
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
    });
}
//# sourceMappingURL=main.test.js.map