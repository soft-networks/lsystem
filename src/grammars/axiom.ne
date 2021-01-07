@preprocessor typescript
@builtin "number.ne" 

#Axiom 
Main -> ALetter:+ {% id %}

#Wrap each letter in a Letter
ALetter -> symbol  {% (d) => ({symbol: d[0], params: undefined}) %}
ALetter -> symbol "(" AxiomParams ")" {% ([l,x,p]) => ({symbol: l, params: p}) %}

#Deal with the params
AxiomParams -> decimal # just one param 
AxiomParams -> decimal AxParam:+ {% (d) => [d[0],...d[1]] %} #Many params. Deconstruct recursive calls
AxParam -> "," decimal {% ([c,n]) => n %} 

symbol -> [^,():{}<>] {% id %}

