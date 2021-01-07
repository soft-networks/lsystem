@preprocessor typescript

Main -> string ":" string {% (d) => ({predecessorString: d[0], successorString: d[2] }) %} 
string -> [^:]:+ {% (d) => d[0].join('') %}