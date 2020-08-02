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

import {
    ORMModelJoin,
    ORMModelQuery,
    ORMModelSelectLimit,
    ORMModelSelect,
    ORMModelSelectReturn,
    ORMModelRow,
    ORMModelUpdate,
    ORMModelKeyValue,
} from './interfaces'
import { Config, Drivers, Engines } from './interfaces/config'
import { ORMAllowedFields } from './enums'
import { Update } from './statements/update'
import { Select } from './statements/select'
import { Insert } from './statements/insert'
import { Delete } from './statements/delete'

/**
 * Model Abstract
 */
export class ORMModel {
    public tableName = 'dummyTable' // ToDo: protect
    public config: Config = {} // ToDo: move all config to file
    private unsafe = false
    public joins: ORMModelJoin[] = [] // ToDo: protect
    public readonly fields: ORMAllowedFields = {}
    public readonly secured: ORMAllowedFields = {}
    // Initialized on setConfig
    private updateStatement!: Update
    private selectStatement!: Select
    private insertStatement!: Insert
    private deleteStatement!: Delete

    /**
     * Create a table object.
     *
     * @param config Config
     * @param privacy To get all fields (secrets included), you need to set privacy as "unsafe" explicitly, in that way we ensure that this will not be a security breach in any wrong future upgrade.
     */
    constructor(config?: Config, privacy?: string) {
        this.setConfig(config)

        if (privacy == 'unsafe') {
            this.unsafe = true
        }
    }

    /**
     * Get field list for the table
     *
     * @param target Db table name.
     * @return Field map.
     */
    public getFields = ({ all }: { all: boolean }): ORMAllowedFields => {
        if (!this.isSafe() || all) {
            return { ...this.fields, ...this.secured }
        }

        return this.fields
    }

    /**
     * Fill config.
     *
     * @todo Make private after improve joins
     * @param config Config
     */
    public fillConfig(config?: Config): Config {
        config = config || {}
        return {
            debug: config.debug ? true : false,
            connection: config.connection || undefined,
            engine: config.engine ? config.engine : Engines.PostgreSQL,
            driver: config.driver ? config.driver : Drivers.DataAPI,
            settings: {
                consistentReturn: config.settings && !config.settings.consistentReturn ? false : true,
            },
            computed: {
                regularQuotes: config.engine === Engines.PostgreSQL ? '"' : '`',
            },
        }
    }
    /**
     * Set config.
     *
     * @todo Make private after improve joins
     * @param config Config
     */
    public setConfig(config?: Config): this {
        config = config || {}
        this.config = this.fillConfig(config)
        this.selectStatement = new Select(this, this.fillConfig(config))
        this.selectStatement = new Select(this, this.fillConfig(config))
        this.insertStatement = new Insert(this, this.fillConfig(config))
        this.deleteStatement = new Delete(this, this.fillConfig(config))
        this.updateStatement = new Update(this, this.fillConfig(config))
        return this
    }

    /**
     * Current table name.
     *
     * @return string
     */
    public getTableName(): string {
        return this.tableName
    }

    /**
     * Current table is safe.
     *
     * @return boolean
     */
    public isSafe(): boolean {
        return !this.unsafe
    }

    /**
     * Plain query
     *
     * Any query over any table can be done here
     *
     * Warnings:
     * - Field privacity or data integrity will not apply to a direct query, you are responsable for the data security.
     *
     * @var sql SQL query
     * @var values Values to replace in the query
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public query(query: ORMModelQuery): Promise<any> {
        const connection = this.config.connection

        if (typeof query.fields === 'undefined') {
            delete query.fields
        }

        if (this.config.debug) {
            console.log('Query:', JSON.stringify(query, null, 2))
        }

        if (!connection) {
            return Promise.resolve(query)
        } else {
            return connection.query(query)
        }
    }

    /**
     * Plain query
     *
     * Any query over any table can be done here
     *
     * Warnings:
     * - Field privacity or data integrity will not apply to a direct query, you are responsable for the data security.
     *
     * @var sql SQL query
     * @var values Values to replace in the query
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public querySelect(query: ORMModelQuery): Promise<any> {
        return this.query(query).then((data: any) => {
            return Promise.resolve(this.selectConsistentReturn(query.fields || [], data))
        })
    }

    /**
     * Format selected data for consistent return
     *
     * @var data Data from db engine.
     * @return Promise with query result
     */
    public selectConsistentReturn(keys: string[], data: any): ORMModelSelectReturn {
        const settings = this.config.settings

        if (settings && settings.consistentReturn) {
            if (this.config.driver === Drivers.DataAPI) {
                if (data.records && data.records.length) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cleanData: ORMModelSelectReturn = {
                        numberOfRecordsUpdated: data.numberOfRecordsUpdated,
                        records: [],
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any

                    data.records.forEach((row: any, rowIndex: number) => {
                        cleanData.records[rowIndex] = {}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        row.forEach((field: any, fieldIndex: number) => {
                            cleanData.records[rowIndex][keys[fieldIndex]] = Object.values(field)[0]
                        })
                    })
                    return cleanData
                }
            }
        }
        return data
    }

    /**
     * Get item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column names and direction E.g.: "id, name ASC"
     * @var groupBy String with column names E.g.: "id, name"
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get(select: ORMModelSelect): Promise<any> {
        return this.querySelect(
            this.selectStatement.select({
                fields: select.fields,
                where: select.where,
                groupBy: select.groupBy,
                orderBy: select.orderBy,
                limit: 1,
            }),
        ).then((data: any) => {
            if (data.length) {
                return Promise.resolve(data[0])
            } else {
                // Return unexecuted query
                return Promise.resolve(data)
            }
        })
    }

    /**
     * Get some item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column names and direction E.g.: "id, name ASC"
     * @var groupBy String with column names E.g.: "id, name"
     * @var limit Number of rows to retrieve
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getSome(select: ORMModelSelectLimit): Promise<any> {
        return this.querySelect(this.selectStatement.select(select))
    }

    /**
     * Get all items - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column names and direction E.g.: "id, name ASC"
     * @var groupBy String with column names E.g.: "id, name"
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getAll(select: ORMModelSelect): Promise<any> {
        return this.querySelect(this.selectStatement.select(select))
    }

    /**
     * Join a table
     *
     * Specify a field that needs to be joined
     *
     * Warning: It works only with select queries
     *
     * @var keyField Model foreign key
     * @var fields String array with names of fields to join
     * @var type Type of Join to apply E.g.: INNER, LEFT
     * @return Model
     */
    public join(joins: ORMModelJoin[]): ORMModel {
        this.joins = joins
        return this
    }

    // todo: remove after join refactor
    public getSelectFieldsSQL(fields: string | string[] | undefined, prefix?: boolean): string {
        return this.selectStatement.getSelectFieldsSQL(fields, prefix)
    }

    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public insert(data: ORMModelRow): Promise<any> {
        return this.query(this.insertStatement.insert(data))
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
        return this.query(this.updateStatement.update(update))
    }

    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    public delete(where: string | ORMModelKeyValue | ORMModelKeyValue[]): Promise<any> {
        return this.query(this.deleteStatement.delete(where))
    }
}
