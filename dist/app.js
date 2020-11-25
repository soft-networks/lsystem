"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const parser_1 = require("./parser");
const app = express_1.default();
const port = 8000;
app.get('/', (req, res) => {
    function output(input) {
        let output;
        output = parser_1.parseAxiom(input);
        if (output) {
            output.forEach((letter) => {
                console.log("Something");
                console.log(letter.symbol);
                if (letter.params) {
                    console.log(letter.params);
                }
            });
        }
        return output;
    }
    let thing = output("ABC");
    console.log(thing);
    res.send("Check console");
});
app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
}).on("error", (err) => {
    console.log("ERROR!");
    console.log(err);
});
process.on('SIGINT', () => process.exit(1));
//# sourceMappingURL=app.js.map