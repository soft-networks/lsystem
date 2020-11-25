"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const parser_1 = require("./parser");
//Axioms
//AXIOM
if (true) {
    console.log("\n❶ AXIOM");
    let inputs = ["ABC", "A(1)", "A(1,2)"];
    let errors = ["{", "A((1"];
    if (true) {
        console.log("** Correct inputs");
        inputs.forEach((input, index) => {
            console.log("➡️ " + index + ". : " + input);
            let parsed = parser_1.parseAxiom(input);
            console.log("⬅ " + index + ".: Result");
            console.log(parsed);
        });
    }
    if (false) {
        console.log("** Incorrect inputs");
        errors.forEach((input, index) => {
            try {
                console.log(index + ": " + input);
                let parsed = parser_1.parseAxiom(input);
                console.log("DIDNT FAIL");
                console.log(parsed);
            }
            catch (_a) {
                console.log("CORRECTLY FAILED");
            }
        });
    }
}
//PREDECESSOR 
if (true) {
    console.log("\n❷ PREDECSSOR");
    let inputs = ["A", "A<B>C", "A<B(x,y)>C", "B(x,y){x>y}", "B(x,y){x+y>2}"];
    if (true) {
        console.log("** Correct inputs");
        inputs.forEach((input, index) => {
            console.log("➡️ " + index + ". : " + input);
            let parsed = parser_1.parsePredecessor(input);
            console.log("⬅ " + index + ".: Result");
            console.log(parsed);
            if (parsed.condition) {
                console.log("Condition with values 1,3: " + parsed.condition(1, 3));
                console.log("Condition with values 1,3: " + parsed.condition(3, 1));
            }
        });
    }
}
//SUCCESSOR 
if (true) {
    console.log("\n❸ SUCCESSOR");
    let inputs = ["A", "A(x*2)XA", "FABCASD", "A(x * 2, y * 3)", "A((2 *x+3) +(4 * y))B"];
    let inputParams = [undefined, ['x'], undefined, ['x', 'y'], ['x', 'y']];
    inputs.forEach((input, index) => {
        console.log("➡️ " + index + ". : \x1b[33m%s\x1b[0m", input);
        let parsed = parser_1.parseSuccessor(input, inputParams[index]);
        console.log("⬅ " + index + ".: Result");
        console.log(util_1.default.inspect(parsed, false, null, true));
        parsed.letters.forEach((letter) => {
            if (letter.params) {
                letter.params.forEach((prm) => {
                    console.log("Param func with values 1,2,3,4 is: " + prm(1, 2, 3, 4));
                });
            }
        });
    });
}
//FULL PRODUCTIONS
if (false) {
    console.log("\n❹ FULL PRODUCTION");
    let inputs = ["A : FA", "A(x){x > 2}: B", "A(x,y) : A(x+1, y+1)FF"];
    inputs.forEach((input, index) => {
        console.log("➡️ " + index + ". : \x1b[33m%s\x1b[0m", input);
        let parsed = parser_1.parseProduction(input);
        console.log("⬅ " + index + ".: Result");
        console.log(util_1.default.inspect(parsed, false, null, true));
    });
}
//# sourceMappingURL=parserOutputs.js.map