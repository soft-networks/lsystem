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
    let outputAsString = l.getIterationAsString();
    expect(testCase.expectedOutput).toEqual(output);
    expect(output).toEqual(outputAsString);
  })
})

//Overloading the iteration value in iterate 
let overLoadIterations = 50;
let overLoadTestCase = simpleTestCases[0];
let overLoadOutput = "FFA(2)XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
test(overLoadTestCase.name + " overloaded iterations", () => {
  let l = new LSystem(overLoadTestCase.axiom, overLoadTestCase.productions, 1);
  let output = l.iterate(overLoadIterations);
  expect(overLoadOutput).toEqual(output);
})


//Returning as object
test('Return as object', () => {
  let l = new LSystem("A", ["A:B"], 1);
  let output = l.getIterationAsObject();
  let expected : Axiom = [{symbol: "B"}];
  expect(expected).toEqual(output);
})

test('Storing of inputs', () => {
  let l = new LSystem("A", ["A:AB"], 1);
  let e1 = ["A", "AB"];
  expect(e1).toEqual(l.getAllIterationsAsString());
  let e5 = ["A", "AB", "ABB", "ABBB", "ABBBB", "ABBBBB"];
  l.iterate(5);
  expect(e5).toEqual(l.getAllIterationsAsString());
})


//TODO:
// TEST WEIGHTED OUTPUT