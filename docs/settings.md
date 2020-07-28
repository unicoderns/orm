# Settings

Library and connection settings.

1. To create the connection please follow the example below:

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

You should create the model you need, in the example above we created the model `user` and we imported it in the class we need. Please refer to [models](https://github.com/unicoderns/orm/blob/master/docs/models.md) in order to know how you can create a model.

Then, once you instance the model you should pass the required parameters to create the connection:

`debug: [true | false]`
`engine: [.MySQL | .PostgreSQL]`
`driver: [.Native | .DataAPI]`
`settings`
`connection`

```typescript
export interface Config {
  debug?: boolean
  connection?: Connection
  driver?: Drivers
  engine?: Engines
  settings?: Settings
}
```

### debug

Depends on this value you would get as many information from the debug process as you want. This parameter would be `[true | false]`. This is an optional parameter

### engine

The engines would be `[MySQL | PostgreSQL]`. This is optional parameter.

### driver

The drivers would be `[Native | DataAPI]`. This is optional parameter.

### settings

By now, our `settings` parameter allows you to get a `consistentReturn`. This parameter is optional and works currently only for DataAPI.

```typescript
export interface Settings {
  consistentReturn: boolean
}
```
