# Unicoderns ORM
### Unicoderns Object/Relational Mapping

Premise based typescript light package that allow you to query the DB in a easier way, without SQL knowledge.

[![Travis](https://travis-ci.org/unicoderns/ORM.svg?branch=master)](https://travis-ci.org/unicoderns/ORM)
[![Dependencies](https://david-dm.org/unicoderns/ORM.svg)](https://david-dm.org/unicoderns/ORM/)
[![Dev Dependencies](https://david-dm.org/unicoderns/ORM/dev-status.svg)](https://david-dm.org/unicoderns/ORM/)

## Quick start

Code it to be plug and play, you only need to create a [model](04-models.md), provide the [settings](02-settings.md) and [start quering](03-functions.md).

```typescript
import * as users from './dummy/usersModel';
import { DB } from "@unicoderns/orm/connection"

let db = new DB({
    dev: true,
    connection: {
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

let usersTable: users.Users = new users.Users(db);

usersTable.get({}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```