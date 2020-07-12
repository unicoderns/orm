# Unicoderns ORM

[![](https://unicoderns.com/img/logoorm.e1a28eb9.svg)](https://unicoderns.com/en/orm/)

### Unicoderns Object/Relational Mapping

[![npm version](https://badge.fury.io/js/%40unicoderns%2Form.svg)](https://badge.fury.io/js/%40unicoderns%2Form)[![Travis](https://travis-ci.org/unicoderns/ORM.svg?branch=master)](https://travis-ci.org/unicoderns/ORM)
[![Coverage Status](https://coveralls.io/repos/github/unicoderns/orm/badge.svg?branch=master)](https://coveralls.io/github/unicoderns/orm?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/ee1d8dc169ecc3800527/maintainability)](https://codeclimate.com/github/unicoderns/orm/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/unicoderns/orm/badge.svg?targetFile=package.json)](https://snyk.io/test/github/unicoderns/orm?targetFile=package.json)
[![Dependencies](https://david-dm.org/unicoderns/orm.svg)](https://david-dm.org/unicoderns/orm/)
[![Dev Dependencies](https://david-dm.org/unicoderns/orm/dev-status.svg)](https://david-dm.org/unicoderns/orm/?type=dev)

Docs available at [unicoderns.com](http://unicoderns.com/docs/ORM/) `Work in progress`

This is a typescript light layer package that allows you to manage and do queries to the DB in an easier way, even without SQL knowledge.

## Table of Contents

- [Quick Start](#quick-start)
- [Bugs and features](#bugs-and-features)
- [Do you want to contribute?](#do-you-want-to-contribute)
- [Creators](#creators)
- [Community](#community)
- [Copyright and license](#copyright-and-license)

## Quick Start

1. Install the library:
   `npm install -s @unicoderns/orm`

2. Create a [model](https://github.com/unicoderns/orm/blob/master/docs/models.md).

3. Create a connection as the following example:

```typescript
import * as users from './dummy/usersModel';
import { Engines, Drivers } from '@unicoderns/orm';

let usersTable: users.Users;
usersTable = new users.Users({
  debug: false,
  engine: Engines.MySQL,
  driver: Drivers.Native,
});
```

4. Use the available [queries](https://github.com/unicoderns/orm/blob/master/docs/functions.md).

## Bugs and Features

Do you have a bug or a feature request? Please first check if the issue you found hasn´t been solved yet [here](https://github.com/unicoderns/orm/issues). If you want to open a bug or request a new feature, please refer to our [contributing guidelines](https://github.com/isaZuGo/orm/blob/update-documentation/CONTRIBUTING.md) and open your request [here](https://github.com/unicoderns/orm/issues).

## Do you want to contribute?

If you want to be part of this amazing project, please read through our [contributing guidelines](https://github.com/unicoderns/orm/blob/master/CONTRIBUTING.md) to know the process you should follow. The community will be glad to receive your contribution.

## Community

Stay in touch with all members of the community and get updates about ORM's development. Follow us [on twitter](https://twitter.com/unicoderns).

## Copyright and license

Code and documentation Copyright 2018–2020 to Contributors and Unicoderns S.A. Code released under the MIT License.
