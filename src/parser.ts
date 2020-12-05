
let reservedChars = ["(", ")", ":", "{", "}"]
export function parseAxiom(axiom: string): Axiom {
  return parseSentence(axiom, parseParamsArray) as Axiom
}

//TODO: this will break if the strings aren't equivialent A(X), A(Y)
export function parseProductions(productionStrings: string[]) {
  let productionMap : { [predString: string]: Production} = {}
  productionStrings.forEach((productionString)=> {
   let splitString = splitProduction(productionString);
   let predString = splitString[0].trim();
   let existingProd = productionMap[predString];
   if (existingProd) {
     //console.log("Existing pred exists, adding to that directly");
     let successorString = splitString[1].trim();
     let successor : Successor = parseSuccessor(successorString, existingProd.predecessor.letter.params);
     if (existingProd.successor instanceof Array) {
      existingProd.successor.push(successor);
     } else {
       existingProd.successor = [existingProd.successor as Successor, successor];
     }
   } else {
     productionMap[predString] = parseProduction(productionString);
   }
  })
  let productions = Object.values(productionMap);
  return productions;
}

export function parseProduction(productionString: string) {
  let productionStringArray = splitProduction(productionString);
  let predecessor : Predecessor = parsePredecessor(productionStringArray[0]);
  let successor : Successor = parseSuccessor(productionStringArray[1], predecessor.letter.params);
  let production : Production =  {
    predecessor: predecessor, successor: successor
  }
  return production
}
function splitProduction(productionString: string) {
  let productionStringArray = productionString.split(":");
  if (productionStringArray.length !== 2) 
    throw Error("Could not create production, wrong number of : delimiter");  
  return productionStringArray;
}

//TODO: ASSUMES CONTEXT HAS NO PARAMS. FIX.
export function parsePredecessor(predecessor: string) : Predecessor {
  let p = predecessor.slice().trim();
  //See if we have a condition. Remove it from string. 
  //We do this first, because we can have arbitrary strings within the {}
  let conditionString;
  if (p.includes("{") || p.includes("}")) {
    if (! (p.includes("{") && p.includes("}")))
      throw Error("Mis constructed condition in %s needs open and closed braces " + p);
    let startPos = p.indexOf("{");
    let endPos = p.indexOf("}");
    conditionString = p.substring(startPos +1, endPos);
    p = p.substring(0, startPos).trim();
    //console.log("Found condition %s removed it now we have %s", conditionString, p);
  }
  //Now see if we have context, and parse them
  let cLeft, cRight; 
  if (p.includes("<")) {
    let splitLeft = p.split("<");
    if (splitLeft.length !=2) 
      throw new Error("Mis constructed left context" + predecessor);
    cLeft = parseSentence(splitLeft[0], parseParamsArray)[0] as Letter<ParamsName>
    p = splitLeft[1].trim();
    //console.log("Found context %s removed it now we have %s", p, cLeft);
  }
  if (p.includes(">")) {
    let splitRight = p.split(">");
    if (splitRight.length !=2) 
      throw new Error("Mis constructed right context" + predecessor);
    cRight = parseSentence(splitRight[1], parseParamsArray)[0] as Letter<ParamsName>
    p = splitRight[0].trim();
    //console.log("Found context, removed it, now we have", p, cRight);
  }
  let context: Context = cLeft || cRight ? {left: cLeft, right: cRight} : undefined;
  //Now we should only have ONE letter left
  let pAsLetter : Letter<ParamsName>[] = parseSentence(p, parseParamsArray) as Letter<ParamsName>[];
  if (pAsLetter.length !=1) {
    throw new Error("Something went wrong in parsing letter for predecssor: " + p)
  }
  let predecessorLetter: Letter<ParamsName> = pAsLetter[0];
  if (conditionString && !predecessorLetter.params) {
    throw Error("There is a condition expecting params, but the predecessor has none");
  }
  //Create the actual condition
  let condition: Condition;
  if (conditionString) 
     condition  = parseFunc(conditionString, predecessorLetter.params);
  let output : Predecessor = {
    letter: predecessorLetter,
    context: context,
    condition: condition
  }
  //console.log("Parsed predecessor, here..." + output);
  return output;
}

export function parseSuccessor(successor: string, paramsName: ParamsName) : Successor{
  let s = successor, weight;
  if (s.includes("{") || s.includes("}")) {
    if (! (s.includes("{") && s.includes("}")))
      throw Error("Mis constructed weight in %s needs open and closed braces " + s);
    let startPos = s.indexOf("{");
    let endPos = s.indexOf("}");
    let weightString  = s.substring(startPos +1, endPos);
    if (!isNumeric(weightString)) {
      throw Error("Weight needs to be numeric" + weightString);
    }
    weight = parseFloat(weightString.trim());
    //TOOD: Clean up this code a bit
    s = s.replace("{" + weightString + "}","").trim();
  }
  let sLetters =  parseSentence(s, (str) => parseFunctions(str, paramsName)) as Letter<ParamsRule>[]
  return {
    letters: sLetters,
    weight: weight
  }
} 

//IMPORTANT HELPERS
export function parseSentence(axiom: string, paramParser: (string) => Params): Letter<Params>[] {
  axiom = axiom.trim();
  let numLetters = axiom.length;
  let parsedLetters: Letter<Params>[] = [];
  
  for (let i = 0; i < numLetters; i++) {
    let letterSymbol = axiom[i];
    
    if (reservedChars.includes(letterSymbol)) {
      throw Error("Axiom " + axiom + " has reserved char at" + i + "where it shouldnt be");
    }
    let letter: Letter<Params> = {
      symbol: letterSymbol
    }
    if ((i + 1) < numLetters) {
      let startPos = i+1;
      let nextSymbol = axiom[startPos];

      if (nextSymbol == "(") {
        let endPos = findEndBracket(axiom, startPos);
        //console.log("End pos is" + endPos + " start pos is " + startPos);
      let paramsString = axiom.substring(startPos + 1, endPos);
        //console.log("Sending paramString to paramParser: " + paramString);
        let params: Params = paramParser(paramsString) as Params;
        letter.params = params;
        i = endPos;
      }
    }
    parsedLetters.push(letter);
  }
  return parsedLetters;
}
function parseParamsArray(paramsString: string): ParamsValue | ParamsName {
  //console.log("Trimmed paramstring to" +  paramsString);
  let paramsArray: (string | number)[] = [];
  let paramStringArray = paramsString.split(",");
  if (paramStringArray.length === 0) {
    throw Error("Could not parse ParamsString" + paramsString);
  }
  paramStringArray.forEach((paramString) => {
    if (isNumeric(paramString)) {
      let num = parseFloat(paramString);
      paramsArray.push(num);
    } else {
      paramsArray.push(paramString);
    }
  })
  return paramsArray;
}
function parseFunctions(evalString: string, paramsNames: ParamsName) {
  let functionStringArray = evalString.split(",");
  let functions : ParamsRule = [];
  functionStringArray.forEach((functionString)=>{
    functionString = functionString.trim();
    //console.log("Creating function: " + functionString)
    functions.push(parseFunc(functionString, paramsNames));
  })
  return functions;
}
function parseFunc(evalString: string, paramsNames: ParamsName ){
  let paramString = paramsNames.join();
  let returnString = "return " + evalString;
  let functionString = `function (${paramString}) { ${returnString};}`
  //console.log("Creating function " + functionString);
  var func = new Function("return " + functionString)();
  return func;
}
function findEndBracket(axiom: string, startingPos: number): number {
  let i = startingPos + 1;
  let nestedBrackets = 1;
  let endPos;
  while (axiom[i] !== undefined) {
    if (axiom[i] == ")")
      nestedBrackets--;
    if (axiom[i] == "(")
      nestedBrackets++;
    if (nestedBrackets == 0){
      endPos = i;
      break;
    }
    i = i+1;
  }
  if (!endPos) {
    throw Error("Axiom has starting bracket but no end bracket" + axiom);
  }
  
  return endPos;
}
function isNumeric(str: string) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str as unknown as number) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}


export function axiomToStr(sentence: Letter<Params>[]): string {
  let axiomStr = sentence.reduce((str, l) => (str + letterToStr(l)), "");
  return axiomStr;
}

export function letterToStr(letter: Letter<Params>): string {
  let letterString = letter.symbol;
  if (letter.params) {
    let paramString = letter.params.toString();
    paramString = "(" + paramString + ")";
    letterString += paramString;
  }
  return letterString;
}