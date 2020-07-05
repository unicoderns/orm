/* eslint-disable @typescript-eslint/no-explicit-any */
////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns S.A. - info@unicoderns.com - unicoderns.com             //
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

import 'jasmine'

import * as users from './dummy/usersModel'

import { Engines, Drivers } from '../interfaces/config'
import { ORMAllowedFields, ORMTimestampDefault } from '../enums'
import { ORMDatatypes } from '../datatypes'

let usersTable: users.Users
let usersUnsafeTable: users.Users

beforeAll((done) => {
    usersTable = new users.Users({
        debug: false,
        engine: Engines.MySQL,
        driver: Drivers.Native,
    })
    usersUnsafeTable = new users.Users(
        {
            debug: false,
            engine: Engines.MySQL,
            driver: Drivers.Native,
        },
        'unsafe',
    )
    done()
})

describe('Fields', () => {
    it('Model to have fields', () => {
        expect(usersTable.getFields()).not.toBeNull()
    })

    it('Model returns correct fields', () => {
        const fields: ORMAllowedFields = {
            id: new ORMDatatypes().ID(),
            created: new ORMDatatypes().TIMESTAMP({
                notNull: true,
                default: ORMTimestampDefault.CURRENT_TIMESTAMP,
            }),
            username: new ORMDatatypes().VARCHAR({
                size: 45,
                unique: true,
            }),
            email: new ORMDatatypes().VARCHAR({
                notNull: true,
                size: 45,
                unique: true,
            }),
            firstName: new ORMDatatypes().VARCHAR({
                alias: 'first_name',
                size: 45,
            }),
            lastName: new ORMDatatypes().VARCHAR({
                alias: 'last_name',
                size: 45,
            }),
            admin: new ORMDatatypes().BOOL(),
            verified: new ORMDatatypes().BOOL(),
            active: new ORMDatatypes().BOOL(),
        }

        expect(usersTable.getFields()).toEqual(fields)
    })

    it('Unsafe Model returns correct fields', () => {
        const fields: ORMAllowedFields = {
            id: new ORMDatatypes().ID(),
            created: new ORMDatatypes().TIMESTAMP({
                notNull: true,
                default: ORMTimestampDefault.CURRENT_TIMESTAMP,
            }),
            username: new ORMDatatypes().VARCHAR({
                size: 45,
                unique: true,
            }),
            email: new ORMDatatypes().VARCHAR({
                notNull: true,
                size: 45,
                unique: true,
            }),
            firstName: new ORMDatatypes().VARCHAR({
                alias: 'first_name',
                size: 45,
            }),
            lastName: new ORMDatatypes().VARCHAR({
                alias: 'last_name',
                size: 45,
            }),
            admin: new ORMDatatypes().BOOL(),
            verified: new ORMDatatypes().BOOL(),
            active: new ORMDatatypes().BOOL(),
            password: new ORMDatatypes().VARCHAR({
                notNull: true,
                protected: true,
                size: 60,
            }),
        }

        expect(usersUnsafeTable.getFields()).toEqual(fields)
    })
})
