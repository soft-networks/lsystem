import LSystem from "../src/lsystem";
import { parseAxiom, parseProduction, parseProductions } from "../src/parser";
import { Axiom} from "../src/interfaces"


//Simple test cases
let simpleTestCases = [{
  name: "Simple test",
  axiom: "A(0)",
  productions: ["A(x){x<2}: FA(x+1)","A(x){x>=2} : A(x)X"],
  iterations: 20,
  expectedOutput: "FFA(2)XXXXXXXXXXXXXXXXXX"
}, {
  name: "Context matching",
  axiom: "ABC",
  productions: ["A<B>C:Y", "R<A>R:X"],
  iterations: 1,
  expectedOutput: "AYC"
}]

simpleTestCases.forEach((testCase) => {
  test(testCase.name, () => {
    let l = new LSystem(testCase.axiom, testCase.productions, testCase.iterations);
    let output = l.iterate();
    expect(testCase.expectedOutput).toEqual(output);
  })
})

//Overloading the iteration value in iterate 
let overLoadIterations = 50;
let overLoadTestCase = simpleTestCases[0];
let overLoadOutput = "FFA(2)XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
test(overLoadTestCase.name + " overloaded iterations", () => {
  let l = new LSystem(overLoadTestCase.axiom, overLoadTestCase.productions, 1);
  let output = l.iterate({iterations: overLoadIterations});
  expect(overLoadOutput).toEqual(output);
})


test('Return as object', () => {
  let l = new LSystem("A", ["A:B"], 1);
  let output = l.iterate({asString: false});
  let expected : Axiom = [{symbol: "B"}];
  expect(expected).toEqual(output);
})

//TODO:
// TEST WEIGHTED OUTPUT