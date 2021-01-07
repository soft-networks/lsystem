import {Letter, Axiom, ParamsName, Params, Predecessor, Successor } from "./interfaces"
import nearley from "nearley"
import {default as axiomGrammar} from "./grammars/axiom"
import {default as predecessorGrammar} from "./grammars/predecessor"
import {default as successorGrammar} from "./grammars/successor"
import {default as productionGrammar} from "./grammars/production"

export function parseAxiom(axiom: string): Axiom {
  return parseFromGrammar(axiomGrammar, axiom);
}
export function parseProduction(productionString: string) {
  let production = parseFromGrammar(productionGrammar, productionString);
  let predecessor = parsePredecessor(production.predecessorString);
  let successor = parseSuccessor(production.successorString, predecessor.letter.params || []);
  return {predecessor: predecessor, successor: successor};
}
export function parsePredecessor(predecessor: string) : Predecessor {
  let parsedPredecessor = parseFromGrammar(predecessorGrammar, predecessor);
  if (parsedPredecessor.conditionString) {
    let conditionFunction = parseFunc(parsedPredecessor.conditionString as string, parsedPredecessor.letter.params || []);
    delete parsedPredecessor.conditionString
    parsedPredecessor['condition'] = conditionFunction;
  }
  return parsedPredecessor as Predecessor;
}
export function parseSuccessor(successor: string, paramsName: ParamsName) : Successor{
  let parsedSuccessor = parseFromGrammar(successorGrammar, successor);
  let letters = parsedSuccessor.letters;
  if (!letters) {
    throw Error("No letters parsed");
  }
  letters.forEach((letter) => {
    if (letter.paramsString) {
      let params = [];
      letter.paramsString.forEach(paramString => {
        let paramFunc = parseFunc(paramString as string, paramsName || []);
        params.push(paramFunc);
      });
      letter['params'] = params;
      delete letter.paramsString;
    }
  })
  return parsedSuccessor as Successor;
} 
export function parseProductions(productionStrings: string[]) {
  return productionStrings.map((pS) => parseProduction(pS));
}
function parseFromGrammar(grammar, str) {
  let strNoWhitespace = str.replace(/ /g,'')
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
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
function parseFunc(evalString: string, paramsNames: ParamsName ){
  let paramString = paramsNames.join();
  let returnString = "return " + evalString;
  let functionString = `function (${paramString}) { ${returnString};}`
  //console.log("Creating function " + functionString);
  try {
    var func = new Function("return " + functionString)();
  } catch (e) {
    throw new Error("Could not create function from " + functionString)
  }
  return func;
}
export function axiomToStr(sentence: Letter<Params>[]): string {
  let axiomStr = sentence.reduce((str, l) => (str + letterToStr(l)), "");
  return axiomStr;
}

function letterToStr(letter: Letter<Params>): string {
  let letterString = letter.symbol;
  if (letter.params) {
    let paramString = letter.params.toString();
    paramString = "(" + paramString + ")";
    letterString += paramString;
  }
  return letterString;
}