@preprocessor typescript
@builtin "number.ne" 

Main -> Successor {% id %}

Successor -> SLetter:+  {% (d)=>({letters: d[0]}) %}
Successor -> SWeight SLetter:+  {% (d)=>({letters: d[1], weight: d[0]}) %}
Successor -> SLetter:+ SWeight  {% (d)=>({letters: d[0], weight: d[1]}) %}
SWeight -> "{" decimal "}"  {% (d)=>d[1] %}
SLetter -> symbol {% (d) => ({symbol: d[0]}) %}
SLetter -> symbol "(" SParams ")" {% (d) => ({ symbol: d[0], paramsString: d[2] }) %}
symbol -> [^,():{}<>] {% id %}

SParams -> SPSymbol {% id %}
SParams -> SPSymbol SParam:+ {% (d) => [d[0],...d[1]] %}
SParam -> "," SPSymbol {% ([c,p]) => p %}

SPSymbol -> math
math -> AS {% id %}

# Parentheses
P -> "(" AS ")" {% (d) => "(" + d[1] + ")" %}
    | N             {% id %}
# Exponents
E -> P "^" E    {% (d) => "Math.pow(" + d[0] + "," + d[2] + ")" %}
    | P             {% id %}
# Multiplication and division
MD -> MD "*" E  {% (d) => d[0] + "*" + d[2]  %}
    | MD "/" E  {% (d) => d[0] + "/" + d[2]  %}
    | E             {% id %}
# Addition and subtraction
AS -> AS "+"  MD {% (d) => d[0] + "+" + d[2] %}
    | AS "-" MD {% (d) => d[0] + "-" + d[2]%}
    | MD            {% id %}
# A number or a function of a number
N -> mathsymbol     {% id %}
    | "sin" P     {% (d) => "Math.sin(" + d[1] + ")" %}
    | "cos" P     {% (d) => "Math.cos(" + d[1] + ")" %}
    | "tan" P     {% (d) => "Math.tan(" + d[1] + ")" %}
    
    | "asin" P    {% (d) => "Math.asin(" + d[1] + ")" %}
    | "acos" P    {% (d) => "Math.acos(" + d[1] + ")" %}
    | "atan" P    {% (d) => "Math.atan(" + d[1] + ")" %}

    | "pi"          {% (d) => "Math.PI" %}
    | "e"           {% (d) => "Math.E" %}
    | "sqrt" P    {% (d) => "Math.sqrt(" + d[1] + ")" %}
    | "ln" P      {% (d) => "Math.log(" + d[1] + ")"  %}
	| "rnd()"		{% (d) => "Math.random()" %}
	| "rnd(" AS "," AS  ")" {% (d) => `Math.random()*((${d[3]}) - (${d[1]}))+(${d[3]})` %}
#Mathsymbol is either a decimal, int or a string (because it can be a variable)
mathsymbol -> decimal  {% id %}
		| [a-zA-Z]:+    {% (d) => d[0].join("") %}

