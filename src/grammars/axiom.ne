@preprocessor typescript
@builtin "number.ne" 
@builtin "whitespace.ne" 

#Axiom 
Main -> ALetter:+ {% id %}

#Wrap each letter in a Letter
ALetter -> _ symbol _ {% ([w1,l]) => ({symbol: l, params: undefined}) %}
ALetter -> _ symbol "(" AxiomParams ")" _ {% ([w1,l,x,p]) => ({symbol: l, params: p}) %}

#Deal with the params
AxiomParams -> decimal # just one param 
AxiomParams -> decimal AxParam:+ {% (d) => [d[0],...d[1]] %} #Many params. Deconstruct recursive calls
AxParam -> "," decimal {% ([c,n]) => n %} 

symbol -> [0-9a-zA-z] {% id %}
