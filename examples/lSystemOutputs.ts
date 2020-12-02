import LSystem from "../src/lsystem";
import { parseAxiom, parseProduction, parseProductions } from "../src/parser";
import { Axiom, Production } from "../src/types";
import util from "util";



//Basic test
let a1 = parseAxiom("A(0)");
let i1 = 20;
let p1 = parseProductions(["A(x){x<2}: FA(x+1)","A(x){x>=2} : A(x)X"]);
let l1 = new LSystem(a1, p1, i1);

console.log("**** Created Lsystem");
console.log(util.inspect(l1, false, null, true));

console.log("**** Iterated " + i1 + " times");
let r1 = l1.iterate();
console.log(r1);

//Weighted selection
let a2 = parseAxiom("A");
let p2 = parseProductions(["A:1", "A:2", "A:3", "A:4", "A:{20}5"]);
let i2 = 2;
let l2 = new LSystem(a2,p2, i2);

console.log("**** Created Lsystem");
console.log(util.inspect(l2, false, null, true));

console.log("**** Iterated " + i2 + " times");
let r2 = l2.iterate();
console.log(r2);
