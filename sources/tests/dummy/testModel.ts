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

import * as usersModel from './usersModel'

import { ORMModel } from '../..'
import { ORMDatatypes } from '../../datatypes'

export interface Row {
    tinyint: number
    smallint: number
    int: number
    id: number
    foreignkey: number
    statickey: number
    float: number
    double: number
    decimal: number
    char: string
    varchar: string
    tinytext: string
    text: string
    longtext: string
    bool: boolean
    year: number
    date: number
    time: number
    datetime: number
    timestamp: number
}

/**
 * Test Model
 */
export class Test extends ORMModel {
    public tableName = 'test'

    public readonly fields = {
        tinyint: new ORMDatatypes().TINYINT(),
        smallint: new ORMDatatypes().SMALLINT(),
        int: new ORMDatatypes().INT(),
        id: new ORMDatatypes().ID(),
        // ToDo: Specify the localField looks redundant
        foreignkey: new ORMDatatypes().FOREIGNKEY('user', 'id', new usersModel.Users(), {
            notNull: true,
            unique: true,
        }),
        statickey: new ORMDatatypes().STATICKEY({}),
        float: new ORMDatatypes().FLOAT(),
        double: new ORMDatatypes().DOUBLE(),
        decimal: new ORMDatatypes().DECIMAL(),
        char: new ORMDatatypes().CHAR(),
        varchar: new ORMDatatypes().VARCHAR(),
        tinytext: new ORMDatatypes().TINYTEXT(),
        text: new ORMDatatypes().TEXT(),
        longtext: new ORMDatatypes().LONGTEXT(),
        bool: new ORMDatatypes().BOOL(),
        year: new ORMDatatypes().YEAR(),
        date: new ORMDatatypes().DATE(),
        time: new ORMDatatypes().TIME(),
        datetime: new ORMDatatypes().DATETIME(),
        timestamp: new ORMDatatypes().TIMESTAMP(),
    }
}
