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
import { Models } from "../interfaces/db/models"

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

describe('Get general', () => {
    it('Simple with empty fields array', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: []
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple unsafe', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active`, `users`.`password`, `users`.`added_salt` FROM `users`;',
            values: []
        };
        usersUnsafeTable.returnQuery().getAll({
            fields: []
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });    
});


describe('Get all', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            where: {
                id: 3
            }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });


    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

});

describe('Get Some', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            limit: 3
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('Simple without limit', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getSome({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            where: {
                id: 3
            },
            limit: 3
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });


    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            limit: 3
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            where: {
                id: 3
            },
            limit: 3
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

});

describe('Get one', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({}).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            where: {
                id: 3
            }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });


    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"]
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query: Models.Query) => {
            expect(query).toEqual(expected);
        }).catch((err: any) => {
            console.error(err)
        });
    });

});
