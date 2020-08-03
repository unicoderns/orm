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

import { ORMCommonFields, ORMSupportedFields } from '../enums'
import { ORMGeneralFieldType } from '../interfaces/db/types'

/**
 * ORM DB Datatypes
 */
export abstract class ORMDatatype {
    protected primaryKey: boolean
    protected notNull: boolean
    protected unique: boolean
    protected unsigned: boolean
    protected zeroFill: boolean
    protected autoincrement: boolean
    protected generated: boolean
    protected alias: string | undefined
    protected protected: boolean
    protected private: boolean
    protected size: number
    protected abstract type: ORMSupportedFields

    constructor(settings: ORMGeneralFieldType) {
        this.primaryKey = settings.primaryKey || false
        this.notNull = settings.notNull || false
        this.unique = settings.unique || false
        // this.binary = settings.binary || false
        this.unsigned = settings.unsigned || false
        this.zeroFill = settings.zeroFill || false
        this.autoincrement = settings.autoincrement || false
        this.generated = settings.generated || false
        this.alias = settings.alias || undefined
        this.protected = settings.protected || false
        this.private = settings.private || false
        this.size = settings.size || 0
    }

    public getConfig(): ORMCommonFields {
        const type: ORMGeneralFieldType = {
            type: this.type,
            primaryKey: this.primaryKey,
            notNull: this.notNull,
            unique: this.unique,
            // binary: this.binary,
            unsigned: this.unsigned,
            zeroFill: this.zeroFill,
            autoincrement: this.autoincrement,
            generated: this.generated,
            alias: this.alias,
            protected: this.protected,
            size: this.size,
            private: this.private,
        }

        return type
    }
}
