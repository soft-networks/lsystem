import { Letter, Axiom, ParamsName, Params, Predecessor, Successor } from "./interfaces";
export declare function parseAxiom(axiom: string): Axiom;
export declare function parseProduction(productionString: string): {
    predecessor: Predecessor;
    successor: Successor;
};
export declare function parsePredecessor(predecessor: string): Predecessor;
export declare function parseSuccessor(successor: string, paramsName: ParamsName): Successor;
export declare function parseProductions(productionStrings: string[]): {
    predecessor: Predecessor;
    successor: Successor;
}[];
export declare function axiomToStr(sentence: Letter<Params>[]): string;
