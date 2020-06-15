# Unicoderns ORM
### Unicoderns Object/Relational Mapping

![](https://unicoderns.com/img/logoorm.e1a28eb9.svg)

[![Travis](https://travis-ci.org/unicoderns/ORM.svg?branch=master)](https://travis-ci.org/unicoderns/ORM)
[![Dependencies](https://david-dm.org/unicoderns/ORM.svg)](https://david-dm.org/unicoderns/ORM/)
[![Dev Dependencies](https://david-dm.org/unicoderns/ORM/dev-status.svg)](https://david-dm.org/unicoderns/ORM/)

This is a typescript light layer package that allows you to manage and do queries to the DB in an easier way, even without SQL knowledge.

Docs available at [unicoderns.com](http://unicoderns.com/docs/ORM/) `Work in progress`

## Table of Contents

* [Quick Start](#quick-start)
* [Bugs and features](#bugs-and-features)
* [Do you want to contribute?](#do-you-want-to-contribute)
* [Creators](#creators)
* [Community](#community)
* [Copyright and license](#copyright-and-license)

## Quick Start
1. First, create a connection model as in the following example:
```typescript
import * as users from './dummy/usersModel'
import { Config, Engines, Drivers } from '@unicoderns/orm'

let usersTable: users.Users
    usersTable = new users.Users({
        debug: false,
        engine: Engines.MySQL,
        driver: Drivers.Native,
    })
```
2. Use the queries available.
* [Select](#select)
* [Insert](#insert)
* [Update](#update)
* [Delete](#delete)
* [Operators](#operators)
* [Joins](#joins)
* [Special Values](#special-values)
* [Advanced queries](#advanced)
* [Literal Strings](#literal-strings)

##  Queries Available
1. ### Select
#### Get

When you use this funtion you will get 1 matching row

```typescript
usersTable.get({}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;'
```

##### Params
`fields` 
* If is NOT set `*` will be used
* If there's a string then it will be used as is
* If an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
* Array of [Key/Operator/Value](#operators) objects will generate a multiple filters separated by an "OR".
* Mixed Array of Key/Value and Key/Operator/Value objects will generate a multiple filters separated by an "OR".


`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"


#### Get Some

Whe you use this function you will get a limited number of matching rows. This happens beacuse you should pass the limit of rows you need.

```typescript
usersTable.getSome({
    limit: 3
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;'
```

##### Params

`fields` 
* If is NOT set `*` will be used
* If there's a string then it will be used as is
* If an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
* Array of [Key/Operator/Value](#operators) objects will generate a multiple filters separated by an "OR".
* Mixed Array of Key/Value and Key/Operator/Value objects will generate a multiple filters separated by an "OR".

`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"

`limit` Number of rows to retrieve

### Get All

When you use this function you will get all matching rows, based on the filter you pass

```typescript
usersTable.getAll({
    where: {
        id: 3
    }
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = 3;'
```

#### Params
`fields` 
* If is NOT set `*` will be used
* If there's a string then it will be used as is
* If in the other hand an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
* Array of [Key/Operator/Value](#operators) objects will generate a multiple filters separated by an "OR".
* Mixed Array of Key/Value and Key/Operator/Value objects will generate a multiple filters separated by an "OR".

`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"

2. ### Insert

This function will let you insert information into the Database

```typescript
usersTable.insert({
    firstName: "Chriss"
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'INSERT INTO `users` (`firstName`) VALUES (?);'
```

#### Params
Expecting object to be inserted into the table

3. ### Update

```typescript
usersTable.update({
    data: {
        firstName: "Chriss"
    },
    where: { id: 3 }
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'UPDATE `users` SET `firstName` = "Chriss" WHERE `users`.`id` = 3;'
```

#### Params ####
`data` object data to be update in the table.

`where`
* `*` string wildcard is required for security reasons if you want to match all rows
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
* Array of [Key/Operator/Value](#operators) objects will generate a multiple filters separated by an "OR".
* Mixed Array of Key/Value and Key/Operator/Value objects will generate a multiple filters separated by an "OR".


4. ### Delete

This function will let you delete information from the Database

```typescript
usersTable.delete({ 
    id: 1 
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'DELETE FROM `users` WHERE `users`.`id` = 1;'
```

#### Params ####

Expecting:

* `*` string wildcard is required for security reasons if you want to match all rows
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
* Array of [Key/Operator/Value](#operators) objects will generate a multiple filters separated by an "OR".
* Mixed Array of Key/Value and Key/Operator/Value objects will generate a multiple filters separated by an "OR".

5. ### Operators
You can change your where condition operator from the default `=` to any operator that you want, as `!=` or `<` following this format:

```typescript
 usersTable.returnQuery().getAll({
    where: [
        { id: 3 },
        {
            created: {
                operator: ">=",
                value: "now()"
            }
        }
    ]
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`created` >= now());'
```

6. ## Join
Please notice:
* Fields from the joined table will not be validated (coming soon).
* You can't assign 1 column value to a joined column value yet (coming soon).

### GetAll

```typescript
sessionsTable.join([{
    keyField: sessionsTable.user,
    fields: ["username", "email", "firstName", "lastName"],
    kind: "LEFT"
}]).getAll({
    where: {
        "users__id": 3
    }
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query executed: 
```sql
SELECT `sessions`.`id`, `sessions`.`created`, `sessions`.`ip`, `sessions`.`user`, `users`.`username` AS `users__username`, `users`.`email` AS `users__email`, `users`.`firstName` AS `users__firstName`, `users`.`lastName` AS `users__lastName` FROM `sessions` LEFT JOIN `users` ON `sessions`.`user` = `users`.`id` WHERE `users`.`id` = 3;
```

#### Params ####
`keyField` Model foreign key.

`fields` String array with names of fields to join.

`kind` Type of Join to apply E.g.: INNER, LEFT.

### Update

```typescript
sessionsTable.join([{
    keyField: sessionsTable.user,
    kind: "INNER"
}]).update({
    data: {
        ip: "121.0.0.1"
    },
    where: {
        "users__id": 3
    }
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
UPDATE `sessions` INNER JOIN `users` ON `sessions`.`user` = `users`.`id` SET `ip` = "121.0.0.1" WHERE `users`.`id` = 3;
```

#### Params ####
`keyField` Model foreign key.

`kind` Type of Join to apply E.g.: INNER, LEFT.

### Update with columns as reference

```typescript
sessionsTable.join([{
    keyField: usersTwoTable.user,
    fields: ["username"],
    kind: "INNER"
}]).update({
    data: {
        username: "users__username"
    },
    where: "*"
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
UPDATE `usersTwo` INNER JOIN `users` ON `usersTwo`.`user` = `users`.`id` SET `usersTwo`.`username` = `users`.`username`;
```

#### Params ####
`keyField` Model foreign key.

`kind` Type of Join to apply E.g.: INNER, LEFT.

### Delete

```typescript
sessionsTable.join([{
    keyField: sessionsTable.user,
    kind: "INNER"
}]).delete({
    "users__id": 3
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
DELETE FROM `sessions` INNER JOIN `users` ON `sessions`.`user` = `users`.`id` WHERE `users`.`id` = 3;
```

#### Params ####
`keyField` Model foreign key.

`kind` Type of Join to apply E.g.: INNER, LEFT.


### Delete on joined condition

```typescript
sessionsTable.join([{
    keyField: usersTwoTable.user,
    fields: ["username"],
    kind: "INNER"
}]).delete({
    username: "users__username"
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query executed: 
```sql
DELETE FROM `usersTwo` INNER JOIN `users` ON `usersTwo`.`user` = `users`.`id` WHERE `usersTwo`.`username` = `users`.`username`;
```

#### Params ####
`keyField` Model foreign key.

`kind` Type of Join to apply E.g.: INNER, LEFT.

## Special values
Supported out the box mysql functions as where and set values.

* `now()` Insert a mysql now() function.

## Advanced

### Literal strings
You can send an unprepared strings as values in Wheres adding a double `\\` at the start of the value:

```typescript
sessionsTable.getAll({
    where: [
        { id: 3 },
        { username: "\\'chriss'" }
    ]
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
})
```

Query *prepared*: 
```sql
SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = 'chriss');
```

This can be helpful in some scenarios but is **not recomended**, only use it if you know what are you doing and **never**, send a parameter unprepared, you will expose your system to sql injection.

## Bugs and Features

Do you have a bug or a feature request?  Please first check if the issue you found hasn´t been solved yet [here](https://github.com/unicoderns/orm/issues). If you want to open a bug or request a new feature, please refer to our [contributing guidelines](https://github.com/isaZuGo/orm/blob/update-documentation/CONTRIBUTING.md) and open your request [here](https://github.com/unicoderns/orm/issues).

## Do you want to contribute? 
 If you want to be part of this amazing project, please read through our [contributing guidelines](https://github.com/isaZuGo/orm/blob/update-documentation/CONTRIBUTING.md) to know the process you should follow. The community will be glad to receive your contribution.

## Community
Stay in touch with all members of the community and get updates about ORM's development. Follow us [on twitter](https://twitter.com/unicoderns).

 ## Copyright and license

 Code and documentation Copyright 2018–2020 to Contributors and Unicoderns S.A. Code released under the MIT License.


