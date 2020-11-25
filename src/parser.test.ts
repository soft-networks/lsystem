import {parseAxiom, parsePredecessor, parseSuccessor} from "./parser";
import { Letter, ParamsValue, sym, ParamsName, Params, ParamsRule } from "./types";


testAxiom();
testPredecessor();
testSuccessor();

//Axiom
function testAxiom() {
  let axiomInputs = ["ABC", "A(1)", "A(1,2)"];
  let axiomOutputs = [[gL("A"), gL("B"), gL("C")], 
                      [gL("A", [1])], 
                      [gL("A", [1,2])],
                      [gL("A", [1,2]), gL("B")]
                    ]
  let axiomErrors = ["{", "A((1"];
  equalityHelper("axiom", axiomInputs, axiomOutputs, parseAxiom);
  errorHelper("axiom", axiomErrors, parseAxiom);
}
//Predecessor
function testPredecessor() {
  let predInputs = ["A", "A<B>C", "A<B(x,y)>C", "B(x,y){x>y}", "B(x,y){x+y>2}"];
  let predOutputs = [ gP(gL("A")), 
                      gP(gL("B"), {left: "A", right:"C"}),
                      gP(gL("B",["x","y"]), {left: "A", right:"C"}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x > y}),
                      gP(gL("B",["x","y"]), undefined, function(x,y) { return x + y > 2}),
                    ]
  predInputs.forEach((input, index) => {
    test("Predecessor: " + input, () => {
      let pOut = parsePredecessor(input);
      let tOut = predOutputs[index];

      expect(pOut.letter).toEqual(tOut.letter)
      expect(pOut.context).toEqual(tOut.context);
      if (tOut.condition) {
        expect(pOut.condition).toEqual(expect.any(Function));
        expect(pOut.condition(1,2,3,4)).toEqual(tOut.condition(1,2,3,4));
      }
    })
  })
  let incorrectPredInputs = ["{", "B(a,", "B{x", "B<<"]
  errorHelper("Predecessor", incorrectPredInputs, parsePredecessor);
}
//Successor
function testSuccessor() {
  let successorInputs = ["A", "A(x*2)XA", "FAB", "A(x * 2, y * 3)", "A((2 *x+3) +(4 * y))B"];
  let successorInputParams = [undefined, ['x'], undefined, ['x', 'y'], ['x', 'y']]
  let successorOutputs = [gS([gL("A")]), 
                          gS([gL("A", [(x) => 2*x]), gL("X"), gL("A")]),
                          gS([gL("F"), gL("A"), gL("B")]),
                          gS([gL("A", [(x,y)=> 2*x, (x,y)=> y*3])]),
                          gS([gL("A", [(x,y) => ((2*x+3) + (4*y))]), gL("B")])]

  successorInputs.forEach((tInput, index) => {
    test("Successor: " + tInput, () => {
      let sOut = parseSuccessor(tInput, successorInputParams[index]);
      let tOut = successorOutputs[index];
      
      let tLetters = tOut.letters;
      let sLetters = sOut.letters; 
      tLetters.forEach((tLetter, i2) => {
        let sLetter = sLetters[i2];
        expect(sLetter.symbol).toEqual(tLetter.symbol);
        if (tLetter.params) {
          let tFunctions = tLetter.params;
          let sFunctions = sLetter.params;
          expect(tFunctions.length).toEqual(sFunctions.length);
          tFunctions.forEach((tFunc, i3) => {
            let sFunc = sFunctions[i3];
            expect(sFunc).toEqual(expect.any(Function));
            expect(sFunc(1,2,3)).toEqual(tFunc(1,2,3));
          })
        }
      })
    })
  })
}
//Helpers
function equalityHelper(type, inputs, outputs, converter) {
  inputs.forEach((input, index) => {
    test(type + ": " + input, () => {
      let pOut = converter(input);
      let tOut = outputs[index];
      expect(pOut).toEqual(tOut);
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