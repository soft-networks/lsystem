"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiomToStr = exports.parseProductions = exports.parseSuccessor = exports.parsePredecessor = exports.parseProduction = exports.parseAxiom = void 0;
const nearley_1 = __importDefault(require("nearley"));
const axiom_1 = __importDefault(require("./grammars/axiom"));
const predecessor_1 = __importDefault(require("./grammars/predecessor"));
const successor_1 = __importDefault(require("./grammars/successor"));
const production_1 = __importDefault(require("./grammars/production"));
function parseAxiom(axiom) {
    return parseFromGrammar(axiom_1.default, axiom);
}
exports.parseAxiom = parseAxiom;
function parseProduction(productionString) {
    let production = parseFromGrammar(production_1.default, productionString);
    let predecessor = parsePredecessor(production.predecessorString);
    let successor = parseSuccessor(production.successorString, predecessor.letter.params || []);
    return { predecessor: predecessor, successor: successor };
}
exports.parseProduction = parseProduction;
function parsePredecessor(predecessor) {
    let parsedPredecessor = parseFromGrammar(predecessor_1.default, predecessor);
    if (parsedPredecessor.conditionString) {
        let conditionFunction = parseFunc(parsedPredecessor.conditionString, parsedPredecessor.letter.params || []);
        delete parsedPredecessor.conditionString;
        parsedPredecessor['condition'] = conditionFunction;
    }
    return parsedPredecessor;
}
exports.parsePredecessor = parsePredecessor;
function parseSuccessor(successor, paramsName) {
    let parsedSuccessor = parseFromGrammar(successor_1.default, successor);
    let letters = parsedSuccessor.letters;
    if (!letters) {
        throw Error("No letters parsed");
    }
    letters.forEach((letter) => {
        if (letter.paramsString) {
            let params = [];
            letter.paramsString.forEach(paramString => {
                let paramFunc = parseFunc(paramString, paramsName || []);
                params.push(paramFunc);
            });
            letter['params'] = params;
            delete letter.paramsString;
        }
    });
    return parsedSuccessor;
}
exports.parseSuccessor = parseSuccessor;
function parseProductions(productionStrings) {
    return productionStrings.map((pS) => parseProduction(pS));
}
exports.parseProductions = parseProductions;
function parseFromGrammar(grammar, str) {
    let strNoWhitespace = str.replace(/ /g, '');
    const parser = new nearley_1.default.Parser(nearley_1.default.Grammar.fromCompiled(grammar));
    parser.feed(strNoWhitespace);
    let parserOutputs = parser.results;
    if (parserOutputs.length == 0) {
        throw new Error("No results when parsing " + str);
    }
    if (parserOutputs.length !== 1) {
        console.log("!!!!!! Warning: Input is ambiguously parsed: " + str);
        //console.log(parserOutputs);
        //throw new Error("Ambigious parser on " + str);
    }
    return parserOutputs[0];
}
function parseFunc(evalString, paramsNames) {
    let paramString = paramsNames.join();
    let returnString = "return " + evalString;
    let functionString = `function (${paramString}) { ${returnString};}`;
    //console.log("Creating function " + functionString);
    try {
        var func = new Function("return " + functionString)();
    }
    catch (e) {
        throw new Error("Could not create function from " + functionString);
    }
    return func;
}
function axiomToStr(sentence) {
    let axiomStr = sentence.reduce((str, l) => (str + letterToStr(l)), "");
    return axiomStr;
}
exports.axiomToStr = axiomToStr;
function letterToStr(letter) {
    let letterString = letter.symbol;
    if (letter.params) {
        let paramString = letter.params.toString();
        paramString = "(" + paramString + ")";
        letterString += paramString;
    }
    return letterString;
}
