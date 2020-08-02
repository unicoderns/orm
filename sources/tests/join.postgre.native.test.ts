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

import * as sessions from './dummy/sessionsModel'
import * as userstwo from './dummy/usersTwoModel'

import { Engines, Drivers } from '../interfaces/config'
import { ORMModelQuery } from '..'

let sessionsTable: sessions.Sessions
let usersTwoTable: userstwo.UsersTwo

beforeAll((done) => {
    sessionsTable = new sessions.Sessions({
        debug: false,
        engine: Engines.PostgreSQL,
        driver: Drivers.Native,
    })
    usersTwoTable = new userstwo.UsersTwo({
        debug: false,
        engine: Engines.PostgreSQL,
        driver: Drivers.Native,
    })
    done()
})

describe('PostgreSQL', () => {
    describe('Joins', () => {
        it('Left join sessions with users without fields', () => {
            try {
                sessionsTable
                    .join([
                        {
                            keyField: sessionsTable.fields.user,
                            type: 'LEFT',
                        },
                    ])
                    .getAll({})
            } catch (error) {
                expect(error).toEqual(new Error('Invalid join fields.'))
            }
        })

        it('Left join sessions with users', () => {
            const expected = {
                sql:
                    'SELECT "sessions"."id", "sessions"."created", "sessions"."ip", "sessions"."user", "users"."username" AS "users__username", "users"."email" AS "users__email", "users"."firstName" AS "users__firstName", "users"."lastName" AS "users__lastName" FROM "sessions" LEFT JOIN "users" ON "sessions"."user" = "users"."id";',
                values: [],
                fields: [
                    'id',
                    'created',
                    'ip',
                    'user',
                    'users__username',
                    'users__email',
                    'users__firstName',
                    'users__lastName',
                ],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        fields: ['username', 'email', 'firstName', 'lastName'],
                        type: 'LEFT',
                    },
                ])
                .getAll({})
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Right join sessions with users', () => {
            const expected = {
                sql:
                    'SELECT "sessions"."id", "sessions"."created", "sessions"."ip", "sessions"."user", "users"."username" AS "users__username", "users"."email" AS "users__email" FROM "sessions" RIGHT JOIN "users" ON "sessions"."user" = "users"."id";',
                values: [],
                fields: ['id', 'created', 'ip', 'user', 'users__username', 'users__email'],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        fields: ['username', 'email'],
                        type: 'RIGHT',
                    },
                ])
                .getAll({})
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Left join sessions with where at users', () => {
            const expected = {
                sql:
                    'SELECT "sessions"."id", "sessions"."created", "sessions"."ip", "sessions"."user", "users"."username" AS "users__username", "users"."email" AS "users__email", "users"."firstName" AS "users__firstName", "users"."lastName" AS "users__lastName" FROM "sessions" LEFT JOIN "users" ON "sessions"."user" = "users"."id" WHERE "users"."id" = $1;',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'ip',
                    'user',
                    'users__username',
                    'users__email',
                    'users__firstName',
                    'users__lastName',
                ],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        fields: ['username', 'email', 'firstName', 'lastName'],
                        type: 'LEFT',
                    },
                ])
                .getAll({
                    where: {
                        users__id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Left join sessions with where at users and != operator', () => {
            const expected = {
                sql:
                    'SELECT "sessions"."id", "sessions"."created", "sessions"."ip", "sessions"."user", "users"."username" AS "users__username", "users"."email" AS "users__email", "users"."firstName" AS "users__firstName", "users"."lastName" AS "users__lastName" FROM "sessions" LEFT JOIN "users" ON "sessions"."user" = "users"."id" WHERE "users"."id" != $1;',
                values: [3],
                fields: [
                    'id',
                    'created',
                    'ip',
                    'user',
                    'users__username',
                    'users__email',
                    'users__firstName',
                    'users__lastName',
                ],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        fields: ['username', 'email', 'firstName', 'lastName'],
                        type: 'LEFT',
                    },
                ])
                .getAll({
                    where: {
                        users__id: {
                            operator: '!=',
                            value: 3,
                        },
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Inner join update with where at users', () => {
            const expected = {
                sql:
                    'UPDATE "sessions" INNER JOIN "users" ON "sessions"."user" = "users"."id" SET "sessions"."ip" = $1 WHERE "users"."id" = $2;',
                values: ['121.0.0.1', 3],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        type: 'INNER',
                    },
                ])
                .update({
                    data: {
                        ip: '121.0.0.1',
                    },
                    where: {
                        users__id: 3,
                    },
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('Inner join delete with where at users', () => {
            const expected = {
                sql:
                    'DELETE FROM "sessions" INNER JOIN "users" ON "sessions"."user" = "users"."id" WHERE "users"."id" = $1;',
                values: [3],
            }

            sessionsTable
                .join([
                    {
                        keyField: sessionsTable.fields.user,
                        type: 'INNER',
                    },
                ])
                .delete({
                    users__id: 3,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('INNER join delete usersTwo with literal from users', () => {
            const expected = {
                sql:
                    'DELETE FROM "usersTwo" INNER JOIN "users" ON "usersTwo"."user" = "users"."id" WHERE "usersTwo"."username" = "users"."username";',
                values: [],
            }

            usersTwoTable
                .join([
                    {
                        keyField: usersTwoTable.fields.user,
                        fields: ['username'],
                        type: 'INNER',
                    },
                ])
                .delete({
                    username: 'users__username',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('INNER join update usersTwo with literal from users', () => {
            const expected = {
                sql:
                    'UPDATE "usersTwo" INNER JOIN "users" ON "usersTwo"."user" = "users"."id" SET "usersTwo"."username" = "users"."username";',
                values: [],
            }

            usersTwoTable
                .join([
                    {
                        keyField: usersTwoTable.fields.user,
                        fields: ['username'],
                        type: 'INNER',
                    },
                ])
                .update({
                    data: {
                        username: 'users__username',
                    },
                    where: '*',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })
})
