"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
let debug = false;
let dPrint = (msg) => { if (debug) {
    console.log(msg);
} };
class LSystem {
    constructor(axiom, productions, iterations) {
        this.productions = [];
        this.iterate = (n = this.iterations) => {
            let output = this.outputs[this.outputs.length - 1];
            for (var i = this.outputs.length; i <= n; i++) {
                output = this.replace(output);
                this.outputs.push(output);
            }
            return this.getIterationAsString(n);
        };
        this.setIterations = (n) => {
            this.iterations = n;
        };
        this.getAllIterationsAsString = (n = this.iterations) => {
            return this.getAllIterationsAsObject().map((asObj) => (parser_1.axiomToStr(asObj)));
        };
        this.getAllIterationsAsObject = (n = this.iterations) => {
            if (!this.outputs[n]) {
                this.iterate(n);
            }
            return this.outputs;
        };
        this.getIterationAsString = (n = this.iterations) => {
            return parser_1.axiomToStr(this.getIterationAsObject(n));
        };
        this.getIterationAsObject = (n = this.iterations) => {
            if (!this.outputs[n]) {
                this.iterate(n);
            }
            return this.outputs[n];
        };
        this.addProduction = (p) => {
            let ps = p;
            if (!p.predecessor) {
                p = parser_1.parseProduction(p);
            }
            let nP = p;
            if (this.productions.length == 0) {
                this.productions.push(nP);
                dPrint("First production added: " + ps);
                return;
            }
            let matchedAny = false;
            this.productions.forEach((oProd) => {
                if (predecessorMatchesPredeecessor(oProd.predecessor, nP.predecessor)) {
                    dPrint("Production matched, appending successor" + ps);
                    matchedAny = true;
                    let nSuccessorAsArray = nP.successor instanceof Array ? nP.successor : [nP.successor];
                    if (oProd.successor instanceof Array) {
                        oProd.successor = [...oProd.successor, ...nSuccessorAsArray];
                    }
                    else {
                        oProd.successor = [oProd.successor, ...nSuccessorAsArray];
                    }
                    //TODO: There is  a weird edge case here where if many match, it can get appended twice.
                    // Though this technically should not happen
                }
                else {
                    matchedAny = false;
                }
            });
            if (!matchedAny) {
                this.productions.push(nP);
            }
        };
        this.resetStoredIterations = () => {
            this.outputs = [this.axiom];
        };
        /**
         * Replaces each letter of an axiom with the right successor.
         * @param axiom
         */
        this.replace = (axiom) => {
            let replacedLetters = [];
            axiom.forEach((letter, index) => {
                //1: Find the right production
                let production;
                production = this.findProduction(letter, axiom, index);
                if (production) {
                    //1.5: Choose a successor (in case there are multiple, to be chosen from stochastically)
                    let successor = chooseSuccessorStochastic(production);
                    dPrint("successor chosen");
                    dPrint(successor);
                    //2: Expand the successor, applying any params 
                    let newLetters = expandSuccessor(successor, letter.params);
                    //3: Replace this letter with the new letters 
                    replacedLetters = [...replacedLetters, ...newLetters];
                }
                else {
                    dPrint("No production found, replacing with myself");
                    replacedLetters = [...replacedLetters, letter];
                }
            });
            return replacedLetters;
        };
        /**
         * Finds the right production to apply to a given letter, for a current axiom.
         * It uses the helper function predecessorMatchesLetter to match most of the work
         * @param {Letter<ParamsValue>} letter Letter we're finding production for
         * @param {Axiom} currentAxiom Current axiom that the leter is in
         * @returns {Production}  The production that matches
         * @throws Errors if there are more than one, or no matches
         */
        this.findProduction = (letter, currentAxiom, currentIndex) => {
            let matchedProduction;
            this.productions.forEach((production) => {
                if (predecessorMatchesLetter(letter, production.predecessor, currentAxiom, currentIndex)) {
                    if (matchedProduction)
                        throw Error("Multiple productions are matching " + letter.symbol);
                    matchedProduction = production;
                }
            });
            return matchedProduction;
        };
        if (axiom[0] && axiom[0].symbol) {
            this.axiom = axiom;
        }
        else {
            this.axiom = parser_1.parseAxiom(axiom);
        }
        productions.forEach((p) => { this.addProduction(p); });
        this.iterations = iterations || 1;
        this.outputs = [this.axiom];
        this.iterate();
    }
}
exports.default = LSystem;
function predecessorMatchesPredeecessor(p1, p2) {
    if (!letterMatchesLetter(p1.letter, p2.letter)) {
        return false;
    }
    if (p1.context) {
        if (!p2.context) {
            return false;
        }
        if (p1.context.left) {
            if (!p2.context.left || !letterMatchesLetter(p1.context.left, p2.context.left)) {
                return false;
            }
        }
        if (p1.context.right) {
            if (!p2.context.right || !letterMatchesLetter(p1.context.left, p2.context.left)) {
                return false;
            }
        }
    }
    if (p1.condition) {
        if (!p2.condition || p1.condition.toString() != p2.condition.toString()) {
            return false;
        }
    }
    return true;
}
/**
 * Given a letter and a predecessor, see's if they match
 * Performs checks for symbol equality, context, param lenghts, as well as conditions
 * @param {Letter<ParamsValue>} letter  letter we're checking the predecessor against
 * @param {Predecessor}  predecessor Predecessor we're checking the letter against
 * @param {Axiom} currentAxiom Current axiom we're working through, needed for context matching
 * @returns {boolean} whether or not its a match
 */
function predecessorMatchesLetter(letter, predecessor, currentAxiom, currentIndex) {
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
function letterMatchesLetter(l1, l2) {
    if (l1.symbol !== l2.symbol)
        return false;
    if (l1.params) {
        if (!l2.params || l1.params.length !== l2.params.length) {
            return false;
        }
    }
    return true;
}
function contextMatchesAxiom(context, axiom, currentLetter, currentIndex) {
    let lMatch, rMatch;
    if (context.left) {
        lMatch = false;
        for (let i = currentIndex - 1; i >= 0; i--) {
            lMatch = letterMatchesLetter(context.left, axiom[i]);
            if (lMatch) {
                break;
            }
        }
    }
    if (context.right) {
        rMatch = false;
        for (let i = currentIndex + 1; i < axiom.length; i++) {
            rMatch = letterMatchesLetter(context.right, axiom[i]);
            if (rMatch) {
                break;
            }
        }
    }
    if (lMatch === undefined)
        lMatch = true;
    if (rMatch === undefined)
        rMatch = true;
    dPrint("Completed context matching " + currentLetter.symbol + ", did find context = " + (lMatch && rMatch));
    return lMatch && rMatch;
}
/**
 * Given a production, returns the successor, choosing stochastically if there are many
 * @param {Production} production Producti
 * @returns {Successor}
 */
function chooseSuccessorStochastic(production) {
    if (production.successor instanceof Array) {
        let successors = production.successor;
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
        dPrint("Stochastically choosing: Total sum of chances is " + runningSum + " chose " + random + " At loc " + randLoc);
        return randomSuccessor;
    }
    else {
        return production.successor;
    }
}
/**
 * Given a successor, and a set of params, return the set of letters (axiom) this expands to
 * @param {Succesor} successor successor to expand
 * @param {ParamsExpanded} params params to use, if they exist
 * @returns {Axiom}
 */
function expandSuccessor(successor, params) {
    let newLetters = [];
    successor.letters.forEach((sLetter) => {
        let newLetter = { symbol: sLetter.symbol };
        if (sLetter.params) {
            let evaluatedParams = [];
            sLetter.params.forEach((paramRule) => {
                if (!params)
                    params = [];
                let evaluatedParam = paramRule(...params);
                evaluatedParams.push(evaluatedParam);
            });
            newLetter.params = evaluatedParams;
        }
        newLetters.push(newLetter);
    });
    dPrint("Returning new set of letters");
    dPrint(newLetters);
    return newLetters;
}
