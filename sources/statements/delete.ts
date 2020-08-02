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

import { SqlPartialGeneratorUtils } from '../utils/sqlPartialGenerator'
import { ORMModel } from '../model'
import { Config, ORMModelKeyValue, ORMModelQuery } from '../interfaces'
import { Statement } from './statement'

/**
 * Model Abstract
 */
export class Delete extends Statement {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private partialGeneratorUtils: SqlPartialGeneratorUtils
    private readonly specialFunctions = ['now()']
    protected template = 'DELETE FROM <orm_table_name>;'
    protected templateJoin = 'DELETE FROM <orm_table_name> <orm_join>;'
    protected templateWhere = 'DELETE FROM <orm_table_name> WHERE <orm_conditions>;'
    protected templateJoinWhere = 'DELETE FROM <orm_table_name> <orm_join> WHERE <orm_conditions>;'

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
        this.partialGeneratorUtils = new SqlPartialGeneratorUtils(this.model, config, this.paramCursor)
    }

    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    public delete(where: string | ORMModelKeyValue | ORMModelKeyValue[]): ORMModelQuery {
        this.paramCursor.restore()

        let whereCode
        const joinCode = this.partialGeneratorUtils.generateJoinCode()

        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            throw new Error('Invalid where value.')
        } else {
            whereCode = this.partialGeneratorUtils.generateWhereCode(where)
        }

        const query = this.assembling({
            tableName: this.quote(this.model.tableName),
            conditions: whereCode.sql,
            join: joinCode,
        })

        return this.query({ sql: query, parameters: whereCode.values, values: whereCode.values })
    }
}
