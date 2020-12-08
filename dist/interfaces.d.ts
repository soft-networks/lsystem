declare type sym = string;
interface Letter<ParamType extends Params = Params> {
    symbol: sym;
    params?: ParamType;
}
declare type Axiom = Letter<ParamsValue>[];
declare type ParamsValue = (string | number)[];
declare type ParamsName = string[];
declare type ParamsRule = ((...params: (number | string)[]) => (string | number))[];
declare type Condition = (...params: (number | string)[]) => boolean;
declare type Params = ParamsValue | ParamsName | ParamsRule;
declare type Context = {
    left?: Letter<ParamsName>;
    right?: Letter<ParamsName>;
};
interface Production {
    predecessor: Predecessor;
    successor: (Successor) | (Successor[]);
}
interface Predecessor {
    letter: Letter<ParamsName>;
    context?: Context;
    condition?: Condition;
}
interface Successor {
    letters: Letter<ParamsRule>[];
    weight?: number;
}
export { sym, Letter, Axiom, ParamsValue, ParamsName, ParamsRule, Condition, Params, Context, Production, Predecessor, Successor };
