/*
 Copyright (C) 2013-2015 by Justin DuJardin and Contributors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var itemModel_1 = require('./itemModel');
var SpellModel = (function (_super) {
    __extends(SpellModel, _super);
    function SpellModel() {
        _super.apply(this, arguments);
    }
    SpellModel.prototype.defaults = function () {
        return _.extend(_super.prototype.defaults.call(this), SpellModel.DEFAULTS);
    };
    SpellModel.prototype.cast = function (caster, target) {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    };
    SpellModel.DEFAULTS = {
        name: 'Invalid Spell',
        cost: 0,
        icon: '',
        level: 99,
        type: 'target',
        usedby: [],
        groups: 'default',
        elements: '',
        benefit: false,
        value: 0
    };
    return SpellModel;
})(itemModel_1.ItemModel);
exports.SpellModel = SpellModel;
//# sourceMappingURL=spellModel.js.map