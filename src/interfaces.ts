//Core Types
type sym = string;
interface Letter<ParamType extends Params = Params> {
  symbol: sym;
  params?: ParamType;
}
type Axiom =
  Letter<ParamsValue>[]

//ParamTypes
type ParamsValue = (string | number)[]
type ParamsName = string[]
type ParamsRule = ((...params: (number|string)[]) => (string|number))[]
type Condition = (...params: (number|string)[]) => boolean;
type Params = ParamsValue | ParamsName |  ParamsRule;
type Context = { left?: Letter<ParamsName>, right?: Letter<ParamsName> }

//Productions and rules
interface Production {
  predecessor: Predecessor;
  successor: (Successor) | (Successor[])
}
interface Predecessor {
  letter: Letter<ParamsName>;
  context?: Context;
  condition?: Condition;
}
interface Successor {
  letters: Letter<ParamsRule>[]
  weight?: number
}

export {sym, Letter, Axiom, ParamsValue, ParamsName, ParamsRule, Condition, Params, Context, Production, Predecessor, Successor }

