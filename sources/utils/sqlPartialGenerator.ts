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
import { ORMModel } from '../model'
import { Engines, Config, ORMModelJoin, Drivers } from '../interfaces'
import { ParamCursor } from './paramCursor'

/**
 * Model Abstract
 */
export class SqlPartialGeneratorUtils {
    private model: ORMModel
    private config: Config = {}
    private validatorUtils: ValidatorUtils
    private readonly specialFunctions = ['now()']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emptyValues: any = []
    private regularQuotes = '"'
    protected paramCursor: ParamCursor

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config, paramCursor: ParamCursor) {
        this.model = model
        this.config = config || {}
        this.regularQuotes = this.config.computed ? this.config.computed.regularQuotes : '"'
        this.paramCursor = paramCursor
        this.validatorUtils = new ValidatorUtils(config)
    }

    /**
     * Quote string
     */
    private quote(value: string): string {
        return this.regularQuotes + value + this.regularQuotes
    }

    /**
     * Generates a select string from the Join configuration
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    public getJoinSelectFieldsSQL(): string {
        const joins = this.model.joins
        const joinsStringArray: string[] = []
        let joinsSQL = ''
        const config = this.config

        if (typeof joins !== 'undefined' && joins.length) {
            joins.forEach((join: ORMModelJoin) => {
                if (typeof join.fields !== 'undefined') {
                    joinsStringArray.push(join.keyField.model.setConfig(config).getSelectFieldsSQL(join.fields, true))
                } else {
                    throw new Error('Invalid join fields.')
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
    public generateJoinCode(): string {
        const joins = this.model.joins
        const joinsStringArray: string[] = []
        let joinsSQL = ''

        if (joins.length) {
            joins.forEach((join: ORMModelJoin) => {
                const linkedTableName = join.keyField.model.tableName
                const sql = `${join.type.toUpperCase()} JOIN ${this.quote(linkedTableName)} ON ${this.quote(
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

    private filterWhereKeys(where: any): { keys: string[]; values: any } {
        const keys: string[] = []
        const values: any = []

        // ToDo: Rewrite where keys to be able to test them
        // if (config.debug) {
        //    this.logMissingFields(keys, modelFields);
        // }
        // filteredKeys = this.filterFields(keys, modelFields);

        for (const key in where) {
            keys.push(key)

            if (this.config.driver === Drivers.DataAPI) {
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
                    values.push(
                        this.validatorUtils.transform({ fields: this.model.getFields({ all: true }), key, value }),
                    )
                }
            }
        }

        return {
            keys,
            values,
        }
    }

    private processKeys(where: any): string {
        const filtered = this.filterWhereKeys(where)
        const filteredKeys: string[] = filtered.keys
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
                        if (this.config.driver === Drivers.DataAPI) {
                            sql = `${sql} ${operator} :${item}`
                        } else if (this.config.engine === Engines.PostgreSQL) {
                            sql = `${sql} ${operator} $${this.paramCursor.getNext()}`
                        } else if (this.config.engine === Engines.MySQL) {
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

        return sql
    }

    /////////////////////////////////////////////////////////////////////
    // Generate "AND" chained where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public generateWhereCodeChain(where: any): { sql: string; values: string[] } {
        const filtered = this.filterWhereKeys(where)
        const values: string[] = []
        const filteredKeys: string[] = filtered.keys
        const valuesObj = filtered.values

        if (typeof where !== 'undefined') {
            const sql = this.processKeys(where)

            if (this.config.driver === Drivers.DataAPI) {
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
    public generateWhereCode(where?: any): { sql: string; values: string[] } {
        if (where === '*') {
            return {
                sql: '',
                values: this.emptyValues,
            }
        } else if (typeof where === 'string' || (Array.isArray(where) && !where.length)) {
            throw new Error('Invalid where value.')
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
                if (this.config.driver === Drivers.DataAPI) {
                    generated.values = valuesObj
                } else {
                    generated.values = values
                }
            } else {
                generated = this.generateWhereCodeChain(where)
            }

            return generated
        }
    }
}
