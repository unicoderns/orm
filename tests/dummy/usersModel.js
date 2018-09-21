"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../decorators");
const defaults_1 = require("../../interfaces/db/defaults");
const datatypes_1 = require("../../datatypes");
const model_1 = require("../../model");
/**
 * User Model
 */
class Users extends model_1.Model {
    constructor() {
        super(...arguments);
        this.id = new datatypes_1.Datatypes().ID();
        this.created = new datatypes_1.Datatypes().TIMESTAMP({
            notNull: true,
            default: defaults_1.Defaults.Timestamp.CURRENT_TIMESTAMP
        });
        this.username = new datatypes_1.Datatypes().VARCHAR({
            size: 45,
            unique: true
        });
        this.email = new datatypes_1.Datatypes().VARCHAR({
            notNull: true,
            size: 45,
            unique: true
        });
        this.password = new datatypes_1.Datatypes().CHAR({
            notNull: true,
            size: 60
        });
        this.salt = new datatypes_1.Datatypes().VARCHAR({
            notNull: true,
            size: 20
        });
        this.firstName = new datatypes_1.Datatypes().VARCHAR({
            size: 45
        });
        this.lastName = new datatypes_1.Datatypes().VARCHAR({
            size: 45
        });
        this.admin = new datatypes_1.Datatypes().BOOL();
        this.verified = new datatypes_1.Datatypes().BOOL();
        this.active = new datatypes_1.Datatypes().BOOL();
    }
}
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "id", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "created", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "username", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "email", void 0);
__decorate([
    decorators_1.secret(),
    __metadata("design:type", Object)
], Users.prototype, "password", void 0);
__decorate([
    decorators_1.secret("added_salt"),
    __metadata("design:type", Object)
], Users.prototype, "salt", void 0);
__decorate([
    decorators_1.field("first_name"),
    __metadata("design:type", Object)
], Users.prototype, "firstName", void 0);
__decorate([
    decorators_1.field("last_name"),
    __metadata("design:type", Object)
], Users.prototype, "lastName", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "admin", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "verified", void 0);
__decorate([
    decorators_1.field(),
    __metadata("design:type", Object)
], Users.prototype, "active", void 0);
exports.Users = Users;
//# sourceMappingURL=usersModel.js.map