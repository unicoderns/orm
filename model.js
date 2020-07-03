"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORMModel = void 0;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./interfaces/config");
const enums_1 = require("./enums");
/**
 * Model Abstract
 */
class ORMModel {
    /**
     * Create a table object.
     *
     * @param config Config
     * @param privacy To get all fields (secrets included), you need to set privacy as "unsafe" explicitly, in that way we ensure that this will not be a security breach in any wrong future upgrade.
     */
    constructor(config, privacy) {
        this.tableName = 'dummyTable';
        this.config = {};
        this.unsafe = false;
        this.joins = [];
        this.specialFunctions = ['now()'];
        this.fields = {};
        this.secured = {};
        this.currentParamPosition = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.emptyValues = [];
        /**
         * Get field list for the table
         *
         * @param target Db table name.
         * @return Field map.
         */
        this.getFields = () => {
            if (this.unsafe) {
                return { ...this.fields, ...this.secured };
            }
            return this.fields;
        };
        this.setConfig(config);
        if (privacy == 'unsafe') {
            this.unsafe = true;
        }
    }
    /**
     * Restore shared params to original state
     */
    restore() {
        this.currentParamPosition = 0;
    }
    /**
     * Set config.
     *
     * @todo Make private after improve joins
     * @param config Config
     */
    setConfig(config) {
        config = config || {};
        this.config = {
            debug: config.debug ? true : false,
            connection: config.connection || undefined,
            engine: config.engine ? config.engine : config_1.Engines.PostgreSQL,
            driver: config.driver ? config.driver : config_1.Drivers.DataAPI,
            settings: {
                consistentReturn: config.settings && !config.settings.consistentReturn ? false : true,
            },
        };
        return this;
    }
    /**
     * Current table name.
     *
     * @return string
     */
    getTableName() {
        return this.tableName;
    }
    /**
     * Current table is safe.
     *
     * @return boolean
     */
    isSafe() {
        return !this.unsafe;
    }
    /**
     * Convert a field keys into array.
     */
    fieldsInArray(target) {
        const keys = [];
        if (typeof target !== 'undefined') {
            Object.keys(target).forEach(key => {
                const alias = target[key].alias;
                if (typeof alias !== 'undefined' && alias != key) {
                    keys.push(`${key} AS ${alias}`);
                }
                else {
                    keys.push(key);
                }
            });
        }
        else {
            console.error(chalk_1.default.red('No fields in the model'));
        }
        return keys;
    }
    /**
     * Filter target fields if don't exists in model.
     */
    filterFields(target, scope) {
        const keys = [];
        if (typeof scope !== 'undefined') {
            target.forEach(item => {
                if (typeof scope[item] !== 'undefined') {
                    keys.push(item);
                }
            });
        }
        else {
            console.error(chalk_1.default.red('No fields in the model'));
        }
        return keys;
    }
    /**
     * Log if keys don't exists in model.
     */
    logMissingFields(target, scope) {
        if (typeof scope !== 'undefined') {
            target.forEach(item => {
                // Validation for joined table not available yet.
                const joinkeys = item.split('__');
                if (joinkeys.length == 1) {
                    if (typeof scope[item] === 'undefined') {
                        console.error(chalk_1.default.yellow(`${item} field doesn't exists!`));
                    }
                }
            });
        }
        else {
            console.error(chalk_1.default.red('No fields in the model'));
        }
    }
    /**
     * Clean and validate a select if is need it
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    getSelectFieldsSQL(fields, prefix) {
        let fieldsSQL = '';
        let selectableFields = [];
        const modelFields = this.getFields();
        const config = this.config;
        if (typeof fields === 'string') {
            return fields;
        }
        else {
            // Check if is an array or just SQL code
            if (Array.isArray(fields) && fields.length) {
                if (config.debug) {
                    this.logMissingFields(fields, modelFields);
                }
                selectableFields = this.filterFields(fields, modelFields);
            }
            else {
                selectableFields = this.fieldsInArray(modelFields);
            }
        }
        if (typeof prefix == 'undefined') {
            fieldsSQL = `${this.tableName}.`;
            fieldsSQL = fieldsSQL + selectableFields.join(`, ${this.tableName}.`);
        }
        else {
            const formatedFields = [];
            selectableFields.forEach((field) => {
                formatedFields.push(`${this.tableName}.${field} AS ${this.tableName}__${field}`);
            });
            fieldsSQL = formatedFields.join(', ');
        }
        return fieldsSQL;
    }
    /**
     * Generates a select string from the Join configuration
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    getJoinSelectFieldsSQL() {
        const joins = this.joins;
        const joinsStringArray = [];
        let joinsSQL = '';
        const config = this.config;
        if (typeof joins !== 'undefined' && joins.length) {
            joins.forEach((join) => {
                if (typeof join.fields !== 'undefined') {
                    joinsStringArray.push(join.keyField.model.setConfig(config).getSelectFieldsSQL(join.fields, true));
                }
                else {
                    joinsStringArray.push('ERROR;');
                }
            });
            joinsSQL = joinsStringArray.join(', ');
            joinsSQL = `, ${joinsSQL}`;
        }
        return joinsSQL;
    }
    /**
     * Generate join sql code
     *
     * @return String with the where sql code
     */
    generateJoinCode() {
        const joins = this.joins;
        const joinsStringArray = [];
        let joinsSQL = '';
        if (joins.length) {
            joins.forEach((join) => {
                const linkedTableName = join.keyField.model.tableName;
                // eslint-disable-next-line prettier/prettier
                const sql = ` ${join.type.toUpperCase()} JOIN ${linkedTableName} ON ${this.tableName}.${join.keyField.localField} = ${linkedTableName}.${join.keyField.linkedField}`;
                joinsStringArray.push(sql);
            });
            joinsSQL = joinsStringArray.join(' ');
        }
        return joinsSQL;
    }
    /////////////////////////////////////////////////////////////////////
    // Validate and transform value against model type
    // Only for DataApi so far.
    // Join could only be an INT.
    /////////////////////////////////////////////////////////////////////
    validateAndTransform(key, value) {
        const joinkeys = key.split('__');
        // Join is always INT
        if (joinkeys.length == 2) {
            return {
                name: key,
                value: { longValue: value },
            };
        }
        if (this.fields[key]) {
            const type = this.fields[key].type;
            if (type === enums_1.ORMSupportedFields.BOOL) {
                return {
                    name: key,
                    value: { booleanValue: value ? true : false },
                };
            }
            else if (type === enums_1.ORMSupportedFields.INT ||
                type === enums_1.ORMSupportedFields.TINYINT ||
                type === enums_1.ORMSupportedFields.SMALLINT ||
                type === enums_1.ORMSupportedFields.BIGINT) {
                return {
                    name: key,
                    value: { longValue: value },
                };
            }
            else if (type === enums_1.ORMSupportedFields.FLOAT ||
                type === enums_1.ORMSupportedFields.REAL ||
                type === enums_1.ORMSupportedFields.DOUBLE) {
                return {
                    name: key,
                    value: { doubleValue: value },
                };
            }
            else if (type === enums_1.ORMSupportedFields.BLOB ||
                type === enums_1.ORMSupportedFields.BINARY ||
                type === enums_1.ORMSupportedFields.LONGVARBINARY ||
                type === enums_1.ORMSupportedFields.VARBINARY) {
                return {
                    name: key,
                    value: { blobValue: value },
                };
            }
            // ORMSupportedFields.DECIMAL, Clob?, Date, Hour
            return {
                name: key,
                value: { stringValue: value },
            };
        }
        return { [key]: value };
    }
    /////////////////////////////////////////////////////////////////////
    // Generate "AND" chained where sql code
    // @return string
    /////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateWhereCodeChain(where) {
        const values = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj = [];
        const keys = [];
        let filteredKeys = [];
        // let modelFields = this.getFields();
        // let config: Config = this.config;
        for (const key in where) {
            keys.push(key);
            if (this.config.driver === config_1.Drivers.DataAPI) {
                let value;
                if (typeof where[key].value === 'undefined') {
                    value = where[key];
                }
                else {
                    value = where[key].value;
                }
                const joinkeys = String(value).split('__');
                if (String(value).charAt(0) !== '\\' &&
                    joinkeys.length !== 2 &&
                    this.specialFunctions.indexOf(value) < 0) {
                    valuesObj.push(this.validateAndTransform(key, value));
                }
            }
        }
        filteredKeys = keys;
        // ToDo: Rewrite where keys to be able to test them
        // if (config.debug) {
        //    this.logMissingFields(keys, modelFields);
        // }
        // filteredKeys = this.filterFields(keys, modelFields);
        if (typeof where !== 'undefined') {
            let sql = '';
            filteredKeys.forEach((item, index, array) => {
                let operator = '=';
                if (typeof where[item].operator !== 'undefined') {
                    operator = where[item].operator;
                    where[item] = where[item].value;
                }
                if (String(where[item]).charAt(0) == '\\') {
                    sql = `${sql + this.tableName}.${item} ${operator} ${String(where[item]).substring(1)}`;
                }
                else {
                    let joinkeys = item.split('__');
                    // string literal
                    if (joinkeys.length == 2) {
                        sql = `${sql + joinkeys[0]}.${joinkeys[1]}`;
                    }
                    else {
                        sql = `${sql + this.tableName}.${item}`;
                    }
                    joinkeys = String(where[item]).split('__');
                    // joined column
                    if (joinkeys.length == 2) {
                        sql = `${sql} ${operator} ${joinkeys[0]}.${joinkeys[1]}`;
                    }
                    else {
                        // special functiom
                        if (this.specialFunctions.indexOf(where[item]) >= 0) {
                            sql = `${sql} ${operator} ${where[item]}`;
                        }
                        else {
                            if (this.config.driver === config_1.Drivers.DataAPI) {
                                sql = `${sql} ${operator} :${item}`;
                            }
                            else if (this.config.engine === config_1.Engines.PostgreSQL) {
                                sql = `${sql} ${operator} $${++this.currentParamPosition}`;
                            }
                            else if (this.config.engine === config_1.Engines.MySQL) {
                                sql = `${sql} ${operator} ?`;
                            }
                            else {
                                sql = `${sql} ENGINE NOT SUPPORTED`;
                            }
                        }
                    }
                }
                if (index < array.length - 1) {
                    sql = `${sql} AND `;
                }
            });
            if (this.config.driver === config_1.Drivers.DataAPI) {
                return {
                    sql: sql,
                    values: valuesObj,
                };
            }
            else {
                // getting values
                filteredKeys.forEach((item) => {
                    const joinkeys = String(where[item]).split('__');
                    if (String(where[item]).charAt(0) != '\\' &&
                        joinkeys.length != 2 &&
                        this.specialFunctions.indexOf(where[item]) < 0) {
                        values.push(where[item]);
                    }
                });
                return {
                    sql: sql,
                    values: values,
                };
            }
        }
        else {
            return {
                sql: '',
                values: this.emptyValues,
            };
        }
    }
    /**
     * Generate where sql code
     *
     * @var where Array of key/value objects with the conditions
     * @return String with the where sql code
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateWhereCode(where) {
        if (where == '*') {
            return {
                sql: '',
                values: this.emptyValues,
            };
        }
        else if (typeof where === 'string' || (Array.isArray(where) && !where.length)) {
            return {
                sql: 'ERROR',
                values: this.emptyValues,
            };
        }
        else {
            let generated = {
                sql: '',
                values: this.emptyValues,
            };
            if (Array.isArray(where)) {
                let values = [];
                const SQLChains = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let valuesObj = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                where.forEach((chain) => {
                    const localChain = this.generateWhereCodeChain(chain);
                    valuesObj = valuesObj.concat(localChain.values);
                    values = values.concat(localChain.values);
                    SQLChains.push(localChain.sql);
                });
                generated.sql = `(${SQLChains.join(') OR (')})`;
                if (this.config.driver === config_1.Drivers.DataAPI) {
                    generated.values = valuesObj;
                }
                else {
                    generated.values = values;
                }
            }
            else {
                generated = this.generateWhereCodeChain(where);
            }
            if (generated.sql) {
                generated.sql = ` WHERE ${generated.sql}`;
                return generated;
            }
            else {
                return generated;
            }
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
    query(query) {
        const connection = this.config.connection;
        if (this.config.debug) {
            console.log('Query:', JSON.stringify(query, null, 2));
        }
        if (!connection) {
            return Promise.resolve(query);
        }
        else {
            return connection.query(query);
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
    select(select) {
        this.restore();
        const fieldsSQL = this.getSelectFieldsSQL(select.fields);
        const joinFieldsSQL = this.getJoinSelectFieldsSQL();
        const joinCode = this.generateJoinCode();
        const whereCode = this.generateWhereCode(select.where);
        const groupBy = select.groupBy;
        const orderBy = select.orderBy;
        const limit = select.limit;
        let extra = '';
        if (typeof groupBy !== 'undefined' && groupBy !== null) {
            extra += ` GROUP BY ${groupBy}`;
        }
        if (typeof orderBy !== 'undefined' && orderBy !== null) {
            extra += ` ORDER BY ${orderBy}`;
        }
        if (typeof limit !== 'undefined' && limit !== null) {
            extra += ` LIMIT ${limit}`;
        }
        const sql = `SELECT ${fieldsSQL}${joinFieldsSQL} FROM ${this.tableName}${joinCode}${whereCode.sql}${extra};`;
        this.joins = [];
        const query = { sql };
        if (this.config.driver === config_1.Drivers.DataAPI) {
            query.parameters = whereCode.values || [];
        }
        else {
            query.values = whereCode.values;
        }
        const keyArray = String(fieldsSQL + joinFieldsSQL).split(', ');
        const keys = [];
        keyArray.forEach(key => {
            let temp = key.split(' AS ');
            if (temp.length === 2) {
                keys.push(temp[1]);
            }
            else {
                temp = key.split('.');
                keys.push(temp[1]);
            }
        });
        return this.query(query).then((data) => {
            return Promise.resolve(this.selectConsistentReturn(keys, data));
        });
    }
    /**
     * Format selected data for consistent return
     *
     * @var data Data from db engine.
     * @return Promise with query result
     */
    selectConsistentReturn(keys, data) {
        const settings = this.config.settings;
        if (settings && settings.consistentReturn) {
            if (this.config.driver === config_1.Drivers.DataAPI) {
                if (data.records && data.records.length) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const cleanData = {
                        numberOfRecordsUpdated: data.numberOfRecordsUpdated,
                        records: [],
                    };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    data.records.forEach((row, rowIndex) => {
                        cleanData.records[rowIndex] = {};
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        row.forEach((field, fieldIndex) => {
                            cleanData.records[rowIndex][keys[fieldIndex]] = Object.values(field)[0];
                        });
                    });
                    return cleanData;
                }
            }
        }
        return data;
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
    get(select) {
        return this.select({
            fields: select.fields,
            where: select.where,
            groupBy: select.groupBy,
            orderBy: select.orderBy,
            limit: 1,
        }).then((data) => {
            if (data.length) {
                return Promise.resolve(data[0]);
            }
            else {
                // Return unexecuted query
                return Promise.resolve(data);
            }
        });
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
    getSome(select) {
        return this.select(select);
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
    getAll(select) {
        return this.select(select);
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
    join(joins) {
        this.joins = joins;
        return this;
    }
    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insert(data) {
        this.restore();
        const fields = [];
        const wildcards = [];
        const values = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj = [];
        for (const key in data) {
            const value = data[key];
            fields.push(key);
            values.push(value);
            valuesObj.push(this.validateAndTransform(key, value));
            if (this.config.driver === config_1.Drivers.DataAPI) {
                wildcards.push(`:${key}`);
            }
            else if (this.config.engine === config_1.Engines.PostgreSQL) {
                wildcards.push(`$${++this.currentParamPosition}`);
            }
            else if (this.config.engine === config_1.Engines.MySQL) {
                wildcards.push('?');
            }
            else {
                wildcards.push('ENGINE NOT SUPPORTED');
            }
        }
        const query = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${wildcards.join(', ')});`;
        if (this.config.driver === config_1.Drivers.DataAPI) {
            return this.query({ sql: query, parameters: valuesObj });
        }
        else {
            return this.query({ sql: query, values: values });
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
    update(update) {
        this.restore();
        const fields = [];
        const values = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const valuesObj = [];
        let unifiedValues = [];
        const joinCode = this.generateJoinCode();
        const data = update.data;
        const where = update.where;
        for (const key in data) {
            const joinkeys = String(data[key]).split('__');
            if (joinkeys.length === 2) {
                fields.push(`${this.tableName}.${key} = ${joinkeys[0]}.${joinkeys[1]}`);
            }
            else if (this.specialFunctions.indexOf(data[key]) >= 0) {
                fields.push(`${this.tableName}.${key} = ${data[key]}`);
            }
            else {
                valuesObj.push(this.validateAndTransform(key, data[key]));
                values.push(data[key]);
                if (this.config.driver === config_1.Drivers.DataAPI) {
                    fields.push(`${this.tableName}.${key} = :${key}`);
                }
                else if (this.config.engine === config_1.Engines.PostgreSQL) {
                    fields.push(`${this.tableName}.${key} = $${++this.currentParamPosition}`);
                }
                else if (this.config.engine === config_1.Engines.MySQL) {
                    fields.push(`${this.tableName}.${key} = ?`);
                }
                else {
                    fields.push('ENGINE NOT SUPPORTED');
                }
            }
        }
        let whereCode;
        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            whereCode = {
                sql: 'ERROR',
                values: this.emptyValues,
            };
        }
        else {
            whereCode = this.generateWhereCode(where);
        }
        const query = `UPDATE ${this.tableName}${joinCode} SET ${fields.join(', ')}${whereCode.sql};`;
        if (this.config.driver === config_1.Drivers.DataAPI) {
            return this.query({ sql: query, parameters: valuesObj.concat(whereCode.values) });
        }
        else {
            unifiedValues = values.concat(whereCode.values);
            return this.query({ sql: query, values: unifiedValues });
        }
    }
    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete(where) {
        this.restore();
        let whereCode;
        const joinCode = this.generateJoinCode();
        if (typeof where === 'undefined' || (!Array.isArray(where) && !Object.keys(where).length)) {
            whereCode = {
                sql: 'ERROR',
                values: this.emptyValues,
            };
        }
        else {
            whereCode = this.generateWhereCode(where);
        }
        const query = `DELETE FROM ${this.tableName}${joinCode}${whereCode.sql};`;
        if (this.config.driver === config_1.Drivers.DataAPI) {
            return this.query({ sql: query, parameters: whereCode.values });
        }
        else {
            return this.query({ sql: query, values: whereCode.values });
        }
    }
}
exports.ORMModel = ORMModel;
//# sourceMappingURL=model.js.map