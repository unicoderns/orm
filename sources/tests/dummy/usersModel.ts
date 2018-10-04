////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns SA - info@unicoderns.com - unicoderns.com               //
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

import { field, secret } from "../../decorators"
import { Defaults } from "../../interfaces/db/defaults"
import { Datatypes } from "../../datatypes"
import { Model } from "../../model"

export interface Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
}

/**
 * User Model
 */
export class Users extends Model {

    @field()
    public id = new Datatypes().ID();

    @field()
    public created = new Datatypes().TIMESTAMP({
        notNull: true,
        default: Defaults.Timestamp.CURRENT_TIMESTAMP
    });

    @field()
    public username = new Datatypes().VARCHAR({
        size: 45,
        unique: true
    });

    @field()
    public email = new Datatypes().VARCHAR({
        notNull: true,
        size: 45,
        unique: true
    });

    @secret()
    public password = new Datatypes().CHAR({
        notNull: true,
        size: 60
    });

    @secret("added_salt")
    public salt = new Datatypes().VARCHAR({
        notNull: true,
        size: 20
    });

    @field("first_name")
    public firstName = new Datatypes().VARCHAR({
        size: 45
    });

    @field("last_name")
    public lastName = new Datatypes().VARCHAR({
        size: 45
    });

    @field()
    public admin = new Datatypes().BOOL();

    @field()
    public verified = new Datatypes().BOOL();

    @field()
    public active = new Datatypes().BOOL();

}