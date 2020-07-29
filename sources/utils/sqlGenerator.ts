////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns S.A. - info@unicoderns.com - unicoderns.com             //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import { FieldsUtils } from './fields'
import { ORMModel } from '../model'
import {
    Engines,
    Config,
    ORMModelJoin,
    Drivers,
    ORMModelSelectLimit,
    ORMModelRow,
    ORMModelUpdate,
    ORMModelKeyValue,
} from '../interfaces'
import { ORMSupportedFields } from '../enums/db/fields'

/**
 * Model Abstract
 */
export class SqlGeneratorUtils {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private fieldsUtils: FieldsUtils
    private readonly specialFunctions = ['now()']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emptyValues: any = []
    private currentParamPosition = 0
    private regularQuotes = '"'

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        this.model = model
        this.config = config || {}
        this.regularQuotes = this.config.computed ? this.config.computed.regularQuotes : '"'
        this.fieldsUtils = new FieldsUtils(this.model, config)
    }

    /**
     * Restore shared params to original state
     */
    private restore(): void {
        this.currentParamPosition = 0
    }

    /**
     * Quote string
     */
    private quote(value: string): string {
        return this.regularQuotes + value + this.regularQuotes
    }

    /**
     * Clean and validate a select if is need it
     * @todo change to private after join refactor
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    public getSelectFieldsSQL(fields: string | string[] | undefined, prefix?: boolean): string {
        let fieldsSQL = ''
        let selectableFields: string[] = []
        const modelFields = this.model.getFields({ all: false })
        const config: Config = this.model.config

        if (typeof fields === 'string') {
            return fields
        } else {
            // Check if is an array or just SQL code
            if (Array.isArray(fields) && fields.length) {
                if (config.debug) {
                    this.fieldsUtils.logMissing(fields, modelFields)
                }
                selectableFields = this.fieldsUtils.filter(fields, modelFields)
            } else {
                selectableFields = this.fieldsUtils.toArray(modelFields)
            }
        }

        if (typeof prefix === 'undefined') {
            fieldsSQL = `${this.quote(this.model.tableName)}.${this.regularQuotes}`
            fieldsSQL =
                fieldsSQL +
                selectableFields.join(
                    `${this.regularQuotes}, ${this.quote(this.model.tableName)}.${this.regularQuotes}`,
                ) +
                this.regularQuotes
        } else {
            const formatedFields: string[] = []

            selectableFields.forEach((field: string) => {
                const joined = `${this.model.tableName}__${field}`

                formatedFields.push(`${this.quote(this.model.tableName)}.${this.quote(field)} AS ${this.quote(joined)}`)
            })
            fieldsSQL = formatedFields.join(', ')
        }

        return fieldsSQL
    }

    /**
     * Generates a select string from the Join configuration
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private getJoinSelectFieldsSQL(): string {
        const joins = this.model.joins
        const joinsStringArray: string[] = []
        let joinsSQL = ''
        const config = this.model.config

        if (typeof joins !== 'undefined' && joins.length) {
            joins.forEach((join: ORMModelJoin) => {
                if (typeof join.fields !== 'undefined') {
                    joinsStringArray.push(join.keyField.model.setConfig(config).getSelectFieldsSQL(join.fields, true))
                } else {
                    joinsStringArray.push('ERROR;')
                }
            })
            joinsSQL = joinsStringArray.join(', ')
            joinsSQL = `, ${joinsSQL}`
        }
        return joinsSQL
    }

    /**
     * Generate join sql code
     *
     * @return String with the where sql code
     */
    private generateJoinCode(): string {
        const joins = this.model.joins
        const joinsStringArray: string[] = []
        let joinsSQL = ''

        if (joins.length) {
            joins.forEach((join: ORMModelJoin) => {
                const linkedTableName = join.keyField.model.tableName
                const sql = ` ${join.type.toUpperCase()} JOIN ${this.quote(linkedTableName)} ON ${this.quote(
                    this.model.tableName,
                )}.${this.quote(join.keyField.localField)} = ${this.quote(linkedTableName)}.${this.quote(
                    join.keyField.linkedField,
                )}`

                joinsStringArray.push(sql)
            })
            joinsSQL = joinsStringArray.join(' ')
        }
        return joinsSQL
    }

    /////////////////////////////////////////////////////////////////////
    // Validate and transform value against model type
    // Only for DataApi so far.
    // Join could only be an INT.
    /////////////////////////////////////////////////////////////////////
    private validateAndTransform(
        key: string,
        value: string | number,
    ): { name: string; value: { [key: string]: string | number } } | string {
        const joinkeys = key.split('__')
        const fields = this.model.getFields({ all: true })

        if (joinkeys.length == 2) {
            return {
                name: key,
                value: { longValue: value },
            }
        }

        if (fields[key]) {
            const type = fields[key].type

            if (type === ORMSupportedFields.BOOL) {
                return {
                    name: key,
                    value: { booleanValue: value },
                }
            } else if (
                type === ORMSupportedFields.INT ||
                type === ORMSupportedFields.TINYINT ||
                type === ORMSupportedFields.SMALLINT ||
                type === ORMSupportedFields.BIGINT
            ) {
                return {
                    name: key,
                    value: { longValue: value },
                }
            } else if (
                type === ORMSupportedFields.FLOAT ||
                type === ORMSupportedFields.REAL ||
                type === ORMSupportedFields.DOUBLE
            ) {
                return {
                    name: key,
                    value: { doubleValue: value },
                }
            } else if (
                type === ORMSupportedFields.BLOB ||
                type === ORMSupportedFields.BINARY ||
                type === ORMSupportedFields.LONGVARBINARY ||
                type === ORMSupportedFields.VARBINARY
            ) {
                return {
                    name: key,
                    value: { blobValue: value },
                }
            }
            // ORMSupportedFields.DECIMAL, Clob?, Date, Hour
            return {
                name: key,
                value: { stringValue: value },
            }
        }

        return 'ERROR;'
    }

    /////////////////////////////////////////////////////////////////////
    // Generate "AND" chained where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private generateWhereCodeChain(where: any): { sql: string; values: string[] } {
        const values: string[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj: any = []
        const keys: string[] = []
        let filteredKeys: string[] = []
        // let modelFields = this.getFields();
        // let config: Config = this.model.config;

        for (const key in where) {
            keys.push(key)

            if (this.model.config.driver === Drivers.DataAPI) {
                let value

                if (typeof where[key].value === 'undefined') {
                    value = where[key]
                } else {
                    value = where[key].value
                }

                const joinkeys = String(value).split('__')

                if (
                    String(value).charAt(0) !== '\\' &&
                    joinkeys.length !== 2 &&
                    this.specialFunctions.indexOf(value) < 0
                ) {
                    valuesObj.push(this.validateAndTransform(key, value))
                }
            }
        }

        filteredKeys = keys
        // ToDo: Rewrite where keys to be able to test them
        // if (config.debug) {
        //    this.logMissingFields(keys, modelFields);
        // }
        // filteredKeys = this.filterFields(keys, modelFields);

        if (typeof where !== 'undefined') {
            let sql = ''

            filteredKeys.forEach((item: string, index: number, array: string[]) => {
                let operator = '='

                if (typeof where[item].operator !== 'undefined') {
                    operator = where[item].operator
                    where[item] = where[item].value
                }
                if (String(where[item]).charAt(0) == '\\') {
                    sql = `${sql + this.quote(this.model.tableName)}.${this.quote(item)} ${operator} ${String(
                        where[item],
                    ).substring(1)}`
                } else {
                    let joinkeys = item.split('__')
                    // string literal

                    if (joinkeys.length === 2) {
                        sql = `${sql + this.quote(joinkeys[0])}.${this.quote(joinkeys[1])}`
                    } else {
                        sql = `${sql + this.quote(this.model.tableName)}.${this.quote(item)}`
                    }
                    joinkeys = String(where[item]).split('__')
                    // joined column
                    if (joinkeys.length == 2) {
                        sql = `${sql} ${operator} ${this.quote(joinkeys[0])}.${this.quote(joinkeys[1])}`
                    } else {
                        // special functiom
                        if (this.specialFunctions.indexOf(where[item]) >= 0) {
                            sql = `${sql} ${operator} ${where[item]}`
                        } else {
                            if (this.model.config.driver === Drivers.DataAPI) {
                                sql = `${sql} ${operator} :${item}`
                            } else if (this.model.config.engine === Engines.PostgreSQL) {
                                sql = `${sql} ${operator} $${++this.currentParamPosition}`
                            } else if (this.model.config.engine === Engines.MySQL) {
                                sql = `${sql} ${operator} ?`
                            } else {
                                sql = `${sql} ENGINE NOT SUPPORTED`
                            }
                        }
                    }
                }
                if (index < array.length - 1) {
                    sql = `${sql} AND `
                }
            })
            if (this.model.config.driver === Drivers.DataAPI) {
                return {
                    sql: sql,
                    values: valuesObj,
                }
            } else {
                // getting values
                filteredKeys.forEach((item: string) => {
                    const joinkeys = String(where[item]).split('__')

                    if (
                        String(where[item]).charAt(0) != '\\' &&
                        joinkeys.length != 2 &&
                        this.specialFunctions.indexOf(where[item]) < 0
                    ) {
                        values.push(where[item])
                    }
                })
                return {
                    sql: sql,
                    values: values,
                }
            }
        } else {
            return {
                sql: '',
                values: this.emptyValues,
            }
        }
    }

    /**
     * Generate where sql code
     *
     * @var where Array of key/value objects with the conditions
     * @return String with the where sql code
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private generateWhereCode(where?: any): { sql: string; values: string[] } {
        if (where == '*') {
            return {
                sql: '',
                values: this.emptyValues,
            }
        } else if (typeof where === 'string' || (Array.isArray(where) && !where.length)) {
            return {
                sql: 'ERROR',
                values: this.emptyValues,
            }
        } else {
            let generated: { sql: string; values: string[] } = {
                sql: '',
                values: this.emptyValues,
            }

            if (Array.isArray(where)) {
                let values: string[] = []
                const SQLChains: string[] = []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let valuesObj: any = []
                // eslint-disable-next-line @typescript-eslint/no-explicit-any

                where.forEach((chain: any) => {
                    const localChain = this.generateWhereCodeChain(chain)

                    valuesObj = valuesObj.concat(localChain.values)
                    values = values.concat(localChain.values)
                    SQLChains.push(localChain.sql)
                })
                generated.sql = `(${SQLChains.join(') OR (')})`
                if (this.model.config.driver === Drivers.DataAPI) {
                    generated.values = valuesObj
                } else {
                    generated.values = values
                }
            } else {
                generated = this.generateWhereCodeChain(where)
            }

            if (generated.sql) {
                generated.sql = ` WHERE ${generated.sql}`
                return generated
            } else {
                return generated
            }
        }
    }

    /**
     * Select private query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column names and direction E.g.: "id, name ASC"
     * @var groupBy String with column names E.g.: "id, name"
     * @var limit Number of rows to retrieve
     * @return Promise with query result
     *
     * TODO:
     * @var orderBy should be an array of fields, then they can be tested
     * @var groupBy should be an array of fields, then they can be tested
     * Join at least 2 tables is important
     * Group this using functions like select("").orderBy() is just easier to understand
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public select(select: ORMModelSelectLimit): Promise<any> {
        this.restore()

        const fieldsSQL = this.getSelectFieldsSQL(select.fields)
        const joinFieldsSQL = this.getJoinSelectFieldsSQL()
        const joinCode = this.generateJoinCode()
        const whereCode = this.generateWhereCode(select.where)
        const groupBy = select.groupBy
        const orderBy = select.orderBy
        const limit = select.limit
        let extra = ''

        if (typeof groupBy !== 'undefined' && groupBy !== null) {
            extra += ` GROUP BY ${groupBy}`
        }
        if (typeof orderBy !== 'undefined' && orderBy !== null) {
            extra += ` ORDER BY ${orderBy}`
        }
        if (typeof limit !== 'undefined' && limit !== null) {
            extra += ` LIMIT ${limit}`
        }
        const sql = `SELECT ${fieldsSQL + joinFieldsSQL} FROM ${
            this.quote(this.model.tableName) + joinCode + whereCode.sql + extra
            };`

        this.model.joins = []

        const query: { sql: string; parameters?: string[]; values?: string[] } = { sql }

        if (this.model.config.driver === Drivers.DataAPI) {
            query.parameters = whereCode.values || []
        } else {
            query.values = whereCode.values
        }

        // Consistent Return
        const keyArray = String(fieldsSQL.replace(/"/g, '') + joinFieldsSQL.replace(/"/g, '')).split(', ')
        const keys: string[] = []

        keyArray.forEach((key) => {
            let temp = key.split(' AS ')

            if (temp.length === 2) {
                keys.push(temp[1])
            } else {
                temp = key.split('.')
                keys.push(temp[1])
            }
        })
        return this.model.query(query).then((data: any) => {
            return Promise.resolve(this.model.selectConsistentReturn(keys, data))
        })
    }

    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public insert(data: ORMModelRow): Promise<any> {
        this.restore()

        const fields: string[] = []
        const wildcards: string[] = []
        const values: string[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj: any = []

        for (const key in data) {
            const value = typeof data[key] === 'undefined' ? '' : data[key]

            fields.push(key)
            values.push(value)
            valuesObj.push(this.validateAndTransform(key, value))

            if (this.model.config.driver === Drivers.DataAPI) {
                wildcards.push(`:${key}`)
            } else if (this.model.config.engine === Engines.PostgreSQL) {
                wildcards.push(`$${++this.currentParamPosition}`)
            } else if (this.model.config.engine === Engines.MySQL) {
                wildcards.push('?')
            } else {
                wildcards.push('ENGINE NOT SUPPORTED')
            }
        }

        const query = `INSERT INTO ${this.quote(this.model.tableName)} (${
            this.regularQuotes + fields.join(`${this.regularQuotes}, ${this.regularQuotes}`) + this.regularQuotes
            }) VALUES (${wildcards.join(', ')});`

        if (this.model.config.driver === Drivers.DataAPI) {
            return this.model.query({ sql: query, parameters: valuesObj })
        } else {
            return this.model.query({ sql: query, values: values })
        }
    }

    /**
     * Update query
     *
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public update(update: ORMModelUpdate): Promise<any> {
        this.restore()

        const fields = []
        const values = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj: any = []
        let unifiedValues = []
        const joinCode = this.generateJoinCode()
        const data = update.data
        const where = update.where

        for (const key in data) {
            const joinkeys = String(data[key]).split('__')

            if (joinkeys.length === 2) {
                fields.push(
                    `${this.quote(this.model.tableName)}.${this.quote(key)} = ${this.quote(joinkeys[0])}.${this.quote(
                        joinkeys[1],
                    )}`,
                )
            } else if (this.specialFunctions.indexOf(data[key]) >= 0) {
                fields.push(`${this.quote(this.model.tableName)}.${this.quote(key)} = ${data[key]}`)
            } else {
                valuesObj.push(this.validateAndTransform(key, data[key]))
                values.push(data[key])

                if (this.model.config.driver === Drivers.DataAPI) {
                    fields.push(`${this.quote(this.model.tableName)}.${this.quote(key)} = :${key}`)
                } else if (this.model.config.engine === Engines.PostgreSQL) {
                    fields.push(
                        `${this.quote(this.model.tableName)}.${this.quote(key)} = $${++this.currentParamPosition}`,
                    )
                } else if (this.model.config.engine === Engines.MySQL) {
                    fields.push(`${this.quote(this.model.tableName)}.${this.quote(key)} = ?`)
                } else {
                    fields.push('ENGINE NOT SUPPORTED')
                }
            }
        }
        let whereCode

        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            whereCode = {
                sql: 'ERROR',
                values: this.emptyValues,
            }
        } else {
            whereCode = this.generateWhereCode(where)
        }

        const query = `UPDATE ${this.quote(this.model.tableName)}${joinCode} SET ${fields.join(', ')}${whereCode.sql};`

        if (this.model.config.driver === Drivers.DataAPI) {
            return this.model.query({ sql: query, parameters: valuesObj.concat(whereCode.values) })
        } else {
            unifiedValues = values.concat(whereCode.values)
            return this.model.query({ sql: query, values: unifiedValues })
        }
    }

    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public delete(where: string | ORMModelKeyValue | ORMModelKeyValue[]): Promise<any> {
        this.restore()

        let whereCode
        const joinCode = this.generateJoinCode()

        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            whereCode = {
                sql: 'ERROR',
                values: this.emptyValues,
            }
        } else {
            whereCode = this.generateWhereCode(where)
        }
        const query = `DELETE FROM ${
            this.regularQuotes + this.model.tableName + this.regularQuotes + joinCode + whereCode.sql
            };`

        if (this.model.config.driver === Drivers.DataAPI) {
            return this.model.query({ sql: query, parameters: whereCode.values })
        } else {
            return this.model.query({ sql: query, values: whereCode.values })
        }
    }
}
