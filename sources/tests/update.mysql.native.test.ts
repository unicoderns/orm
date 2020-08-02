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
import { ORMModelQuery } from '..'

let usersTable: users.Users

beforeAll((done) => {
    usersTable = new users.Users({
        debug: false,
        engine: Engines.MySQL,
        driver: Drivers.Native,
    })
    done()
})

describe('MYSQL', () => {
    describe('Update', () => {
        it('Fails if where is an object', () => {
            try {
                usersTable.update({
                    data: {
                        firstName: 'Chriss',
                    },
                    where: {},
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Fails if where is an array', () => {
            try {
                usersTable.update({
                    data: {
                        firstName: 'Chriss',
                    },
                    where: [],
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Fails if data is empty', () => {
            try {
                usersTable.update({
                    data: {},
                    where: '*',
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('1 field 1 where', () => {
            const expected = {
                sql: 'UPDATE `users` SET `users`.`firstName` = ? WHERE `users`.`id` = ?;',
                values: ['Chriss', 3],
            }

            usersTable
                .update({
                    data: {
                        firstName: 'Chriss',
                    },
                    where: { id: 3 },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        // Special sql functions

        it('1 field 1 where spacial now() function', () => {
            const expected = {
                sql: 'UPDATE `users` SET `users`.`created` = now() WHERE `users`.`id` = ?;',
                values: [3],
            }

            usersTable
                .update({
                    data: {
                        created: 'now()',
                    },
                    where: { id: 3 },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })
})
