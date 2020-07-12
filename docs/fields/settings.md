# Field Settings

Each setting is prepopulated with default values, that allows you to speficy only the values to be changed.

## Numbers

### TINYINT

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: 'TINYINT';
```

### SMALLINT

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: 'SMALLINT';
```

### INT

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: 'INT';
```

### ID

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: "INT",
size: settings.size || 0,
primaryKey: true,
notNull: true,
unique: true,
unsigned: true,
autoincrement: true
```

### FOREIGNKEY

Return [Fields.ForeignKey](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#ForeignKey)

#### Custom settings

```typescript
type: "INT",
size: settings.size || 0,
model: model,
localField: localField,
linkedField: linkedField
```

### STATICKEY

Return [Fields.StaticKey](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#StaticKey)

#### Custom settings

```typescript
type: "INT",
size: settings.size || 0,
keys: keys
```

### FLOAT

Return [Fields.FloatType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#FloatType)

#### Custom settings

```typescript
type: 'FLOAT';
```

### DOUBLE

Return [Fields.FloatType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#FloatType)

#### Custom settings

```typescript
type: 'DOUBLE';
```

### DECIMAL

Return [Fields.FloatType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#FloatType)

#### Custom settings

```typescript
type: 'DECIMAL';
```

## Strings

### CHAR

Return [Fields.VarCharType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#VarCharType)

#### Custom settings

```typescript
type: "CHAR",
size: settings.size || 0
```

### VARCHAR

Return [Fields.VarCharType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#VarCharType)

#### Custom settings

```typescript
type: "VARCHAR",
size: settings.size || 0
```

### TINYTEXT

Return [Fields.VarCharType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#VarCharType)

#### Custom settings

```typescript
type: "TINYTEXT",
size: settings.size || 0
```

### TEXT

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: 'TEXT';
```

### LONGTEXT

Return [Fields.CommonTypes](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md)

#### Custom settings

```typescript
type: 'LONGTEXT';
```

## Binary

### BOOL

Return [Fields.BoolType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#BoolType)

#### Custom settings

```typescript
type: "BOOL",
default: settings.default || 0
```

See [defaults](https://github.com/unicoderns/orm/blob/master/docs/fields/defaults.md) for details

## Dates

### YEAR

Return [Fields.DataTimestampType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#DataTimestampType)

#### Custom settings

```typescript
type: 'YEAR';
```

### DATE

Return [Fields.DataTimestampType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#DataTimestampType)

#### Custom settings

```typescript
type: 'DATE';
```

### TIME

Return [Fields.DataTimestampType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#DataTimestampType)

#### Custom settings

```typescript
type: 'TIME';
```

### DATETIME

Return [Fields.DataTimestampType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#DataTimestampType)

#### Custom settings

```typescript
type: 'DATETIME';
```

### TIMESTAMP

Return [Fields.DataTimestampType](https://github.com/unicoderns/orm/blob/master/docs/fields/types.md#DataTimestampType)

#### Custom settings

```typescript
type: "TIMESTAMP",
default: settings.default || Defaults.Timestamp["CURRENT_TIMESTAMP"]
```

See [defaults](https://github.com/unicoderns/orm/blob/master/docs/fields/defaults.md) for details
