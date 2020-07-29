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
import { ValidatorUtils } from './validator'
import { SqlPartialGeneratorUtils } from './sqlPartialGenerator'
import { ORMModel } from '../model'
import {
    Engines,
    Config,
    Drivers,
    ORMModelSelectLimit,
    ORMModelRow,
    ORMModelUpdate,
    ORMModelKeyValue,
} from '../interfaces'
import { ParamCursor } from './paramCursor'

/**
 * Model Abstract
 */
export class SqlGeneratorUtils {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private paramCursor: ParamCursor = new ParamCursor()
    private fieldsUtils: FieldsUtils
    private validatorUtils: ValidatorUtils
    private partialGeneratorUtils: SqlPartialGeneratorUtils
    private readonly specialFunctions = ['now()']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emptyValues: any = []
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
        this.fieldsUtils = new FieldsUtils(config)
        this.fieldsUtils = new FieldsUtils(config)
        this.validatorUtils = new ValidatorUtils(config)
        this.partialGeneratorUtils = new SqlPartialGeneratorUtils(this.model, config, this.paramCursor)
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
        this.paramCursor.restore()

        const fieldsSQL = this.getSelectFieldsSQL(select.fields)
        const joinFieldsSQL = this.partialGeneratorUtils.getJoinSelectFieldsSQL()
        const joinCode = this.partialGeneratorUtils.generateJoinCode()
        const whereCode = this.partialGeneratorUtils.generateWhereCode(select.where)
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
        this.paramCursor.restore()

        const fields: string[] = []
        const wildcards: string[] = []
        const values: string[] = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj: any = []

        for (const key in data) {
            const value = typeof data[key] === 'undefined' ? '' : data[key]

            fields.push(key)
            values.push(value)
            valuesObj.push(this.validatorUtils.transform({ fields: this.model.getFields({ all: true }), key, value }))

            if (this.model.config.driver === Drivers.DataAPI) {
                wildcards.push(`:${key}`)
            } else if (this.model.config.engine === Engines.PostgreSQL) {
                wildcards.push(`$${this.paramCursor.getNext()}`)
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
        this.paramCursor.restore()

        const fields = []
        const values = []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj: any = []
        let unifiedValues = []
        const joinCode = this.partialGeneratorUtils.generateJoinCode()
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
                valuesObj.push(
                    this.validatorUtils.transform({
                        fields: this.model.getFields({ all: true }),
                        key,
                        value: data[key],
                    }),
                )
                values.push(data[key])

                if (this.model.config.driver === Drivers.DataAPI) {
                    fields.push(`${this.quote(this.model.tableName)}.${this.quote(key)} = :${key}`)
                } else if (this.model.config.engine === Engines.PostgreSQL) {
                    fields.push(
                        `${this.quote(this.model.tableName)}.${this.quote(key)} = $${this.paramCursor.getNext()}`,
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
            whereCode = this.partialGeneratorUtils.generateWhereCode(where)
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
        this.paramCursor.restore()

        let whereCode
        const joinCode = this.partialGeneratorUtils.generateJoinCode()

        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            whereCode = {
                sql: 'ERROR',
                values: this.emptyValues,
            }
        } else {
            whereCode = this.partialGeneratorUtils.generateWhereCode(where)
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
