export default class LSystem {
    axiom: Axiom;
    productions: Production[];
    iterations: number;
    constructor(axiom: Axiom, productions: Production[], iterations?: number);
    setIterations: (i: number) => void;
    iterate: (options?: {
        iterations?: number;
        asAxiom?: boolean;
    }) => string | Axiom;
    /**
     * Replaces each letter of an axiom with the right successor.
     * @param axiom
     */
    replace: (axiom: Axiom) => Axiom;
    /**
     * Finds the right production to apply to a given letter, for a current axiom.
     * It uses the helper function predecessorMatchesLetter to match most of the work
     * @param {Letter<ParamsValue>} letter Letter we're finding production for
     * @param {Axiom} currentAxiom Current axiom that the leter is in
     * @returns {Production}  The production that matches
     * @throws Errors if there are more than one, or no matches
     */
    findProduction: (letter: Letter<ParamsValue>, currentAxiom: Axiom, currentIndex: number) => Production;
}
