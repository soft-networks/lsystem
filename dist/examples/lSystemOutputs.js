"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lsystem_1 = __importDefault(require("../src/lsystem"));
const parser_1 = require("../src/parser");
const util_1 = __importDefault(require("util"));
let testAxiom = parser_1.parseAxiom("A(0)");
let testProductions = [parser_1.parseProduction("A(x){x<2}: FA(x+1)"), parser_1.parseProduction("A(x){x>=2} : A(x)X")];
let lsystem = new lsystem_1.default(testAxiom, testProductions, 20);
console.log(util_1.default.inspect(lsystem, false, null, true));
let result = lsystem.iterate();
console.log(result);
//# sourceMappingURL=lSystemOutputs.js.map