# Models

Composed in their highest level mostly of an interface and a class

## Interface

Used by typescript to know what parameters and types to expect from a row object, [fields](05-fields/01-index.md) like id and created are always optional due to they are autogenerated therefore when you save an object from this kind they should not exists yet.

### Example

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
}
```

## Class

Contain the [fields](05-fields/01-index.md) and stored functions for a specific model.
Inherits [functions](03-functions.md) like get, update and delete from the abstract model.

### Example

```typescript
export class Users extends Model {

    @field()
    public id = new Datatypes().ID();

    @field()
    public created = new Datatypes().TIMESTAMP({
        notNull: true,
        default: Defaults.Timestamp.CURRENT_TIMESTAMP
    });

    @field()
    public username = new Datatypes().VARCHAR({
        size: 45,
        unique: true
    });

    @field()
    public email = new Datatypes().VARCHAR({
        notNull: true,
        size: 45,
        unique: true
    });

    @secret()
    public password = new Datatypes().CHAR({
        notNull: true,
        size: 60
    });

    @secret("added_salt")
    public salt = new Datatypes().VARCHAR({
        notNull: true,
        size: 20
    });

    @field("first_name")
    public firstName = new Datatypes().VARCHAR({
        size: 45
    });

    @field("last_name")
    public lastName = new Datatypes().VARCHAR({
        size: 45
    });
}
```

### Unsafe mode

[Secret fields](05-fields/01-index.md#Secret) are protected system wide, they will be returned **ONLY** if the model you query is on *unsafe mode*, this will prevent leak of sensitive information by mistake even if that field is added later on the development process.

```typescript
import * as users from './dummy/usersModel';

usersUnsafeTable = new users.Users(db, "unsafe");

usersUnsafeTable.returnQuery().getAll({
    fields: []
}).then((query: Models.Query) => {
    expect(query).toEqual(expected);
}).catch((err: any) => {
    console.error(err)
});
```