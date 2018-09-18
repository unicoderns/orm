import * as chai from 'chai';
import * as test from './dummy/testModel';

import { DB } from "../connection"

const expect = chai.expect;

/**
 * Starting mock system
 */
let db = new DB({
    dev: true, connection:
    {
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
            let map: Map<string, string> = new Map([
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
