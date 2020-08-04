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

import { ValidatorUtils } from '../utils/validator'
import { SqlPartialGeneratorUtils } from '../utils/sqlPartialGenerator'
import { ORMModel } from '../model'
import { Config, ORMModelUpdate, ORMModelQuery, ORMModelRow } from '../interfaces'
import { Statement } from './statement'
import { specialFunctions } from '../utils/defaultValues'

/**
 * Model Abstract
 */
export class Update extends Statement {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private validatorUtils: ValidatorUtils
    private partialGeneratorUtils: SqlPartialGeneratorUtils
    protected template = 'UPDATE <orm_table_name> SET <orm_column_names>;'
    protected templateJoin = 'UPDATE <orm_table_name> <orm_join> SET <orm_column_names>;'
    protected templateWhere = 'UPDATE <orm_table_name> SET <orm_column_names> WHERE <orm_conditions>;'
    protected templateJoinWhere = 'UPDATE <orm_table_name> <orm_join> SET <orm_column_names> WHERE <orm_conditions>;'

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        super(config)
        this.model = model
        this.config = config
        this.validatorUtils = new ValidatorUtils(config)
        this.partialGeneratorUtils = new SqlPartialGeneratorUtils(this.model, config, this.paramCursor)
    }

    private processKey({ key, data }: { key: string; data: ORMModelRow }): any {
        const joinkeys = String(data[key]).split('__')
        let field = ''
        let value = ''
        let valueObj: any = ''

        if (joinkeys.length === 2) {
            field = `${this.quote(this.model.tableName)}.${this.quote(key)} = ${this.quote(joinkeys[0])}.${this.quote(
                joinkeys[1],
            )}`
        } else if (specialFunctions.indexOf(data[key]) >= 0) {
            field = `${this.quote(this.model.tableName)}.${this.quote(key)} = ${data[key]}`
        } else {
            valueObj = this.validatorUtils.transform({
                fields: this.model.getFields({ all: true }),
                key,
                value: data[key],
            })
            value = data[key]
            field = `${this.quote(this.model.tableName)}.${this.quote(key)} = ${this.strToReplace(key)}`
        }

        return { field, value, valueObj }
    }

    private processKeys(update: ORMModelUpdate): any {
        const data = update.data
        const fields: any = []
        const values: any = []
        const valuesObj: any = []

        for (const key in data) {
            const processedKey = this.processKey({ key, data })
            const field = processedKey.field
            const value = processedKey.value
            const valueObj = processedKey.valueObj

            if (field) {
                fields.push(field)
            }
            if (value) {
                values.push(value)
            }
            if (valueObj) {
                valuesObj.push(valueObj)
            }
        }

        return { fields, values, valuesObj }
    }

    /**
     * Update query
     *
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    public update(update: ORMModelUpdate): ORMModelQuery {
        this.paramCursor.restore()

        let unifiedValues = []
        const joinCode = this.partialGeneratorUtils.generateJoinCode()
        const where = update.where

        const { fields, values, valuesObj } = this.processKeys(update)

        let whereCode

        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            throw new Error('Invalid where value.')
        } else {
            whereCode = this.partialGeneratorUtils.generateWhereCode(where)
        }

        const query = this.assembling({
            tableName: this.quote(this.model.tableName),
            join: joinCode,
            fields: fields.join(', '),
            conditions: whereCode.sql,
        })

        unifiedValues = values.concat(whereCode.values)
        return this.query({ sql: query, parameters: valuesObj.concat(whereCode.values), values: unifiedValues })
    }
}
