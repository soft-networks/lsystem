import {parseAxiom, parsePredecessor, parseProduction, parseSuccessor} from "../src/parser";
import { Letter, ParamsValue, sym, ParamsName, Params, ParamsRule } from "../src/types";


let testAxiom = true, testSuccessor = true, testPredecessor = true, testProduction = true;

//RUN TESTS
if (testAxiom) {
  let axiomInputs = ["ABC", "A(1)", "A(1,2)"];
  let axiomOutputs = [[gL("A"), gL("B"), gL("C")], 
                      [gL("A", [1])], 
                      [gL("A", [1,2])],
                      [gL("A", [1,2]), gL("B")]]
  runnerHelper("Axiom", axiomInputs, axiomOutputs, parseAxiom, compareAxiom);
  let axiomErrors = ["{", "A((1"];
  errorHelper("axiom", axiomErrors, parseAxiom); 
}
if (testSuccessor) {
  let successorInputs = ["A", "A(x*2)XA", "FAB", "A(x * 2, y * 3)", "A((2 *x+3) +(4 * y))B"];
  let successorInputParams = [undefined, ['x'], undefined, ['x', 'y'], ['x', 'y']]
  let successorOutputs = [gS([gL("A")]), 
                          gS([gL("A", [(x) => 2*x]), gL("X"), gL("A")]),
                          gS([gL("F"), gL("A"), gL("B")]),
                          gS([gL("A", [(x,y)=> 2*x, (x,y)=> y*3])]),
                          gS([gL("A", [(x,y) => ((2*x+3) + (4*y))]), gL("B")])]
  runnerHelper("Succesor", successorInputs, successorOutputs, (s,i) => parseSuccessor(s, successorInputParams[i]), compareSuccessor);
}
if (testPredecessor){
  let predInputs = ["A", "A<B>C", "A<B(x,y)>C", "B(x,y){x>y}", "B(x,y){x+y>2}"];
  let predOutputs = [ gP(gL("A")), 
                      gP(gL("B"), {left: "A", right:"C"}),
                      gP(gL("B",["x","y"]), {left: "A", right:"C"}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x > y}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x + y > 2}),
                    ]
  runnerHelper("Succesor", predInputs, predOutputs, parsePredecessor, comparePredecessor);                  
  let incorrectPredInputs = ["{", "B(a,", "B{x", "B<<"]
  errorHelper("Predecessor", incorrectPredInputs, parsePredecessor);
}
if (testProduction) {
  let productionInputs = ["A : AF", "A<B(x)>R:B(1)A","A(x,y){x>y}: A(x*2, y*3)F"]
  let productionOutputs = [ gPd(gP(gL("A")), 
                                gS([gL("A"), gL("F")])),
                            gPd(gP(gL("B",['x']), {left: 'A', right:'R'}), 
                                gS([gL("B",[(x) => 1]), gL("A")])),
                            gPd(gP(gL("A",['x', 'y']), undefined, (x,y) => x > y), 
                                gS([gL("A",[(x,y) => x*2, (x,y) => y*3]), gL("F")]))]
  runnerHelper("Production", productionInputs, productionOutputs, parseProduction, compareProduction);
}

//COMPARISON FUNCTIONS
function compareAxiom(tOut, aOut) {
  expect(tOut).toEqual(aOut);
}
function compareProduction(tOut, pOut) {
  comparePredecessor(tOut.predecessor, pOut.predecessor);
  compareSuccessor(tOut.successor, pOut.successor);
}
function comparePredecessor(tOut, pOut) {
  expect(tOut.letter.symbol).toEqual(pOut.letter.symbol)
  expect(tOut.context).toEqual(pOut.context);
  if (tOut.condition) {
    expect(pOut.condition).toEqual(expect.any(Function));
    expect(tOut.condition(1,2,3,4)).toEqual(pOut.condition(1,2,3,4));
  }
}
function compareSuccessor(tOut, sOut) {
  let tLetters = tOut.letters;
  let sLetters = sOut.letters; 
  tLetters.forEach((tLetter, i2) => {
    let sLetter = sLetters[i2];
    expect(tLetter.symbol).toEqual(sLetter.symbol);
    if (tLetter.params) {
      let tFunctions = tLetter.params;
      let sFunctions = sLetter.params;
      expect(tFunctions.length).toEqual(sFunctions.length);
      tFunctions.forEach((tFunc, i3) => {
        let sFunc = sFunctions[i3];
        expect(sFunc).toEqual(expect.any(Function));
        expect(tFunc(1,2,3)).toEqual(sFunc(1,2,3));
      })
    }
  })
}

//HELPERS
function runnerHelper(type, tInputs, tOutputs, converter, tester) {
  tInputs.forEach((tInput, index) => {
    let tOut = tOutputs[index];
    let actual = converter(tInput, index);
    test(type + ": " + tInput, () => {
      tester(tOut, actual);
    })
  })
}
function errorHelper(type, wrongInputs, converter) {
  wrongInputs.forEach((input) => {
    test(type + " bad: " + input, () => {
      expect(() => converter(input)).toThrowError()
    })
  })
}
function gL(symbol, params?): Letter<Params> {
  return {
    symbol: symbol,
    params: params 
  }
}
function gP(letter, context?, condition?) {
  return {
    letter: letter,
    context: context,
    condition: condition
  }
}
function gS(letters) {
  return {letters: letters}
}
function gPd(p,s) {
  return {
    successor: s,
    predecessor: p
  }
}
