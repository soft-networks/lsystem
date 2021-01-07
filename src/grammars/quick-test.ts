import nearley from "nearley"
import {default as axiomGrammar} from "./axiom"
import {default as predecessorGrammar} from "./predecessor"
import {default as successorGrammar} from "./successor"
import {default as productionGrammar} from "./production";

import util from "util";

let axiomTests = ["A", "B(1,2)", "C(1,1.5)A"];
let predecessorTests = ["A", "A(a,b)", "A<B", "r<A(a)>x"]
let successorTests = ["A(x*2)XA"] //, "{5}A(1+3)", "ABCSDA", "ABC(1,3,a+b){5}","FFA(24*rnd(1,3))"]
let productionTests = ["A<B(x)>R:B(1)A"];



let currentTests = productionTests;
let cGrammar = nearley.Grammar.fromCompiled(productionGrammar);

// parser.feed("A");
// showResults(parser);


// parser.feed("A(1)");
// showResults(parser);

currentTests.forEach((test) => {
  let parser = new nearley.Parser(cGrammar);
  console.log("Testing: " + test + "///");
  parser.feed(test);
  showResults(parser);
})

function showResults(parser) {
  let results = parser.results;
  if (parser.results.length ==0 ){
    console.log("FAIL");
  }
  else if (parser.results.length !== 1) {
    console.log("!!!!! AMBIGUOUS !!!")
  }
  results.forEach((result) => {
    console.log(util.inspect(result, false, 3, true))
  })
}
