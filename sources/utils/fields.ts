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

import chalk from 'chalk'

import { ORMAllowedFields } from '../enums'
import { ORMModel, Config } from '..'

/**
 * Model Abstract
 */
export class FieldsUtils {
    protected model: ORMModel
    private regularQuotes = '"'

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config?: Config) {
        this.model = model
        this.regularQuotes = config && config.computed ? config.computed.regularQuotes : '"'
    }

    /**
     * Convert a field keys into array.
     */
    public toArray(target: ORMAllowedFields): string[] {
        const keys: string[] = []

        if (typeof target !== 'undefined') {
            Object.keys(target).forEach((key) => {
                const alias = target[key].alias

                if (typeof alias !== 'undefined' && alias != key) {
                    // RegularQuotes need to be removed from this file
                    keys.push(`${key + this.regularQuotes} AS ${this.regularQuotes + alias}`)
                } else {
                    keys.push(key)
                }
            })
        } else {
            console.error(chalk.red('No fields in the model'))
        }
        return keys
    }

    /**
     * Filter target fields if don't exists in model.
     */
    public filter(target: string[], scope: ORMAllowedFields): string[] {
        const keys: string[] = []

        if (typeof scope !== 'undefined') {
            target.forEach((item) => {
                if (typeof scope[item] !== 'undefined') {
                    keys.push(item)
                }
            })
        } else {
            console.error(chalk.red('No fields in the model'))
        }
        return keys
    }

    /**
     * Log if keys don't exists in model.
     */
    public logMissing(target: string[], scope: ORMAllowedFields): void {
        if (typeof scope !== 'undefined') {
            target.forEach((item) => {
                // Validation for joined table not available yet.
                const joinkeys = item.split('__')

                if (joinkeys.length == 1) {
                    if (typeof scope[item] === 'undefined') {
                        console.error(chalk.yellow(`${item} field doesn't exists!`))
                    }
                }
            })
        } else {
            console.error(chalk.red('No fields in the model'))
        }
    }
}