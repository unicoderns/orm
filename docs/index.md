# Unicoderns Object/Relational Mapping

This is a typescript light layer package that allows you to manage and do queries to the DB in an easier way, even without SQL knowledge.

## First Steps

1. Install by running the following command:
   `npm install -s @unicoderns/orm`

2. Create a [model](https://github.com/unicoderns/orm/blob/master/docs/models.md).

3. Create a connection as in the following example:

```typescript
import * as users from './dummy/usersModel'
import { Engines, Drivers } from '@unicoderns/orm'

let usersTable: users.Users
usersTable = new users.Users({
  debug: false,
  engine: Engines.MySQL,
  driver: Drivers.Native,
})
```

4. Once you have the connection model you can start quering, as in the following example:

```typescript
usersTable
  .getAll({
    fields: [],
  })
  .then((data: any) => {
    console.log(data)
  })
  .catch((err: any) => {
    console.error(err)
  })
```
