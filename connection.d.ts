import { Config } from "./interfaces/config";
import { Promise } from "es6-promise";
import { Models } from "./interfaces/db/models";
import * as mysql from "mysql";
/**
* Unicoderns DB Connection
*/
export declare class DB {
    protected connections: mysql.Pool;
    config: Config;
    /**
     * Configuration methods
     *
     * Create a connection pool
     *
     * @var config system configuration file
     */
    constructor(config: Config);
    /**
     * Plain query
     *
     * @var sql MySQL query
     * @var params Object (key/value) with parameters to replace in the query
     * @return Promise with query result
     */
    query(query: Models.Query): Promise<any>;
}
