import nearley from "nearley"
import {default as axiomGrammar} from "../src/grammars/axiom"
import {default as predecessorGrammar} from "../src/grammars/predecessor"
import {default as successorGrammar} from "../src/grammars/successor"
import {default as productionGrammar} from "../src/grammars/production";

import util from "util";


let axiomTests = ["A", "B(1,2)", "C(1,1.5)A"];

console.log("\n----------------------");
console.log("❶ AXIOM");
console.log("----------------------");
runTests(axiomTests, axiomGrammar);

console.log("\n----------------------");
console.log("❷ PREDECESSOR");
console.log("----------------------");
let predecessorTests = ["A", "A(a,b)", "A<B", "r<A(a)>x"];
runTests(predecessorTests, predecessorGrammar);

console.log("\n----------------------");
console.log("❸ SUCCESSOR");
console.log("----------------------");
let successorTests = ["A(x*2)XA", "{5}A(1+3)", "ABCSDA", "ABC(1,3,a+b){5}","FFA(24*rnd(1,3))"]
runTests(successorTests, successorGrammar);

console.log("\n----------------------");
console.log("❹ PRODUCTION");
console.log("----------------------");
let productionTests = ["A<B(x)>R:B(1)A"];
runTests(productionTests, productionGrammar);


function runTests(currentTests, currentGrammar) {
  currentTests.forEach((test) => {
    let parser = new nearley.Parser(currentGrammar);
    console.log("........");
    console.log("Testing: " + test + "/EOF");
    parser.feed(test);
    showResults(parser);
  })
}


function showResults(parser) {
  let results = parser.results;
  if (parser.results.length ==0 ){
    console.log("FAIL");
  }
  else if (parser.results.length !== 1) {
    console.log("Grammar is ambiguous !!!")
  }
  results.forEach((result) => {
    console.log(util.inspect(result, false, 3, true))
  })
}
