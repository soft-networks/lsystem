import LSystem from "../src/lsystem";
import { parseAxiom, parseProduction } from "../src/parser";
import { Axiom, Production } from "../src/types";
import util from "util";


let testAxiom : Axiom = parseAxiom("A(0)");

let testProductions : Production[] = [parseProduction("A(x){x<2}: FA(x+1)"), parseProduction("A(x){x>=2} : A(x)X")];
let lsystem : LSystem = new LSystem(testAxiom, testProductions, 20);

console.log(util.inspect(lsystem, false, null, true));

let result = lsystem.iterate();
console.log(result);
