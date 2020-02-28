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
let usersUnsafeTable: users.Users

beforeAll(done => {
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

describe('MYSQL', () => {
    describe('Get general', () => {
        it('Simple with plain text', () => {
            const expected = {
                sql: 'SELECT username AS user FROM users;',
                values: [],
            }

            usersTable
                .getAll({
                    fields: 'username AS user',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
        it('Simple with empty fields array', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users;',
                values: [],
            }

            usersTable
                .getAll({
                    fields: [],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple unsafe', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active, users.password FROM users;',
                values: [],
            }

            usersUnsafeTable
                .getAll({
                    fields: [],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })

    describe('Get all', () => {
        it('Simple', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users;',
                values: [],
            }

            usersTable.getAll({}).then((query: ORMModelQuery) => {
                expect(query).toEqual(expected)
            })
        })

        it('Simple with boolean', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.active = ?;',
                values: [1],
            }

            usersTable
                .getAll({
                    where: { active: 1 },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With where', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.id = ?;',
                values: [3],
            }

            usersTable
                .getAll({
                    where: {
                        id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users;',
                values: [],
            }

            usersTable
                .getAll({
                    fields: ['created', 'email'],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields and where', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users WHERE users.id = ?;',
                values: [3],
            }

            usersTable
                .getAll({
                    fields: ['created', 'email'],
                    where: {
                        id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })

    describe('Get Some', () => {
        it('Simple', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users LIMIT 3;',
                values: [],
            }

            usersTable
                .getSome({
                    limit: 3,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple without limit', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users;',
                values: [],
            }

            usersTable.getSome({}).then((query: ORMModelQuery) => {
                expect(query).toEqual(expected)
            })
        })

        it('With where', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.id = ? LIMIT 3;',
                values: [3],
            }

            usersTable
                .getSome({
                    where: {
                        id: 3,
                    },
                    limit: 3,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users LIMIT 3;',
                values: [],
            }

            usersTable
                .getSome({
                    fields: ['created', 'email'],
                    limit: 3,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields and where', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users WHERE users.id = ? LIMIT 3;',
                values: [3],
            }

            usersTable
                .getSome({
                    fields: ['created', 'email'],
                    where: {
                        id: 3,
                    },
                    limit: 3,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })

    describe('Get one', () => {
        it('Simple', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users LIMIT 1;',
                values: [],
            }

            usersTable.get({}).then((query: ORMModelQuery) => {
                expect(query).toEqual(expected)
            })
        })

        it('With where', () => {
            const expected = {
                sql:
                    'SELECT users.id, users.created, users.username, users.email, users.firstName AS first_name, users.lastName AS last_name, users.admin, users.verified, users.active FROM users WHERE users.id = ? LIMIT 1;',
                values: [3],
            }

            usersTable
                .get({
                    where: {
                        id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users LIMIT 1;',
                values: [],
            }

            usersTable
                .get({
                    fields: ['created', 'email'],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('With fields and where', () => {
            const expected = {
                sql: 'SELECT users.created, users.email FROM users WHERE users.id = ? LIMIT 1;',
                values: [3],
            }

            usersTable
                .get({
                    fields: ['created', 'email'],
                    where: {
                        id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })
})
