# Fields

In unicoderns, fields are define as interfaces sometimes extending from other interfaces.

```typescript
export interface ORMVarCharField extends ORMCommonFields {
    size: number
}

export interface ORMFloatField extends ORMCommonFields {
    precision?: number
```

### Field

Regular field, will be returned everytime you query the model.

The allowed fields are:

```typescript
export enum ORMSupportedFields {
  'TINYINT',
  'SMALLINT',
  'BIGINT',
  'INT',
  'FLOAT',
  'REAL',
  'DOUBLE',
  'DECIMAL',
  'CHAR',
  'VARCHAR',
  'TINYTEXT',
  'TEXT',
  'LONGTEXT',
  'BOOL',
  'YEAR',
  'DATE',
  'TIME',
  'DATETIME',
  'TIMESTAMP',
  'BLOB',
  'BINARY',
  'LONGVARBINARY',
  'VARBINARY',
}
```

### Secret

Secret field, will be returned **ONLY** if the model you query is on unsafe mode, this will prevent leak of sensitive information by mistake even if that field is added later on the development process.

## Property

Fields are always public and each name is directly related to the name of the table field.

### Settings object

Full list available [here](https://github.com/unicoderns/orm/blob/master/docs/fields/settings.md)
