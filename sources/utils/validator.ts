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

import { Config } from '../interfaces'
import { ORMSupportedFields, ORMAllowedFields } from '../enums/db/fields'

/**
 * Model Abstract
 */
export class ValidatorUtils {
    private config: Config = {} // ToDo: move all config to file

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(config: Config) {
        this.config = config
    }

    /////////////////////////////////////////////////////////////////////
    // Validate and transform value against model type
    // Only for DataApi so far.
    // Join could only be an INT.
    /////////////////////////////////////////////////////////////////////
    public transform({
        fields,
        key,
        value,
    }: {
        fields: ORMAllowedFields
        key: string
        value: string | number
    }): { name: string; value: { [key: string]: string | number } } | string {
        const joinkeys = key.split('__')

        if (joinkeys.length == 2) {
            return {
                name: key,
                value: { longValue: value },
            }
        }

        if (fields[key]) {
            const type = fields[key].type

            if (type === ORMSupportedFields.BOOL) {
                return {
                    name: key,
                    value: { booleanValue: value },
                }
            } else if (
                type === ORMSupportedFields.INT ||
                type === ORMSupportedFields.TINYINT ||
                type === ORMSupportedFields.SMALLINT ||
                type === ORMSupportedFields.BIGINT
            ) {
                return {
                    name: key,
                    value: { longValue: value },
                }
            } else if (
                type === ORMSupportedFields.FLOAT ||
                type === ORMSupportedFields.REAL ||
                type === ORMSupportedFields.DOUBLE
            ) {
                return {
                    name: key,
                    value: { doubleValue: value },
                }
            } else if (
                type === ORMSupportedFields.BLOB ||
                type === ORMSupportedFields.BINARY ||
                type === ORMSupportedFields.LONGVARBINARY ||
                type === ORMSupportedFields.VARBINARY
            ) {
                return {
                    name: key,
                    value: { blobValue: value },
                }
            }
            // ORMSupportedFields.DECIMAL, Clob?, Date, Hour
            return {
                name: key,
                value: { stringValue: value },
            }
        }

        throw new Error(`Type transformation for: ${key}.`)
    }
}
