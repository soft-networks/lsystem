import nearley from "nearley"
import grammar from "./axiom"
import util from "util";

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

let tests = ["A", "B(1,2)", "C(1,1.5)A"];

tests.forEach((test) => {
  console.log("Testing: " + test);
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