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

let testTable: test.Users;
let testUnsafeTable: test.Users;

before(done => {
    testTable = new test.Users(db);
    testUnsafeTable = new test.Users(db, "unsafe");
    done();
});

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

    it('Unsafe Model returns correct map', () => {
        let map: Map<string, string> = new Map([
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
        expect(testUnsafeTable.getFields()).to.eql(map);
    });

});
