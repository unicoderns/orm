import { Promise } from "es6-promise";
import { Models } from "./interfaces/db/models";
import { DB } from "./connection";
/**
 * Model Abstract
 */
export declare class Model {
    private tableName;
    protected DB: DB;
    private unsafe;
    private fields;
    private joins;
    private plainQuery;
    /**
     * Create a table object.
     *
     * @param jsloth Core library
     * @param privacy To get all fields (secrets included), you need to set privacy as "unsafe" explicitly, in that way we ensure that this will not be a security breach in any wrong future upgrade.
     */
    constructor(DB: DB, privacy?: string);
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
     * Avoid query execution and return models query instead.
     */
    returnQuery(): Model;
    /**
     * Create cache and return the model field list.
     *
     * If this.unsafe is set then merge public with secret fields.
     *
     * @return Fields Mapped
     */
    getFields(): Map<string, string> | undefined;
    /**
     * Convert a map in a array.
     */
    private mapInArray;
    /**
     * Filter one array if keys don't exists in other array.
     */
    private filterArrayInArray;
    /**
     * Log if keys don't exists in other array.
     */
    private logArrayInArray;
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
     * @var sql MySQL query
     * @var values Values to replace in the query
     * @return Promise with query result
     */
    query(query: Models.Query): Promise<any>;
    /**
     * Select private query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
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
     * Get item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @return Promise with query result
     */
    get(select: Models.Select): Promise<any>;
    /**
     * Get some item - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @var limit Number of rows to retrieve
     * @return Promise with query result
     */
    getSome(select: Models.SelectLimit): Promise<any>;
    /**
     * Get all items - Select query
     *
     * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
     * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @var orderBy String with column_name and direction E.g.: "id, name ASC"
     * @var groupBy String with column_name E.g.: "id, name"
     * @return Promise with query result
     */
    getAll(select: Models.Select): Promise<any>;
    /**
     * Join a table
     *
     * Specify a field that needs to be joined
     *
     * Warning: It works only with select requests
     *
     * @var keyField Model foreign key
     * @var fields String array with names of fields to join
     * @var kind Type of Join to apply E.g.: INNER, LEFT
     * @return Model
     */
    join(join: Models.Join): Model;
    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    insert(data: Models.Row): Promise<any>;
    /**
     * Update query
     *
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
     * @return Promise with query result
     */
    update(update: Models.Update): Promise<any>;
    /**
     * Delete query
     *
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     * @return Promise with query result
     */
    delete(where: string | Models.KeyValue | Models.KeyValue[]): Promise<any>;
}
