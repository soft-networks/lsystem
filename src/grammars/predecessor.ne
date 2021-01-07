@preprocessor typescript
@builtin "number.ne" 

#Axiom 
#Main -> "A"
Main -> Predecessor {% id %}

Predecessor -> PLetters  {% id %}
Predecessor -> PLetters  "{" PCondition "}" {% (d) => ({letter: d[0].letter, context: d[0].context, conditionString: d[2] }) %}

#Predecessor Letter + context
PLetters -> PLetter {% (d) => ({letter: d[0]}) %}
PLetters -> PLetter "<" PLetter {% (d) => ({letter: d[2], context: {left: d[0]}}) %}
PLetters -> PLetter ">" PLetter {% (d) => ({letter: d[0], context: {right: d[0]}}) %}
PLetters -> PLetter "<" PLetter ">" PLetter {% (d) => ({letter: d[2], context: {left: d[0], right: d[4]}}) %}

#Predecessor condition can be anything. We clean it in parser.
PCondition -> .:* {% (d) => d[0].join('') %}

#Predecessor Letter			 
PLetter -> symbol {% (d) => ({symbol: d[0],params: undefined}) %}
PLetter -> symbol  "(" PParams ")" {% (d) => ({symbol: d[0], params: d[2]}) %}


#Deal with the params
#TODO: ADD WHITESPACE?
PParams -> PPsymbol # just one param 
PParams -> PPsymbol PParam:+ {% (d) => [d[0],...d[1]] %} #Many params. Deconstruct recursive calls
PParam -> "," PPsymbol {% ([c,n]) => n %} 
PPsymbol -> [a-zA-Z]:+ {% (d) => d[0].join('')%}

symbol -> [^,():{}<>] {% id %}

