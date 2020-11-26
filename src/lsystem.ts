
import {sym, Letter, ParamsValue, ParamsName, ParamsExpanded, ParamsRule, Params, Condition, Context, Predecessor, Successor, Axiom, Production} from "./types"

let debug = false;
let dPrint = (msg) => {if(debug) { console.log(msg)}};

export default class LSystem {
  axiom: Axiom;
  productions: Production[];
  iterations: number;

  constructor(axiom: Axiom, productions: Production[], iterations?: number) {
    this.axiom = axiom;
    this.productions = productions;
    this.iterations = iterations || 1;
  }

  iterate = () => {
    let currentOutput = this.axiom;
    for (var i = 0; i < this.iterations; i++) {
      currentOutput = this.replace(currentOutput);
    }
    return currentOutput;
  }
  /**
   * Replaces each letter of an axiom with the right successor.
   * @param axiom 
   */
  replace = (axiom: Axiom) => {
    let replacedLetters: Axiom = [];
    axiom.forEach((letter) => {
      //1: Find the right production
      let production: Production;
      try {
        production = this.findProduction(letter, axiom);
        dPrint("Production chosen");
        dPrint(production);
      } catch (Error) {
        dPrint("Didn't find production, replacing with myself: " + letter.symbol)
        replacedLetters = [...replacedLetters, letter];
      }
      if (production) {
        //1.5: Choose a successor (in case there are multiple, to be chosen from stochastically)
        let successor : Successor= chooseSuccessorStochastic(production);
        dPrint("successor chosen");
        dPrint(successor);
        //2: Expand the successor, applying any params 
        let newLetters : Axiom = expandSuccessor(successor, letter.params);
        //3: Replace this letter with the new letters 
        replacedLetters = [...replacedLetters, ...newLetters]
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
  findProduction = (letter: Letter<ParamsValue>, currentAxiom: Axiom): Production => {
    let matchedProduction: Production | undefined;
    this.productions.forEach((production) => {
      if (predecessorMatchesLetter(letter, production.predecessor, currentAxiom)) {
        if (matchedProduction)
          throw Error("Multiple productions are matching " + letter.symbol);
        matchedProduction = production;
      }
    });
    if (!matchedProduction) {
      throw Error("Could not find any production to match " + letter.symbol);
    }
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
function predecessorMatchesLetter(letter: Letter<ParamsValue>, predecessor: Predecessor, currentAxiom: Axiom): boolean {
  let pLetter = predecessor.letter;
  if (pLetter.symbol !== letter.symbol)
    return false;
  if (predecessor.context) {
    let context = predecessor.context;
    if (context.left) {
      //TODO
    }
    if (context.right) {
      //TODO
    }
  }
  if (letter.params) {
    if (!pLetter.params || pLetter.params.length !== letter.params.length)
      return false;
    if (predecessor.condition) {
      let conditionMatches = predecessor.condition(...letter.params);
      if (!conditionMatches)
        return false;
    }
  }
  return true;
}


// HELPER FUNCTIONS FOR CLASS 
/**
 * Given a production, returns the successor, choosing stochastically if there are many
 * @param {Production} production Producti
 * @returns {Successor}
 */
function chooseSuccessorStochastic(production: Production): Successor {
  if (production.successor instanceof Array) {
    //TOOD: Make this properly stochastic
    return production.successor[0]
  } else {
    return production.successor;
  }
}

/**
 * TODO: MAYBE JUST REMOVE
 * Constructs a dictionary of params names to values by matching indices.
 * Assumes lengths of vParams == nParams
 * @param {ParamsValue} vParams Params values
 * @param {ParamsName} nParams  Params names
 * @returns {ParamsExpanded} Values matched to names
 */
function createExpandedParams(vParams: ParamsValue | undefined, nParams: ParamsName | undefined): ParamsExpanded {
  let expandedParams: ParamsExpanded = {};
  if (vParams && nParams && vParams.length == nParams.length) {
    for (let i = 0; i < vParams.length; i++) {
      let paramValue: number | string = vParams[i];
      let paramName: string = nParams[i];
      expandedParams[paramName] = paramValue;
    }
  }
  return expandedParams;
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

