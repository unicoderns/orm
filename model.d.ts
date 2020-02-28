import { Promise } from 'es6-promise';
import { ORMModelJoin, ORMModelQuery, ORMModelSelectLimit, ORMModelSelect, ORMModelRow, ORMModelUpdate, ORMModelKeyValue, ORMModelSelectReturn } from './interfaces';
import { Config } from './interfaces/config';
import { ORMAllowedFields } from './enums';
/**
 * Model Abstract
 */
export declare class ORMModel {
    protected tableName: string;
    protected config: Config;
    private unsafe;
    private joins;
    private specialFunctions;
    readonly fields: ORMAllowedFields;
    readonly secured: ORMAllowedFields;
    private currentParamPosition;
    private emptyValues;
    /**
     * Create a table object.
     *
     * @param config Config
     * @param privacy To get all fields (secrets included), you need to set privacy as "unsafe" explicitly, in that way we ensure that this will not be a security breach in any wrong future upgrade.
     */
    constructor(config?: Config, privacy?: string);
    /**
     * Restore shared params to original state
     */
    private restore;
    /**
     * Set config.
     *
     * @todo Make private after improve joins
     * @param config Config
     */
    protected setConfig(config?: Config): this;
    /**
     * Current table name.
     *
     * @return string
     */
    getTableName(): string;
    /**
     * Current table is safe.
     *
     * @return boolean
     */
    isSafe(): boolean;
    /**
     * Get field list for the table
     *
     * @param target Db table name.
     * @return Field map.
     */
    getFields: () => ORMAllowedFields;
    /**
     * Convert a field keys into array.
     */
    private fieldsInArray;
    /**
     * Filter target fields if don't exists in model.
     */
    private filterFields;
    /**
     * Log if keys don't exists in model.
     */
    private logMissingFields;
    /**
     * Clean and validate a select if is need it
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private getSelectFieldsSQL;
    /**
     * Generates a select string from the Join configuration
     *
     * @var fields String array with field names.
     * @return Object cointaining the SQL and a field report
     */
    private getJoinSelectFieldsSQL;
    /**
     * Generate join sql code
     *
     * @return String with the where sql code
     */
    private generateJoinCode;
    private validateAndTransform;
    private generateWhereCodeChain;
    /**
     * Generate where sql code
     *
     * @var where Array of key/value objects with the conditions
     * @return String with the where sql code
     */
    private generateWhereCode;
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
    query(query: ORMModelQuery): Promise<any>;
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
    private select;
    /**
     * Format selected data for consistent return
     *
     * @var data Data from db engine.
     * @return Promise with query result
     */
    selectConsistentReturn(keys: string[], data: any): ORMModelSelectReturn;
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
    get(select: ORMModelSelect): Promise<any>;
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
    getSome(select: ORMModelSelectLimit): Promise<any>;
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
    getAll(select: ORMModelSelect): Promise<any>;
    /**
     * Join a table
     *
     * Specify a field that needs to be joined
     *
     * Warning: It works only with select queries
     *
     * @var keyField Model foreign key
     * @var fields String array with names of fields to join
     * @var kind Type of Join to apply E.g.: INNER, LEFT
     * @return Model
     */
    join(joins: ORMModelJoin[]): ORMModel;
    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    insert(data: ORMModelRow): Promise<any>;
    /**
     * Update query
     *
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    update(update: ORMModelUpdate): Promise<any>;
    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    delete(where: string | ORMModelKeyValue | ORMModelKeyValue[]): Promise<any>;
}
