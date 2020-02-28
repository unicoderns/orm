import { ORMForeignKeyField } from '../../enums';
/**
 * Parent model row interface
 */
export interface ORMModelRow {
    [key: string]: any;
}
/**
 * Key/Value object
 */
export interface ORMModelKeyValue {
    [key: string]: string | number | boolean | ORMModelOperatorValue;
}
/**
 * Operator/Value object
 */
export interface ORMModelOperatorValue {
    [operator: string]: string | number;
}
/**
 * Plain query
 * @var sql SQL string query code
 * @var values? Parameters to replace in the query
 * @var parameters? Parameters to replace in the query for DataApi
 */
export interface ORMModelQuery {
    sql: string;
    values?: (string | number)[] | Record<string, any>;
    parameters?: (string | number)[] | Record<string, any>;
}
/**
 * Join declaration
 *
 * @var keyField Model foreign key
 * @var fields String array with names of fields to join
 * @var kind Type of Join to apply E.g.: INNER, LEFT
 */
export interface ORMModelJoin {
    keyField: ORMForeignKeyField;
    fields?: string[];
    kind: string;
}
/**
 * Select declaration
 *
 * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
 * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
 * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
 * @var orderBy String with column_name and direction E.g.: "id, name ASC"
 * @var groupBy String with column_name E.g.: "id, name"
 */
export interface ORMModelSelect {
    fields?: string | string[];
    where?: string | ORMModelKeyValue | ORMModelKeyValue[];
    groupBy?: string;
    orderBy?: string;
}
/**
 * Select declaration with limit
 *
 * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
 * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
 * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
 * @var orderBy String with column_name and direction E.g.: "id, name ASC"
 * @var groupBy String with column_name E.g.: "id, name"
 * @var limit Number of rows to retrieve
 */
export interface ORMModelSelectLimit extends ORMModelSelect {
    limit?: number;
}
/**
 * Select declaration with limit
 *
 * @var fields If is NOT set "*" will be used, if there's a string then it will be used as is, a plain query will be
 * executed, if in the other hand an array is provided (Recommended), then it will filter the keys and run the query.
 * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR".
 * @var orderBy String with column_name and direction E.g.: "id, name ASC"
 * @var groupBy String with column_name E.g.: "id, name"
 * @var limit Number of rows to retrieve
 */
export interface ORMModelSelectReturn {
    numberOfRecordsUpdated: number;
    records: any[];
}
/**
 * Update declaration
 *
 * @var data object data to be update in the table
 * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
 */
export interface ORMModelUpdate {
    data: ORMModelRow;
    where: string | ORMModelKeyValue | ORMModelKeyValue[];
}
