import nearley from "nearley"
import {default as axiomGrammar} from "./axiom"
import {default as predecessorGrammar} from "./predecessor"
import util from "util";

let axiomTests = ["A", "B(1,2)", "C(1,1.5)A"];
let predecessorTests = ["A", "A(a,b)", "A<B", "r<A(a)>x"]

let currentTests = predecessorTests;
let cGrammar = nearley.Grammar.fromCompiled(predecessorGrammar);

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
  if (parser.results.length !== 1) {
    console.log("!!!!! AMBIGUOUS !!!")
  }
  results.forEach((result) => {
    console.log(util.inspect(result, false, 3, true))
  })
}
