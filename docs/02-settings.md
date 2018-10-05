# Settings

Library and connection settings.

```typescript
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
```

## dev

Developer mode. | `boolean`

## connection

### user

Db user name. | `string`

### password

Db user password. | `string`

### database

Db name. | `string`

### port

Port where MySQL service is running, default: 3306. | `string`

### host

Host where MySQL is running. | `string`

### connectionLimit

Max concurrent connections in the pool. | `number`

### validations

#### fields ####

Validate fields to exists in the model (Only working with `SELECT [fields]` for now). | `boolean`

> Disallowed by default in production mode.
