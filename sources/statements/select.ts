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
import { ORMModelSelectLimit, Drivers, Config, ORMModelQuery } from '../interfaces'
import { ORMModel } from '..'
import { FieldsUtils } from '../utils/fields'
import { SqlPartialGeneratorUtils } from '../utils/sqlPartialGenerator'
import { regularQuotes } from '../utils/defaultValues'

/**
 * Model Abstract
 */
export class Select extends Statement {
    private model: ORMModel
    private fieldsUtils: FieldsUtils
    private partialGeneratorUtils: SqlPartialGeneratorUtils
    protected template = 'SELECT <orm_column_names> FROM <orm_table_name><orm_extra>;'
    protected templateJoin = 'SELECT <orm_column_names> FROM <orm_table_name> <orm_join><orm_extra>;'
    protected templateWhere = 'SELECT <orm_column_names> FROM <orm_table_name> WHERE <orm_conditions><orm_extra>;'
    protected templateJoinWhere = 'SELECT <orm_column_names> FROM <orm_table_name> <orm_join> WHERE <orm_conditions>;'

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        super(config)
        this.model = model
        this.fieldsUtils = new FieldsUtils()
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
        let fieldsSQL = (typeof prefix === 'undefined')?
                    this.generateSelectSQLwithoutPrefix(selectableFields):
                    this.generateSelectSQLwithPrefix(selectableFields, prefix);

        return fieldsSQL
    }

    /**
     * Generate select sql string without Prefix
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private generateSelectSQLwithoutPrefix(
        selectableFields: string[]
    ): string {

        return `${this.quote(this.model.tableName)}.${regularQuotes}` +
            selectableFields.join(`${regularQuotes}, ${this.quote(this.model.tableName)}.${regularQuotes}`) +
            regularQuotes
    }


    
    /**
     * Generate select sql string with Prefix
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private generateSelectSQLwithPrefix(
        selectableFields: string[],
        prefix: boolean | undefined
    ): string{

        const formatedFields: string[] = []

        selectableFields.forEach((field: string) => {
            const joined = `${this.model.tableName}__${field}`

            formatedFields.push(`${this.quote(this.model.tableName)}.${this.quote(field)} AS ${this.quote(joined)}`)
        })

        return formatedFields.join(', ')
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

    public getExtra(select: ORMModelSelectLimit): string {
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

        return extra
    }

    public getFields(
        select: ORMModelSelectLimit,
    ): {
        keys: string[]
        joinFieldsSQL: string
        fieldsSQL: string
    } {
        const joinFieldsSQL = this.partialGeneratorUtils.getJoinSelectFieldsSQL()
        const fieldsSQL = this.getSelectFieldsSQL(select.fields)
        const keyArray = String(fieldsSQL.replace(/"|`/g, '') + joinFieldsSQL.replace(/"|`/g, '')).split(', ')
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

        return {
            keys,
            joinFieldsSQL,
            fieldsSQL,
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
    public select(select: ORMModelSelectLimit): ORMModelQuery {
        this.paramCursor.restore()
        const joinCode = this.partialGeneratorUtils.generateJoinCode()
        const whereCode = this.partialGeneratorUtils.generateWhereCode(select.where)
        const fields = this.getFields(select)
        const sql = this.assembling({
            tableName: this.quote(this.model.tableName),
            join: joinCode,
            fields: fields.fieldsSQL + fields.joinFieldsSQL,
            conditions: whereCode.sql ? whereCode.sql : '',
            extra: this.getExtra(select),
        })

        this.model.joins = []

        const query: ORMModelQuery = { sql }

        if (this.model.config.driver === Drivers.DataAPI) {
            query.parameters = whereCode.values || []
        } else {
            query.values = whereCode.values
        }
        query.fields = fields.keys
        return this.query(query)
    }
}
