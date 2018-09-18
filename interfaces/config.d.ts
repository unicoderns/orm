/*** Main configuration interface */
export interface Config {
    dev: boolean;
    connection: Connection;
}
/*** Connection configuration interface. */
export interface Connection {
    user: string;
    password: string;
    database: string;
    port: number;
    host: string;
    connectionLimit: number;
    validations: ValidationSettings;
}
/*** Validation settings interface. */
export interface ValidationSettings {
    fields: boolean;
}
