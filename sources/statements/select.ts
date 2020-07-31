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

import { Statement } from './statement'
import { ORMModelSelectLimit, Drivers, Config } from '../interfaces'
import { ORMModel } from '..'
import { FieldsUtils } from '../utils/fields'
import { SqlPartialGeneratorUtils } from '../utils/sqlPartialGenerator'

/**
 * Model Abstract
 */
export class Select extends Statement {
    private model: ORMModel
    private fieldsUtils: FieldsUtils
    private partialGeneratorUtils: SqlPartialGeneratorUtils

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        super(config)
        this.model = model
        this.fieldsUtils = new FieldsUtils(config)
        this.partialGeneratorUtils = new SqlPartialGeneratorUtils(this.model, config, this.paramCursor)
    }

    /**
     * Generate select sql string
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private generateSelectSQL({
        selectableFields,
        prefix,
    }: {
        selectableFields: string[]
        prefix: boolean | undefined
    }): string {
        let fieldsSQL = ''

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
     * Clean and validate a select if is need it
     * @todo change to private after join refactor
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    public getSelectFieldsSQL(fields: string | string[] | undefined, prefix?: boolean): string {
        let selectableFields: string[] = []
        const modelFields = this.model.getFields({ all: false })

        if (typeof fields === 'string') {
            return fields
        } else {
            selectableFields = this.fieldsUtils.clean({ modelFields, fields, debug: this.config.debug || false })
        }

        return this.generateSelectSQL({ selectableFields, prefix: prefix || undefined })
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
}
