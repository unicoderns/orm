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
        engine: Engines.PostgreSQL,
        driver: Drivers.Native,
    })
    done()
})

describe('PostgreSQL', () => {
    describe('Get general', () => {
        it('Simple with empty where array should fail', () => {
            try {
                usersTable.getAll({
                    where: [],
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Simple update with empty where object should fail', () => {
            try {
                usersTable.update({
                    data: {
                        username: 'chriss',
                    },
                    where: {},
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Simple delete with empty where object should fail', () => {
            try {
                usersTable.delete({})
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Simple with where string different than "*" should fail', () => {
            try {
                usersTable.getAll({
                    where: 'hello',
                })
            } catch (error) {
                expect(error).toEqual(new Error('Invalid where value.'))
            }
        })

        it('Simple with Boolean', () => {
            const expected = {
                sql:
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE "users"."active" = $1;',
                values: [true],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
            }

            usersTable
                .getAll({
                    where: { active: true },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with OR', () => {
            const expected = {
                sql:
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."username" = $2);',
                values: [3, 'chriss'],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
            }

            usersTable
                .getAll({
                    where: [{ id: 3 }, { username: 'chriss' }],
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Simple with string literal', () => {
            const expected = {
                sql:
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."username" = \'chriss\');',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1 AND "users"."email" = $2) OR ("users"."username" = $3);',
                values: [3, 'chriss@unicoderns.com', 'chriss'],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE "users"."id" = $1 AND "users"."username" = $2 AND "users"."email" = $3;',
                values: [3, 'chriss', 'chriss@unicoderns.com'],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE "users"."id" != $1 AND "users"."username" = $2 AND "users"."email" = $3;',
                values: [3, 'chriss', 'chriss@unicoderns.com'],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."username" = $2) OR ("users"."email" = $3);',
                values: [3, 'chriss', 'chriss@unicoderns.com'],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" GROUP BY username, active;',
                values: [],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" ORDER BY id ASC;',
                values: [],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" GROUP BY username, active ORDER BY id ASC;',
                values: [],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" <= $1);',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."username" != \'chriss\');',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."created" = now());',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
                    'SELECT "users"."id", "users"."created", "users"."username", "users"."email", "users"."firstName" AS "first_name", "users"."lastName" AS "last_name", "users"."admin", "users"."verified", "users"."active" FROM "users" WHERE ("users"."id" = $1) OR ("users"."created" >= now());',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'username',
                    'email',
                    'first_name',
                    'last_name',
                    'admin',
                    'verified',
                    'active',
                ],
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
