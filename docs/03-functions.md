# Functions

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

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;'
```

#### Params ####
`fields` 
* If is NOT set `*` will be used
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

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;'
```

#### Params ####
`fields` 
* If is NOT set `*` will be used
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

Query executed: 
```sql
'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = 3;'
```

#### Params ####
`fields` 
* If is NOT set `*` will be used
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

Query executed: 
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

Query executed: 
```sql
'DELETE FROM `users` WHERE `users`.`id` = 1;'
```

#### Params ####

Expecting:

* `*` string wildcard is required for security reasons if you want to match all rows
* Key/Value object used to filter the query
* Array of Key/Value objects will generate a multiple filters separated by an "OR".

## Join
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
});
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
});
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
});
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
});
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
});
```

Query *prepared*: 
```sql
SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`firstName` AS `first_name`, `users`.`lastName` AS `last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE (`users`.`id` = ?) OR (`users`.`username` = 'chriss');
```

This can be helpful in some scenarios but is **not recomended**, only use it if you know what are you doing and **never**, send a parameter unprepared, you will expose your system to sql injection.
