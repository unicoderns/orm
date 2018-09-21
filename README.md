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

#### Params ####
`fields` 
* If is NOT set "*" will be used
* If there's a string then it will be used as is
* If in the other hand an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".

`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"


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

#### Params ####
`fields` 
* If is NOT set "*" will be used
* If there's a string then it will be used as is
* If in the other hand an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".

`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"

`limit` Number of rows to retrieve

### Get All

Get all matching rows

```typescript
usersTable.getAll({
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

#### Params ####
`fields` 
* If is NOT set "*" will be used
* If there's a string then it will be used as is
* If in the other hand an array is provided (Recommended), then it will filter the keys and add the table name.

`where` 
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".

`orderBy` String with column names and direction E.g.: "id, name ASC"

`groupBy` String with column names E.g.: "id, name"

## Insert

```typescript
usersTable.insert({
    firstName: "Chriss"
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query result: 
```sql
'INSERT INTO `users` (`firstName`) VALUES (?);'
```

#### Params ####
Expecting object to be inserted in the table

## Update

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
});
```

Query result: 
```sql
'UPDATE `users` SET `firstName` = "Chriss" WHERE `users`.`id` = 3;'
```

#### Params ####
`data` object data to be update in the table.

`where`
* "*" string wildcard is required for security reasons if you want to match all rows
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".

## Delete

```typescript
usersTable.delete({ 
    id: 1 
}).then((data: any) => {
    console.log(data);
}).catch((err: any) => {
    console.error(err)
});
```

Query result: 
```sql
'DELETE FROM `users` WHERE `users`.`id` = 1;'
```

#### Params ####

Expecting:

* "*" string wildcard is required for security reasons if you want to match all rows
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".
