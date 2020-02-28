export declare enum Drivers {
    'DataAPI' = 0,
    'Native' = 1
}
export declare enum Engines {
    'PostgreSQL' = 0,
    'MySQL' = 1
}
/*** Main configuration interface */
export interface Config {
    debug?: boolean;
    connection?: Connection;
    driver?: Drivers;
    engine?: Engines;
    settings?: Settings;
}
/*** Connection configuration interface. */
export interface Connection {
    query: any;
}
/*** Connection configuration interface. */
export interface Settings {
    consistentReturn: boolean;
}
