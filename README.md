# Unicoderns ORM
### Unicoderns Object/Relational Mapping

Premise based typescript light layer package that allow you to query the DB in a easier way, without SQL knolodge.

[![Travis](https://travis-ci.org/unicoderns/ORM.svg?branch=master)](https://travis-ci.org/unicoderns/ORM)
[![Dependencies](https://david-dm.org/unicoderns/ORM.svg)](https://david-dm.org/unicoderns/ORM/)
[![Dev Dependencies](https://david-dm.org/unicoderns/ORM/dev-status.svg)](https://david-dm.org/unicoderns/ORM/)

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
```

## Select
### Get

Get 1 matching row

```typescript
usersTable.get({}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query result: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;'
```

### Get Some

Get a limited number of matching rows

```typescript
usersTable.getSome({
    limit: 3
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query result: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;'
```

### Get All

Get all matching rows

```typescript
usersTable..getAll({
    where: {
        id: 3
    }
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query result: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = 3;'
```
