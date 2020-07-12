# Models

Models are composed of interfaces and clases

## Interface

Used by typescript to know what parameters and types expect from a row object, [fields](fields/index.md).

### Example of an interface

```typescript
export interface Row {
  id?: number;
  created?: number;
  username: string;
  email: string;
  password: string;
  salt: string;
  firstName?: string;
  lastName?: string;
  admin?: boolean;
  verified?: boolean;
  active?: boolean;
}
```

## Class

Contain the [fields](https://github.com/unicoderns/orm/blob/master/docs/fields/index.md) and stored functions for a specific model.
Inherits [functions](https://github.com/unicoderns/orm/blob/master/docs/functions.md) like get, update and delete from the abstract model.

### Examples

```typescript
import { ORMModel } from '../..';
import { ORMDatatypes } from '../../datatypes';
import { ORMTimestampDefault } from '../../enums';

// Set the types for each field

export interface Row {
  id?: number;
  created?: number;
  username: string;
  email: string;
  password: string;
  salt: string;
  firstName?: string;
  lastName?: string;
  admin?: boolean;
  verified?: boolean;
  active?: boolean;
}

/**
 * User´s model example
 * Creates the User Class Model and extends from the
 * ORMModel to inherit all its functions
 */
export class Users extends ORMModel {
  protected tableName = 'users';

  public readonly fields = {
    id: new ORMDatatypes().ID(),
    created: new ORMDatatypes().TIMESTAMP({
      notNull: true,
      default: ORMTimestampDefault.CURRENT_TIMESTAMP,
    }),
    username: new ORMDatatypes().VARCHAR({
      size: 45,
      unique: true,
    }),
    email: new ORMDatatypes().VARCHAR({
      notNull: true,
      size: 45,
      unique: true,
    }),
    firstName: new ORMDatatypes().VARCHAR({
      alias: 'first_name',
      size: 45,
    }),
    lastName: new ORMDatatypes().VARCHAR({
      alias: 'last_name',
      size: 45,
    }),
    admin: new ORMDatatypes().BOOL(),
    verified: new ORMDatatypes().BOOL(),
    active: new ORMDatatypes().BOOL(),
  };

  public readonly secured = {
    password: new ORMDatatypes().VARCHAR({
      notNull: true,
      protected: true,
      size: 60,
    }),
  };
}
```

### Unsafe mode

[Secured fields](https://github.com/unicoderns/orm/blob/master/docs/fields/index.md#Secured) are protected system wide, they will be returned **ONLY** if the model you query is on _unsafe mode_, this will prevent leak of sensitive information by mistake even if that field is added later on the development process.

```typescript
import * as users from './dummy/usersModel';

import { Engines, Drivers } from '../interfaces/config';
import { ORMModelQuery } from '..';

let usersUnsafeTable: users.Users;

usersUnsafeTable = new users.Users(
  {
    debug: false,
    engine: Engines.PostgreSQL,
    driver: Drivers.DataAPI,
  },
  'unsafe'
);

usersUnsafeTable
  .getAll({
    fields: [],
  })
  .then((query: ORMModelQuery) => {
    expect(query).toEqual(expected);
  });
```
