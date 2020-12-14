import {parseAxiom, parsePredecessor, parseProduction, parseProductions, parseSuccessor} from "../src/parser";
import {Letter, Params, Successor } from "../src/interfaces"
import LSystem from "../src";
import util from "util"


let runAllTests = true;
let testAxiom = false, testSuccessor = false, testPredecessor = false, testProduction = false, testStochastic = false;

//RUN TESTS
if (testAxiom || runAllTests) {
  let axiomInputs = ["ABC", "A(1)", "A(1,2)"];
  let axiomOutputs = [[gL("A"), gL("B"), gL("C")], 
                      [gL("A", [1])], 
                      [gL("A", [1,2])],
                      [gL("A", [1,2]), gL("B")]]
  runnerHelper("Axiom", axiomInputs, axiomOutputs, parseAxiom, compareAxiom);
  let axiomErrors = ["{", "A((1"];
  errorHelper("axiom", axiomErrors, parseAxiom); 
}
if (testSuccessor || runAllTests) {
  let successorInputs = ["A", "A(x*2)XA", "FAB", "A(x * 2, y * 3)", "A((2 *x+3) +(4 * y))B", "{4}A", "A{10}"];
  let successorInputParams = [undefined, ['x'], undefined, ['x', 'y'], ['x', 'y'], undefined]
  let successorOutputs: Successor[] = [gS([gL("A")]), 
                          gS([gL("A", [(x) => 2*x]), gL("X"), gL("A")]),
                          gS([gL("F"), gL("A"), gL("B")]),
                          gS([gL("A", [(x,y)=> 2*x, (x,y)=> y*3])]),
                          gS([gL("A", [(x,y) => ((2*x+3) + (4*y))]), gL("B")]),
                          gS([gL("A")], 4),
                          gS([gL("A")], 10)]
  runnerHelper("Succesor", successorInputs, successorOutputs, (s,i) => parseSuccessor(s, successorInputParams[i]), compareSuccessor);
  let successorErrors = ["{4A"];
  errorHelper("successor", successorErrors, (s,i) => parseSuccessor(s, successorInputParams[i]))
}
if (testPredecessor || runAllTests){
  let predInputs = ["A", "A<B>C", "A(x)<B(x,y)>C", "B(x,y){x>y}", "B(x,y){x+y>2}"];
  let predOutputs = [ gP(gL("A")), 
                      gP(gL("B"), {left: gL("A"), right: gL("C")}),
                      gP(gL("B",["x","y"]), {left: gL("A", ['x']), right:gL("C")}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x > y}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x + y > 2}),
                    ]
  runnerHelper("Succesor", predInputs, predOutputs, parsePredecessor, comparePredecessor);                  
  let incorrectPredInputs = ["{", "B(a,", "B{x", "B<<"]
  errorHelper("Predecessor", incorrectPredInputs, parsePredecessor);
}
if (testProduction || runAllTests) {
  let productionInputs = ["A : AF", "A<B(x)>R:B(1)A","A(x,y){x>y}: A(x*2, y*3)F"]
  let productionOutputs = [ gPd(gP(gL("A")), 
                                gS([gL("A"), gL("F")])),
                            gPd(gP(gL("B",['x']), {left: gL('A'), right:gL('R')}), 
                                gS([gL("B",[(x) => 1]), gL("A")])),
                            gPd(gP(gL("A",['x', 'y']), undefined, (x,y) => x > y), 
                                gS([gL("A",[(x,y) => x*2, (x,y) => y*3]), gL("F")]))]
  runnerHelper("Production", productionInputs, productionOutputs, parseProduction, compareProduction);
}
if (testStochastic || runAllTests) {
  let stochInputs = [["A: X", "A:Y"], ["A(x): X", "A(x): Y", "A(x): B"], ["A(r): R", "A(r): {2} R"]];
  let stochOutputs = [[gPds(gP(gL("A")), 
                          gS([gL("X")]), gS([gL("Y")]))],
                      [gPds(gP(gL("A", ['x'])),
                          gS([gL("X")]), gS([gL("Y")]), gS([gL("B")]))],
                      [gPds(gP(gL("A", ['r'])),
                           gS([gL("R")]), gS([gL("R")],2))]
                      ]              
  runnerHelper("Stochastic", stochInputs, stochOutputs, (p) =>  new LSystem("A", p).productions, compareProductions);                    
}

//COMPARISON FUNCTIONS
function compareAxiom(tOut, aOut) {
  expect(tOut).toEqual(aOut);
}
function compareProduction(tOut, pOut) {
  comparePredecessor(tOut.predecessor, pOut.predecessor);
  if (tOut.successor.length) {
    expect(pOut.successor).toEqual(expect.any(Array));
    tOut.successor.forEach((tOutSuccessor, index) => {
      let pOutSuccessor = pOut.successor[index];
      compareSuccessor(tOutSuccessor, pOutSuccessor);
    })
  } else {
    compareSuccessor(tOut.successor, pOut.successor);
  }
}
function compareProductions(tProds, pProds) {
  tProds.forEach((tProd, index) => {
    compareProduction(tProd, pProds[index]);
  })
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
  if (tOut.weight !== undefined) {
    expect(tOut.weight).toEqual(sOut.weight);
  }
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
    test(type + ": " + tInput, () => {
      try {
      let actual = converter(tInput, index);
      tester(tOut, actual);
      } catch (e) {
        fail(e);
      }
    })
  })
}
function errorHelper(type, wrongInputs, converter) {
  wrongInputs.forEach((input, index) => {
    test(type + " bad: " + input, () => {
      expect(() => converter(input, index)).toThrowError()
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
function gS(letters, weight?) {
  return {letters: letters, weight: weight}
}
function gPd(p,s, ...additionalS) {
  return {
    successor: s,
    predecessor: p
  }
}

function gPds(p, ...s) {
  return {
    successor: [...s],
    predecessor: p
  }
}