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

import { ValidatorUtils } from './validator'
import { SqlPartialGeneratorUtils } from './sqlPartialGenerator'
import { ORMModel } from '../model'
import { Engines, Config, Drivers, ORMModelRow, ORMModelUpdate, ORMModelKeyValue } from '../interfaces'
import { Statement } from '../statements/statement'

/**
 * Model Abstract
 */
export class SqlGeneratorUtils extends Statement {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private validatorUtils: ValidatorUtils
    private partialGeneratorUtils: SqlPartialGeneratorUtils
    private readonly specialFunctions = ['now()']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emptyValues: any = []

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        super(config)
        this.model = model
        this.config = config || {}
        this.validatorUtils = new ValidatorUtils(config)
        this.partialGeneratorUtils = new SqlPartialGeneratorUtils(this.model, config, this.paramCursor)
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

    private processUpdateKeys(update: ORMModelUpdate): any {
        const data = update.data
        const fields = []
        const values = []
        const valuesObj: any = []

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

        return {
            fields,
            values,
            valuesObj,
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

        let unifiedValues = []
        const joinCode = this.partialGeneratorUtils.generateJoinCode()
        const where = update.where

        const { fields, values, valuesObj } = this.processUpdateKeys(update)

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
