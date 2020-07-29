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
import { ORMTimestampDefault } from '../../enums'

export interface Row {
    id?: number
    created?: number
    username: string
    email: string
    password: string
    salt: string
    firstName?: string
    lastName?: string
    admin?: boolean
    verified?: boolean
    active?: boolean
}

/**
 * User Model
 */
export class UsersTwo extends ORMModel {
    public tableName = 'usersTwo'

    public readonly fields = {
        id: new ORMDatatypes().ID(),
        created: new ORMDatatypes().TIMESTAMP({
            notNull: true,
            default: ORMTimestampDefault.CURRENT_TIMESTAMP,
        }),
        username: new ORMDatatypes().VARCHAR({
            size: 45,
            unique: true,
        }),
        // ToDo: Specify the localField looks redundant
        user: new ORMDatatypes().FOREIGNKEY('user', 'id', new usersModel.Users(), {
            notNull: true,
            unique: true,
        }),
    }
}
