# L-System

A work in progress node module (my very first), that generates L-Systems including all features from Algorithmic Beauty of Plants.

# Scripts to get going

`npm run start-parser`: Runs the parser on a variety of inputs, showing outputs
`npm run start-lsystem`: Runs the lsystem on a basic string, iterates it
`npm run test`: Runs test with jest, parser only for now
`npm watch`: Runs typescript (tsc) in watch mode.

# TODO

-[] Fix Error throwing (introduce error types) across the board
-[] Look at type system, be more frugal with type usage, potentially rename axiom
-[] Add Comments + JSDoc
-[] Add Readme
-[] Fix npmignore (remove it and just do "include" in package.json?)
-[] Rewrite parser.ts to use a lexer / parser
