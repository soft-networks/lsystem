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
        { "name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/] },
        { "name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": function (d) {
                return parseInt(d[0].join(""));
            }
        },
        { "name": "int$ebnf$1$subexpression$1", "symbols": [{ "literal": "-" }] },
        { "name": "int$ebnf$1$subexpression$1", "symbols": [{ "literal": "+" }] },
        { "name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id },
        { "name": "int$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "int$ebnf$2", "symbols": [/[0-9]/] },
        { "name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": function (d) {
                if (d[0]) {
                    return parseInt(d[0][0] + d[1].join(""));
                }
                else {
                    return parseInt(d[1].join(""));
                }
            }
        },
        { "name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/] },
        { "name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/] },
        { "name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{ "literal": "." }, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"] },
        { "name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id },
        { "name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": () => null },
        { "name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": function (d) {
                return parseFloat(d[0].join("") +
                    (d[1] ? "." + d[1][1].join("") : ""));
            }
        },
        { "name": "decimal$ebnf$1", "symbols": [{ "literal": "-" }], "postprocess": id },
        { "name": "decimal$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "decimal$ebnf$2", "symbols": [/[0-9]/] },
        { "name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/] },
        { "name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "decimal$ebnf$3$subexpression$1", "symbols": [{ "literal": "." }, "decimal$ebnf$3$subexpression$1$ebnf$1"] },
        { "name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id },
        { "name": "decimal$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": function (d) {
                return parseFloat((d[0] || "") +
                    d[1].join("") +
                    (d[2] ? "." + d[2][1].join("") : ""));
            }
        },
        { "name": "percentage", "symbols": ["decimal", { "literal": "%" }], "postprocess": function (d) {
                return d[0] / 100;
            }
        },
        { "name": "jsonfloat$ebnf$1", "symbols": [{ "literal": "-" }], "postprocess": id },
        { "name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/] },
        { "name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/] },
        { "name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{ "literal": "." }, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"] },
        { "name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id },
        { "name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": () => null },
        { "name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id },
        { "name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/] },
        { "name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"] },
        { "name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id },
        { "name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": () => null },
        { "name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": function (d) {
                return parseFloat((d[0] || "") +
                    d[1].join("") +
                    (d[2] ? "." + d[2][1].join("") : "") +
                    (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : ""));
            }
        },
        { "name": "Main", "symbols": ["Successor"], "postprocess": id },
        { "name": "Successor$ebnf$1", "symbols": ["SLetter"] },
        { "name": "Successor$ebnf$1", "symbols": ["Successor$ebnf$1", "SLetter"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Successor", "symbols": ["Successor$ebnf$1"], "postprocess": (d) => ({ letters: d[0] }) },
        { "name": "Successor$ebnf$2", "symbols": ["SLetter"] },
        { "name": "Successor$ebnf$2", "symbols": ["Successor$ebnf$2", "SLetter"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Successor", "symbols": ["SWeight", "Successor$ebnf$2"], "postprocess": (d) => ({ letters: d[1], weight: d[0] }) },
        { "name": "Successor$ebnf$3", "symbols": ["SLetter"] },
        { "name": "Successor$ebnf$3", "symbols": ["Successor$ebnf$3", "SLetter"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "Successor", "symbols": ["Successor$ebnf$3", "SWeight"], "postprocess": (d) => ({ letters: d[0], weight: d[1] }) },
        { "name": "SWeight", "symbols": [{ "literal": "{" }, "decimal", { "literal": "}" }], "postprocess": (d) => d[1] },
        { "name": "SLetter", "symbols": ["symbol"], "postprocess": (d) => ({ symbol: d[0] }) },
        { "name": "SLetter", "symbols": ["symbol", { "literal": "(" }, "SParams", { "literal": ")" }], "postprocess": (d) => ({ symbol: d[0], paramsString: d[2] }) },
        { "name": "symbol", "symbols": [/[^,():{}<>]/], "postprocess": id },
        { "name": "SParams", "symbols": ["SPSymbol"], "postprocess": id },
        { "name": "SParams$ebnf$1", "symbols": ["SParam"] },
        { "name": "SParams$ebnf$1", "symbols": ["SParams$ebnf$1", "SParam"], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "SParams", "symbols": ["SPSymbol", "SParams$ebnf$1"], "postprocess": (d) => [d[0], ...d[1]] },
        { "name": "SParam", "symbols": [{ "literal": "," }, "SPSymbol"], "postprocess": ([c, p]) => p },
        { "name": "SPSymbol", "symbols": ["math"] },
        { "name": "math", "symbols": ["AS"], "postprocess": id },
        { "name": "P", "symbols": [{ "literal": "(" }, "AS", { "literal": ")" }], "postprocess": (d) => "(" + d[1] + ")" },
        { "name": "P", "symbols": ["N"], "postprocess": id },
        { "name": "E", "symbols": ["P", { "literal": "^" }, "E"], "postprocess": (d) => "Math.pow(" + d[0] + "," + d[2] + ")" },
        { "name": "E", "symbols": ["P"], "postprocess": id },
        { "name": "MD", "symbols": ["MD", { "literal": "*" }, "E"], "postprocess": (d) => d[0] + "*" + d[2] },
        { "name": "MD", "symbols": ["MD", { "literal": "/" }, "E"], "postprocess": (d) => d[0] + "/" + d[2] },
        { "name": "MD", "symbols": ["E"], "postprocess": id },
        { "name": "AS", "symbols": ["AS", { "literal": "+" }, "MD"], "postprocess": (d) => d[0] + "+" + d[2] },
        { "name": "AS", "symbols": ["AS", { "literal": "-" }, "MD"], "postprocess": (d) => d[0] + "-" + d[2] },
        { "name": "AS", "symbols": ["MD"], "postprocess": id },
        { "name": "N", "symbols": ["mathsymbol"], "postprocess": id },
        { "name": "N$string$1", "symbols": [{ "literal": "s" }, { "literal": "i" }, { "literal": "n" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$1", "P"], "postprocess": (d) => "Math.sin(" + d[1] + ")" },
        { "name": "N$string$2", "symbols": [{ "literal": "c" }, { "literal": "o" }, { "literal": "s" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$2", "P"], "postprocess": (d) => "Math.cos(" + d[1] + ")" },
        { "name": "N$string$3", "symbols": [{ "literal": "t" }, { "literal": "a" }, { "literal": "n" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$3", "P"], "postprocess": (d) => "Math.tan(" + d[1] + ")" },
        { "name": "N$string$4", "symbols": [{ "literal": "a" }, { "literal": "s" }, { "literal": "i" }, { "literal": "n" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$4", "P"], "postprocess": (d) => "Math.asin(" + d[1] + ")" },
        { "name": "N$string$5", "symbols": [{ "literal": "a" }, { "literal": "c" }, { "literal": "o" }, { "literal": "s" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$5", "P"], "postprocess": (d) => "Math.acos(" + d[1] + ")" },
        { "name": "N$string$6", "symbols": [{ "literal": "a" }, { "literal": "t" }, { "literal": "a" }, { "literal": "n" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$6", "P"], "postprocess": (d) => "Math.atan(" + d[1] + ")" },
        { "name": "N$string$7", "symbols": [{ "literal": "p" }, { "literal": "i" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$7"], "postprocess": (d) => "Math.PI" },
        { "name": "N", "symbols": [{ "literal": "e" }], "postprocess": (d) => "Math.E" },
        { "name": "N$string$8", "symbols": [{ "literal": "s" }, { "literal": "q" }, { "literal": "r" }, { "literal": "t" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$8", "P"], "postprocess": (d) => "Math.sqrt(" + d[1] + ")" },
        { "name": "N$string$9", "symbols": [{ "literal": "l" }, { "literal": "n" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$9", "P"], "postprocess": (d) => "Math.log(" + d[1] + ")" },
        { "name": "N$string$10", "symbols": [{ "literal": "r" }, { "literal": "n" }, { "literal": "d" }, { "literal": "(" }, { "literal": ")" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$10"], "postprocess": (d) => "Math.random()" },
        { "name": "N$string$11", "symbols": [{ "literal": "r" }, { "literal": "n" }, { "literal": "d" }, { "literal": "(" }], "postprocess": (d) => d.join('') },
        { "name": "N", "symbols": ["N$string$11", "AS", { "literal": "," }, "AS", { "literal": ")" }], "postprocess": (d) => `Math.random()*((${d[3]}) - (${d[1]}))+(${d[1]})` },
        { "name": "mathsymbol", "symbols": ["decimal"], "postprocess": id },
        { "name": "mathsymbol$ebnf$1", "symbols": [/[a-zA-Z]/] },
        { "name": "mathsymbol$ebnf$1", "symbols": ["mathsymbol$ebnf$1", /[a-zA-Z]/], "postprocess": (d) => d[0].concat([d[1]]) },
        { "name": "mathsymbol", "symbols": ["mathsymbol$ebnf$1"], "postprocess": (d) => d[0].join("") }
    ],
    ParserStart: "Main",
};
exports.default = grammar;
