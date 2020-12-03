import { parseAxiom, parseSuccessor } from "./parser";
import {sym, Letter, ParamsValue, ParamsName, ParamsRule, Params, Condition, Context, Predecessor, Successor, Axiom, Production} from "./types"

export function sentenceToStr(sentence: Letter<Params>[]): string {
  let axiomStr = sentence.reduce((str, l) => (str + letterToStr(l)), "");
  return axiomStr;
}

export function letterToStr(letter: Letter<Params>): string {
  let letterString = letter.symbol;
  if (letter.params) {
    let paramString = letter.params.toString();
    paramString = "(" + paramString + ")";
    letterString += paramString;
  }
  return letterString;
}

//TODO: I PROBABLY HAVE TO STORE THE ORIGINAL STRING, TO CONVERT IT BACK SMH
export function successorToString(successor: Successor): string {
  let axiomString = sentenceToStr(successor.letters);
  if (successor.weight) {
    axiomString += "{" + successor.weight + "}"
  }
  return axiomString;
}

let axiomtest = parseAxiom("AB(1)C");
console.log(sentenceToStr(axiomtest));
console.log(JSON.stringify(axiomtest));


let axiomtest2 = parseSuccessor("AB(x+y)C", ["x"]);
console.log(successorToString(axiomtest2));
