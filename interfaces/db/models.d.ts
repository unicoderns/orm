import { Fields } from "../../interfaces/db/fields";
export declare namespace Models {
    /**
     * Parent model row interface
     */
    interface Row {
        [key: string]: any;
    }
    /**
     * Key/Value object
     */
    interface KeyValue {
        [key: string]: string | number;
    }
    /**
     * Plain query
     * @var sql MySQL string query code
     * @var values Parameters to replace in the query
     */
    interface Query {
        sql: string;
        values: (string | number)[];
    }
    /**
     * Join declaration
     *
     * @var keyField Model foreign key
     * @var fields String array with names of fields to join
     * @var kind Type of Join to apply E.g.: INNER, LEFT
     */
    interface Join {
        keyField: Fields.ForeignKey;
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
    interface Select {
        fields?: string | string[];
        where?: string | KeyValue | KeyValue[];
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
    interface SelectLimit extends Select {
        limit?: number;
    }
    /**
     * Update declaration
     *
     * @var data object data to be update in the table
     * @var where Key/Value object used to filter the query, an array of Key/Value objects will generate a multiple filter separated by an "OR", a "*" string wildcard is required for security reasons if you want to match all rows.
     */
    interface Update {
        data: Row;
        where: string | KeyValue | KeyValue[];
    }
}
