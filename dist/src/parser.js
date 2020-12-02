"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSentence = exports.parseSuccessor = exports.parsePredecessor = exports.parseProduction = exports.parseProductions = exports.parseAxiom = void 0;
let reservedChars = ["(", ")", ":", "{", "}"];
function parseAxiom(axiom) {
    return parseSentence(axiom, parseParamsArray);
}
exports.parseAxiom = parseAxiom;
//TODO: this will break if the strings aren't equivialent A(X), A(Y)
function parseProductions(productionStrings) {
    let productionMap = {};
    productionStrings.forEach((productionString) => {
        let splitString = splitProduction(productionString);
        let predString = splitString[0].trim();
        let existingProd = productionMap[predString];
        if (existingProd) {
            //console.log("Existing pred exists, adding to that directly");
            let successorString = splitString[1].trim();
            let successor = parseSuccessor(successorString, existingProd.predecessor.letter.params);
            if (existingProd.successor instanceof Array) {
                existingProd.successor.push(successor);
            }
            else {
                existingProd.successor = [existingProd.successor, successor];
            }
        }
        else {
            productionMap[predString] = parseProduction(productionString);
        }
    });
    let productions = Object.values(productionMap);
    return productions;
}
exports.parseProductions = parseProductions;
function parseProduction(productionString) {
    let productionStringArray = splitProduction(productionString);
    let predecessor = parsePredecessor(productionStringArray[0]);
    let successor = parseSuccessor(productionStringArray[1], predecessor.letter.params);
    let production = {
        predecessor: predecessor, successor: successor
    };
    return production;
}
exports.parseProduction = parseProduction;
function splitProduction(productionString) {
    let productionStringArray = productionString.split(":");
    if (productionStringArray.length !== 2)
        throw Error("Could not create production, wrong number of : delimiter");
    return productionStringArray;
}
//TODO: ASSUMES CONTEXT HAS NO PARAMS. FIX.
function parsePredecessor(predecessor) {
    let p = predecessor.slice().trim();
    //See if we have a condition. Remove it from string. 
    //We do this first, because we can have arbitrary strings within the {}
    let conditionString;
    if (p.includes("{") || p.includes("}")) {
        if (!(p.includes("{") && p.includes("}")))
            throw Error("Mis constructed condition in %s needs open and closed braces " + p);
        let startPos = p.indexOf("{");
        let endPos = p.indexOf("}");
        conditionString = p.substring(startPos + 1, endPos);
        p = p.substring(0, startPos).trim();
        //console.log("Found condition %s removed it now we have %s", conditionString, p);
    }
    //Now see if we have context, and parse them
    let context;
    if (p.includes("<")) {
        let splitLeft = p.split("<");
        if (splitLeft.length != 2)
            throw new Error("Mis constructed left context" + predecessor);
        context = {
            left: splitLeft[0]
        };
        p = splitLeft[1].trim();
        //console.log("Found context %s removed it now we have %s", p, context.left);
    }
    if (p.includes(">")) {
        let splitRight = p.split(">");
        if (splitRight.length != 2)
            throw new Error("Mis constructed right context" + predecessor);
        if (context)
            context.right = splitRight[1];
        else {
            context = {
                right: splitRight[1]
            };
        }
        p = splitRight[0].trim();
        //console.log("Found context, removed it, now we have", p, context.right);
    }
    //Now we should only have ONE letter left
    let pAsLetter = parseSentence(p, parseParamsArray);
    if (pAsLetter.length != 1) {
        throw new Error("Something went wrong in parsing letter for predecssor: " + p);
    }
    let predecessorLetter = pAsLetter[0];
    if (conditionString && !predecessorLetter.params) {
        throw Error("There is a condition expecting params, but the predecessor has none");
    }
    //Create the actual condition
    let condition;
    if (conditionString)
        condition = parseFunc(conditionString, predecessorLetter.params);
    let output = {
        letter: predecessorLetter,
        context: context,
        condition: condition
    };
    //console.log("Parsed predecessor, here..." + output);
    return output;
}
exports.parsePredecessor = parsePredecessor;
function parseSuccessor(successor, paramsName) {
    let s = successor, weight;
    if (s.includes("{") || s.includes("}")) {
        if (!(s.includes("{") && s.includes("}")))
            throw Error("Mis constructed weight in %s needs open and closed braces " + s);
        let startPos = s.indexOf("{");
        let endPos = s.indexOf("}");
        let weightString = s.substring(startPos + 1, endPos);
        if (!isNumeric(weightString)) {
            throw Error("Weight needs to be numeric" + weightString);
        }
        weight = parseFloat(weightString.trim());
        //TOOD: Clean up this code a bit
        s = s.replace("{" + weightString + "}", "").trim();
    }
    let sLetters = parseSentence(s, (str) => parseFunctions(str, paramsName));
    return {
        letters: sLetters,
        weight: weight
    };
}
exports.parseSuccessor = parseSuccessor;
//IMPORTANT HELPERS
function parseSentence(axiom, paramParser) {
    axiom = axiom.trim();
    let numLetters = axiom.length;
    let parsedLetters = [];
    for (let i = 0; i < numLetters; i++) {
        let letterSymbol = axiom[i];
        if (reservedChars.includes(letterSymbol)) {
            throw Error("Axiom " + axiom + " has reserved char at" + i + "where it shouldnt be");
        }
        let letter = {
            symbol: letterSymbol
        };
        if ((i + 1) < numLetters) {
            let startPos = i + 1;
            let nextSymbol = axiom[startPos];
            if (nextSymbol == "(") {
                let endPos = findEndBracket(axiom, startPos);
                //console.log("End pos is" + endPos + " start pos is " + startPos);
                let paramsString = axiom.substring(startPos + 1, endPos);
                //console.log("Sending paramString to paramParser: " + paramString);
                let params = paramParser(paramsString);
                letter.params = params;
                i = endPos;
            }
        }
        parsedLetters.push(letter);
    }
    return parsedLetters;
}
exports.parseSentence = parseSentence;
function parseParamsArray(paramsString) {
    //console.log("Trimmed paramstring to" +  paramsString);
    let paramsArray = [];
    let paramStringArray = paramsString.split(",");
    if (paramStringArray.length === 0) {
        throw Error("Could not parse ParamsString" + paramsString);
    }
    paramStringArray.forEach((paramString) => {
        if (isNumeric(paramString)) {
            let num = parseFloat(paramString);
            paramsArray.push(num);
        }
        else {
            paramsArray.push(paramString);
        }
    });
    return paramsArray;
}
function parseFunctions(evalString, paramsNames) {
    let functionStringArray = evalString.split(",");
    let functions = [];
    functionStringArray.forEach((functionString) => {
        functionString = functionString.trim();
        //console.log("Creating function: " + functionString)
        functions.push(parseFunc(functionString, paramsNames));
    });
    return functions;
}
function parseFunc(evalString, paramsNames) {
    let paramString = paramsNames.join();
    let returnString = "return " + evalString;
    let functionString = `function (${paramString}) { ${returnString};}`;
    //console.log("Creating function " + functionString);
    var func = new Function("return " + functionString)();
    return func;
}
function findEndBracket(axiom, startingPos) {
    let i = startingPos + 1;
    let nestedBrackets = 1;
    let endPos;
    while (axiom[i] !== undefined) {
        if (axiom[i] == ")")
            nestedBrackets--;
        if (axiom[i] == "(")
            nestedBrackets++;
        if (nestedBrackets == 0) {
            endPos = i;
            break;
        }
        i = i + 1;
    }
    if (!endPos) {
        throw Error("Axiom has starting bracket but no end bracket" + axiom);
    }
    return endPos;
}
function isNumeric(str) {
    if (typeof str != "string")
        return false; // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}
//# sourceMappingURL=parser.js.map