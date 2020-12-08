import { Letter, Axiom, ParamsName, Params, Production, Predecessor, Successor } from "./interfaces";
export declare function parseAxiom(axiom: string): Axiom;
export declare function parseProductions(productionStrings: string[]): Production[];
export declare function parseProduction(productionString: string): Production;
export declare function parsePredecessor(predecessor: string): Predecessor;
export declare function parseSuccessor(successor: string, paramsName: ParamsName): Successor;
export declare function axiomToStr(sentence: Letter<Params>[]): string;
