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

beforeAll(done => {
    usersTable = new users.Users({
        debug: false,
        engine: Engines.PostgreSQL,
        driver: Drivers.DataAPI,
    })
    done()
})

describe('DataApi', () => {
    describe('Get general', () => {
        it('Simple with empty where array should fail', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM usersERROR;',
                parameters: [],
            }

            usersTable
                .getAll({
                    where: [],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple update with empty where object should fail', () => {
            const expected = {
                sql: 'UPDATE users SET users.username = :usernameERROR;',
                parameters: [{ name: 'username', value: { stringValue: 'chriss' } }],
            }

            usersTable
                .update({
                    data: {
                        username: 'chriss',
                    },
                    where: {},
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple delete with empty where object should fail', () => {
            const expected = {
                sql: 'DELETE FROM usersERROR;',
                parameters: [],
            }

            usersTable.delete({}).then((query: ORMModelQuery) => {
                expect(query).toEqual(expected)
            })
        })

        it('Simple with where string different than "*" should fail', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM usersERROR;',
                parameters: [],
            }

            usersTable
                .getAll({
                    where: 'hello',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with Boolean', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.active = :active;',
                parameters: [
                    {
                        name: 'active',
                        value: { booleanValue: true },
                    },
                ],
            }

            usersTable
                .getAll({
                    where: { active: 1 },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with OR', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.active = :active;',
                parameters: [
                    {
                        name: 'active',
                        value: { booleanValue: true },
                    },
                ],
            }

            usersTable
                .getAll({
                    where: { active: 1 },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with string literal', () => {
            const expected = {
                sql:
                    "SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id) OR (users.username = 'chriss');",
                parameters: [{ name: 'id', value: { longValue: 3 } }],
            }

            usersTable
                .getAll({
                    where: [{ id: 3 }, { username: "\\'chriss'" }],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Multiple fields with OR', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id AND users.email = :email) OR (users.username = :username);',
                parameters: [
                    { name: 'id', value: { longValue: 3 } },
                    { name: 'email', value: { stringValue: 'chriss@unicoderns.com' } },
                    { name: 'username', value: { stringValue: 'chriss' } },
                ],
            }

            usersTable
                .getAll({
                    where: [{ id: 3, email: 'chriss@unicoderns.com' }, { username: 'chriss' }],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with multiple AND', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.id = :id AND users.username = :username AND users.email = :email;',
                parameters: [
                    { name: 'id', value: { longValue: 3 } },
                    { name: 'username', value: { stringValue: 'chriss' } },
                    { name: 'email', value: { stringValue: 'chriss@unicoderns.com' } },
                ],
            }

            usersTable
                .getAll({
                    where: { id: 3, username: 'chriss', email: 'chriss@unicoderns.com' },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with multiple AND and != operator', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.id != :id AND users.username = :username AND users.email = :email;',
                parameters: [
                    { name: 'id', value: { longValue: 3 } },
                    { name: 'username', value: { stringValue: 'chriss' } },
                    { name: 'email', value: { stringValue: 'chriss@unicoderns.com' } },
                ],
            }

            usersTable
                .getAll({
                    where: { id: { operator: '!=', value: 3 }, username: 'chriss', email: 'chriss@unicoderns.com' },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with multiple OR', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id) OR (users.username = :username) OR (users.email = :email);',
                parameters: [
                    { name: 'id', value: { longValue: 3 } },
                    { name: 'username', value: { stringValue: 'chriss' } },
                    { name: 'email', value: { stringValue: 'chriss@unicoderns.com' } },
                ],
            }

            usersTable
                .getAll({
                    where: [{ id: 3 }, { username: 'chriss' }, { email: 'chriss@unicoderns.com' }],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with groupBy', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users GROUP BY username, active;',
                parameters: [],
            }

            usersTable
                .getAll({
                    groupBy: 'username, active',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with orderBy', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users ORDER BY id ASC;',
                parameters: [],
            }

            usersTable
                .getAll({
                    orderBy: 'id ASC',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with orderBy and groupBy', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users GROUP BY username, active ORDER BY id ASC;',
                parameters: [],
            }

            usersTable
                .getAll({
                    orderBy: 'id ASC',
                    groupBy: 'username, active',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with <= operator', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id <= :id);',
                parameters: [{ name: 'id', value: { longValue: 3 } }],
            }

            usersTable
                .getAll({
                    where: [
                        {
                            id: {
                                operator: '<=',
                                value: 3,
                            },
                        },
                    ],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with string literal', () => {
            const expected = {
                sql:
                    "SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id) OR (users.username != 'chriss');",
                parameters: [{ name: 'id', value: { longValue: 3 } }],
            }

            usersTable
                .getAll({
                    where: [
                        { id: 3 },
                        {
                            username: {
                                operator: '!=',
                                value: "\\'chriss'",
                            },
                        },
                    ],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        // Special sql functions
        it('Simple with now() function', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id) OR (users.created = now());',
                parameters: [{ name: 'id', value: { longValue: 3 } }],
            }

            usersTable
                .getAll({
                    where: [{ id: 3 }, { created: 'now()' }],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with now() function and != operator', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE (users.id = :id) OR (users.created >= now());',
                parameters: [{ name: 'id', value: { longValue: 3 } }],
            }

            usersTable
                .getAll({
                    where: [
                        { id: 3 },
                        {
                            created: {
                                operator: '>=',
                                value: 'now()',
                            },
                        },
                    ],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })
})
