import { parseAxiom, parsePredecessor, parseProductions, axiomToStr } from "./parser";
import {sym, Letter, Axiom, ParamsValue,  Params, Context, Production, Predecessor, Successor } from "./interfaces"

let debug = false;
let dPrint = (msg) => {if(debug) { console.log(msg)}};

export default class LSystem {
  axiom: Axiom;
  productions: Production[];
  iterations: number;
  constructor(axiom: Axiom | string, productions: Production[] | string[], iterations?: number) {
    if (axiom[0] && (axiom[0] as Letter).symbol) {
      this.axiom = axiom as Axiom;
    } else {
      this.axiom = parseAxiom(axiom as string);
    }
    if (productions[0] && (productions[0] as Production).predecessor) {
      this.productions = productions as Production[];
    } else {
      this.productions = parseProductions(productions as string[])
    }
    this.iterations = iterations || 1;
  }
  setIterations = (i: number) => {
    this.iterations = i;
  }
  iterate = (params: {iterations?: number, asString?: boolean} = {}): string | Axiom => {
    let {iterations = this.iterations, asString = true} = params;
    let output = this.axiom;
    for (var i = 0; i < iterations; i++) {
      output = this.replace(output);
    }
    return asString ? axiomToStr(output) : output;
  }
  /**
   * Replaces each letter of an axiom with the right successor.
   * @param axiom 
   */
  replace = (axiom: Axiom) => {
    let replacedLetters: Axiom = [];
    axiom.forEach((letter, index) => {
      //1: Find the right production
      let production: Production;
      production = this.findProduction(letter, axiom, index);
      if (production) {
        //1.5: Choose a successor (in case there are multiple, to be chosen from stochastically)
        let successor : Successor= chooseSuccessorStochastic(production);
        dPrint("successor chosen");
        dPrint(successor);
        //2: Expand the successor, applying any params 
        let newLetters : Axiom = expandSuccessor(successor, letter.params);
        //3: Replace this letter with the new letters 
        replacedLetters = [...replacedLetters, ...newLetters]
      } else {
        dPrint("No production found, replacing with myself")
        replacedLetters = [...replacedLetters, letter];
      }
    })
    return replacedLetters;
  }
  /**
   * Finds the right production to apply to a given letter, for a current axiom.
   * It uses the helper function predecessorMatchesLetter to match most of the work
   * @param {Letter<ParamsValue>} letter Letter we're finding production for
   * @param {Axiom} currentAxiom Current axiom that the leter is in
   * @returns {Production}  The production that matches
   * @throws Errors if there are more than one, or no matches
   */
  findProduction = (letter: Letter<ParamsValue>, currentAxiom: Axiom, currentIndex: number): Production => {
    let matchedProduction: Production | undefined;
    this.productions.forEach((production) => {
      if (predecessorMatchesLetter(letter, production.predecessor, currentAxiom, currentIndex)) {
        if (matchedProduction)
          throw Error("Multiple productions are matching " + letter.symbol);
        matchedProduction = production;
      }
    });
    return matchedProduction;
  }
}

/**
 * Given a letter and a predecessor, see's if they match
 * Performs checks for symbol equality, context, param lenghts, as well as conditions
 * @param {Letter<ParamsValue>} letter  letter we're checking the predecessor against
 * @param {Predecessor}  predecessor Predecessor we're checking the letter against 
 * @param {Axiom} currentAxiom Current axiom we're working through, needed for context matching
 * @returns {boolean} whether or not its a match
 */
function predecessorMatchesLetter(letter: Letter<ParamsValue>, predecessor: Predecessor, currentAxiom: Axiom, currentIndex: number): boolean {
  let pLetter = predecessor.letter;
  if (!letterMatchesLetter(pLetter, letter)) {
    return false;
  }
  
  if (predecessor.context) {
    if (!contextMatchesAxiom(predecessor.context, currentAxiom, letter, currentIndex)) {
      return false;
    }
  }
  if (predecessor.condition) {
    let conditionMatches = predecessor.condition(...letter.params); 
    if (!conditionMatches)
      return false;
  }
  return true;
}
function letterMatchesLetter(l1: Letter<Params>, l2: Letter<Params>) {
  if (l1.symbol !== l2.symbol) 
    return false;
  if (l1.params) {
    if (!l2.params || l1.params.length !== l2.params.length) {
      return false
    } 
  }
  return true;
}
function contextMatchesAxiom(context: Context, axiom: Axiom, currentLetter: Letter<Params>, currentIndex: number): boolean {
  let lMatch, rMatch;
  if (context.left) {
    lMatch = false;
    for(let i = currentIndex -1; i >=0 ; i--) {
      lMatch = letterMatchesLetter(context.left, axiom[i]);
      if (lMatch) {
        break;
      }
    }
  }
  if (context.right) {
    rMatch = false;
    for(let i = currentIndex +1; i < axiom.length; i++) {
      rMatch = letterMatchesLetter(context.right, axiom[i]);
      if (rMatch) {
        break;
      }
    }
  }
  if (lMatch === undefined) lMatch = true;
  if (rMatch === undefined) rMatch = true;
  dPrint("Completed context matching " + currentLetter.symbol + ", did find context = " + (lMatch && rMatch));
  return lMatch && rMatch;
} 
/**
 * Given a production, returns the successor, choosing stochastically if there are many
 * @param {Production} production Producti
 * @returns {Successor}
 */
function chooseSuccessorStochastic(production: Production): Successor {
  if (production.successor instanceof Array) {
    let successors = production.successor as Array<Successor>;
    let chances = successors.map((s) => s.weight ? s.weight : 1);
    let runningSum = 0;
    chances = chances.map((c, i) => {
      let cSum = c + runningSum;
      runningSum += c;
      return cSum;
    });
    let random = Math.random() * runningSum;
    let randLoc = chances.filter((e) => e <= random).length;
    let randomSuccessor = successors[randLoc];
    dPrint("Stochastically choosing: Total sum of chances is "  + runningSum + " chose " + random + " At loc " + randLoc);
    return randomSuccessor;
  } else {
    return production.successor;
  }
}
/**
 * Given a successor, and a set of params, return the set of letters (axiom) this expands to
 * @param {Succesor} successor successor to expand
 * @param {ParamsExpanded} params params to use, if they exist
 * @returns {Axiom} 
 */
function expandSuccessor(successor: Successor, params: ParamsValue): Axiom {
  let newLetters: Axiom = [];
  successor.letters.forEach((sLetter) => {
    let newLetter: Letter<ParamsValue> = { symbol: sLetter.symbol }
    if (sLetter.params) {
      let evaluatedParams : ParamsValue = [];
      sLetter.params.forEach((paramRule) => {
        let evaluatedParam = paramRule(...params);
        evaluatedParams.push(evaluatedParam);
      })
      newLetter.params = evaluatedParams;
    }
    newLetters.push(newLetter);
  })
  dPrint("Returning new set of letters");
  dPrint(newLetters);
  return newLetters;
}

