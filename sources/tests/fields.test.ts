////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import * as users from './dummy/usersModel';

import { DB } from "../connection"


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

let usersTable: users.Users;
let usersUnsafeTable: users.Users;

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
        expect(usersTable.getFields()).toEqual(map);
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
        expect(usersUnsafeTable.getFields()).toEqual(map);
    });

});
