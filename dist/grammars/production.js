"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
;
;
;
;
const grammar = {
    Lexer: undefined,
    ParserRules: [
        { "name": "Main", "symbols": ["string", { "literal": ":" }, "string"], "postprocess": (d) => ({ predecessorString: d[0], successorString: d[2] }) },
        { "name": "string$ebnf$1", "symbols": [/[^:]/] },
        { "name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[^:]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "string", "symbols": ["string$ebnf$1"], "postprocess": (d) => d[0].join('') }
    ],
    ParserStart: "Main",
};
exports.default = grammar;
