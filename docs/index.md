# Unicoderns ORM

### Unicoderns Object/Relational Mapping

[![npm version](https://badge.fury.io/js/%40unicoderns%2Form.svg)](https://badge.fury.io/js/%40unicoderns%2Form)[![Travis](https://travis-ci.org/unicoderns/ORM.svg?branch=master)](https://travis-ci.org/unicoderns/ORM)
[![Coverage Status](https://coveralls.io/repos/github/unicoderns/orm/badge.svg?branch=master)](https://coveralls.io/github/unicoderns/orm?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ee1d8dc169ecc3800527/maintainability)](https://codeclimate.com/github/unicoderns/orm/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/unicoderns/orm/badge.svg?targetFile=package.json)](https://snyk.io/test/github/unicoderns/orm?targetFile=package.json)
[![Dependencies](https://david-dm.org/unicoderns/orm.svg)](https://david-dm.org/unicoderns/orm/)
[![Dev Dependencies](https://david-dm.org/unicoderns/orm/dev-status.svg)](https://david-dm.org/unicoderns/orm/?type=dev)

Docs available at [unicoderns.com](http://unicoderns.com/docs/ORM/) `Work in progress`

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
