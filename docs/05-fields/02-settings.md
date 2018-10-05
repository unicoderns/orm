# Field Settings

Each setting is prepopulated with default values, that allow you to speficy only the values to be changed.

## Numbers

### TINYINT

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

```typescript
type: "TINYINT"
```

### SMALLINT

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

```typescript
type: "SMALLINT"
```

### INT

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

```typescript
type: "INT"
```

### ID

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

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

Return [Fields.ForeignKey](03-types.md#ForeignKey)

#### Custom settings ####

```typescript
type: "INT",
size: settings.size || 0,
model: model,
localField: localField,
linkedField: linkedField
```

### STATICKEY

Return [Fields.StaticKey](03-types.md#StaticKey)

#### Custom settings ####

```typescript
type: "INT",
size: settings.size || 0,
keys: keys
```

### FLOAT

Return [Fields.FloatType](03-types.md#FloatType)

#### Custom settings ####

```typescript
type: "FLOAT"
```

### DOUBLE

Return [Fields.FloatType](03-types.md#FloatType)

#### Custom settings ####

```typescript
type: "DOUBLE"
```

### DECIMAL

Return [Fields.FloatType](03-types.md#FloatType)

#### Custom settings ####

```typescript
type: "DECIMAL"
```

## Strings

### CHAR

Return [Fields.VarCharType](03-types.md#VarCharType)

#### Custom settings ####

```typescript
type: "CHAR",
size: settings.size || 0
```

### VARCHAR

Return [Fields.VarCharType](03-types.md#VarCharType)

#### Custom settings ####

```typescript
type: "VARCHAR",
size: settings.size || 0
```

### TINYTEXT

Return [Fields.VarCharType](03-types.md#VarCharType)

#### Custom settings ####

```typescript
type: "TINYTEXT",
size: settings.size || 0
```

### TEXT

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

```typescript
type: "TEXT"
```

### LONGTEXT

Return [Fields.CommonTypes](03-types.md)

#### Custom settings ####

```typescript
type: "LONGTEXT"
```

## Binary

### BOOL

Return [Fields.BoolType](03-types.md#BoolType)

#### Custom settings ####

```typescript
type: "BOOL",
default: settings.default || 0
```
See Defaults for details

## Dates

### YEAR

Return [Fields.DataTimestampType](03-types.md#DataTimestampType)

#### Custom settings ####

```typescript
type: "YEAR"
```

### DATE

Return [Fields.DataTimestampType](03-types.md#DataTimestampType)

#### Custom settings ####

```typescript
type: "DATE"
```

### TIME

Return [Fields.DataTimestampType](03-types.md#DataTimestampType)

#### Custom settings ####

```typescript
type: "TIME"
```

### DATETIME

Return [Fields.DataTimestampType](03-types.md#DataTimestampType)

#### Custom settings ####

```typescript
type: "DATETIME"
```

### TIMESTAMP

Return [Fields.DataTimestampType](03-types.md#DataTimestampType)

#### Custom settings ####

```typescript
type: "TIMESTAMP",
default: settings.default || Defaults.Timestamp["CURRENT_TIMESTAMP"]
```

See Defaults for details