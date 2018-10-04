# Field Types

Internal field types.

All types inherit from `CommonTypes` and cointain the following properties diretly related with the table:

```typescript
primaryKey?: boolean;
notNull?: boolean;
unique?: boolean;
unsigned?: boolean;
zeroFill?: boolean;
autoincrement?: boolean;
generated?: boolean;
size?: number;
```

Also includes system specific properties:

```typescript
type?: string;
alias?: string;
protected?: boolean;
private?: boolean;
```

## List

### VarCharType

```typescript
size: number;
```

### FloatType

```typescript
precision?: number;
```

### BoolType

```typescript
default: Defaults.Binary;
```

See defaults for more.

### DataTimestampType

```typescript
default: Defaults.Timestamp;
```

See defaults for more.


### ForeignKey

```typescript
localField: string;
linkedField: string;
model: Model;
```

#### localField ####

Name of the current field

#### linkedField ####

Name of the field linked in the other table

#### model ####

Model owner of the linked field

### StaticKey

```typescript
keys: any;
```
