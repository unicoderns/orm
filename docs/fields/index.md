# Fields

Fields in Unicoderns ORM are composed from a decorator and a public property with type and value.

## Decorator

Declare a field (public) or secret (private) and also takes a string as field alias

```typescript
@field("first_name")
public firstName = new Datatypes().VARCHAR({
    size: 45
});
```

### Field

Regular field, will be returned everytime you query the model.

### Secret

Secret field, will be returned **ONLY** if the model you query is on *unsafe mode*, this will prevent leak of sensitive information by mistake even if that data is added later on the development process.

```typescript
@secret()
public password = new Datatypes().CHAR({
    notNull: true,
    size: 60
});
```

## Property

Fields are always public and each name is directly related to the name of the table field.

### Settings object

Full list available [here](types.md)