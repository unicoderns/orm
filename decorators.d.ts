/**
 * Get field map for a table
 *
 * @param target Db table name.
 * @return Field map.
 */
export declare function getList(target: string): Map<string, Map<string, string>>;
/**
 * Public field decorator
 *
 * @param alias Optional alias for the field.
 * @param target Db table name.
 * @param key Field name.
 */
export declare function field(alias?: string): (target: any, key: string) => void;
/**
 * Secret field decorator
 *
 * @param alias Optional alias for the field.
 * @param target Db table name.
 * @param key Field name.
 */
export declare function secret(alias?: string): (target: any, key: string) => void;
