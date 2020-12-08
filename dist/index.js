"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProductions = exports.parseProduction = exports.parseAxiom = void 0;
const parser_1 = require("./parser");
Object.defineProperty(exports, "parseAxiom", { enumerable: true, get: function () { return parser_1.parseAxiom; } });
Object.defineProperty(exports, "parseProduction", { enumerable: true, get: function () { return parser_1.parseProduction; } });
Object.defineProperty(exports, "parseProductions", { enumerable: true, get: function () { return parser_1.parseProductions; } });
const lsystem_1 = __importDefault(require("./lsystem"));
exports.default = lsystem_1.default;
