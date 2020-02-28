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

import { ORMTimestampDefault, ORMBinaryDefault } from './defaults'
import { ORMModel } from '../../model'

export enum ORMSupportedFields {
    'TINYINT',
    'SMALLINT',
    'BIGINT',
    'INT',
    'FLOAT',
    'REAL',
    'DOUBLE',
    'DECIMAL',
    'CHAR',
    'VARCHAR',
    'TINYTEXT',
    'TEXT',
    'LONGTEXT',
    'BOOL',
    'YEAR',
    'DATE',
    'TIME',
    'DATETIME',
    'TIMESTAMP',
    'BLOB',
    'BINARY',
    'LONGVARBINARY',
    'VARBINARY',
}

export interface ORMAllowedFields {
    [key: string]: ORMSystemFields
}

// Field internal flags
export interface ORMSystemFields {
    type?: ORMSupportedFields
    alias?: string
    protected?: boolean
    private?: boolean
}

export interface ORMCommonFields extends ORMSystemFields {
    primaryKey?: boolean
    notNull?: boolean
    unique?: boolean
    // binary?: boolean;
    unsigned?: boolean
    zeroFill?: boolean
    autoincrement?: boolean
    generated?: boolean
    size?: number
}

export interface ORMVarCharField extends ORMCommonFields {
    size: number
}

export interface ORMFloatField extends ORMCommonFields {
    precision?: number
}

export interface ORMBoolField extends ORMCommonFields {
    default: ORMBinaryDefault
}

export interface ORMDataTimestampField extends ORMCommonFields {
    default: ORMTimestampDefault
}

/**
 * Foreign key to model
 */
export interface ORMForeignKeyField extends ORMCommonFields {
    localField: string
    linkedField: string
    model: ORMModel
}

/**
 * Foreign key to static enum model
 */
export interface ORMStaticKeyField extends ORMCommonFields {
    keys: any
}
