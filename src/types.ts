
//Core values
type sym = string;
interface Letter<ParamType extends Params> {
  symbol: sym;
  params?: ParamType;
}

//Types for Parameters
type ParamsValue = (string | number)[]
type ParamsName = string[]
interface ParamsExpanded {
  [name: string]: number | string;
}
type ParamsRule = ((...params: (number|string)[]) => (string|number))[]
type Condition = (...params: (number|string)[]) => boolean;
type Params = ParamsValue | ParamsName | ParamsExpanded | ParamsRule;
type Context = { left?: Letter<ParamsName>, right?: Letter<ParamsName> }

//Rules
interface Predecessor {
  letter: Letter<ParamsName>;
  context?: Context;
  condition?: Condition;
}
interface Successor {
  letters: Letter<ParamsRule>[]
  weight?: number
}

type Axiom =
  Letter<ParamsValue>[]

interface Production {
  predecessor: Predecessor;
  successor: (Successor) | (Successor[])
}


export {sym, Letter, ParamsValue, ParamsName, ParamsExpanded,ParamsRule, Params, Condition, Context, Predecessor, Successor, Axiom, Production}