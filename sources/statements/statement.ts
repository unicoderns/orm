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

import { Config, Drivers, ORMModelQuery } from '../interfaces'
import { ParamCursor } from '../utils/paramCursor'

/**
 * Model Abstract
 */
export abstract class Statement {
    public config: Config = {}
    protected regularQuotes = '"'
    protected paramCursor: ParamCursor = new ParamCursor()
    protected error = ''
    protected abstract template: string
    protected abstract templateJoin: string
    protected abstract templateWhere: string
    protected abstract templateJoinWhere: string

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(config: Config) {
        this.config = config
        this.regularQuotes = this.config.computed ? this.config.computed.regularQuotes : '"'
    }

    /**
     * Quote string
     */
    protected quote(value: string): string {
        return this.regularQuotes + value + this.regularQuotes
    }

    public query(query: ORMModelQuery): ORMModelQuery {
        const { sql, values, parameters, fields } = query

        if (this.config.driver === Drivers.DataAPI) {
            return { sql, parameters, fields }
        } else {
            return { sql, values, fields }
        }
    }

    protected assembling({
        tableName,
        fields,
        values,
        join,
        conditions,
        extra,
    }: {
        tableName: string
        fields?: string
        values?: string
        join?: string
        conditions?: string
        extra?: string
    }): string {
        let query = ''

        if (conditions && join) {
            query = this.templateJoinWhere
        } else if (conditions) {
            query = this.templateWhere
        } else if (join) {
            query = this.templateJoin
        } else {
            query = this.template
        }

        query = query.replace('<orm_column_names>', fields || '')
        query = query.replace('<orm_table_name>', tableName || '')
        query = query.replace('<orm_conditions>', conditions || '')
        query = query.replace('<orm_value_keys>', values || '')
        query = query.replace('<orm_join>', join || '')
        return query.replace('<orm_extra>', extra || '')
    }
}
