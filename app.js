const fs = require("fs");
const express = require("express");
const { VM } = require("vm2");
const getParameterNames = require('get-parameter-names');
const clone = require('clone');

function loadCode(name) {
    const code = fs.readFileSync(name, "utf8");
    const vm = new VM({
        sandbox: {
            require: loadLibrary,
            console: {
                log(s) {
                    console.log(s);
                }
            },
            module: {
            }        
        }
    });
    vm.run(code);
    return vm;
}

function sanitizeArgument(x) {
    if (x instanceof Function) {
        const args = getParameterNames(x);
        if (args.length == 1) {
            return function(arg1) { 
                return x(
                    sanitizeArgument(arg1)); 
            }
        } else {
            throw "Invalid argument count " + args.length;
        }
    } else {
        return clone(x);
    }
}

function loadLibrary(name) {
    const lib = loadCode(name + ".js");

    let stub = {};
    for (let name in lib._context.module.exports) {
        const args = getParameterNames(lib._context.module.exports[name]);
        if (args.length == 2) {
            stub[name] = function(a,b) { 
                return lib._context.module.exports[name](
                    sanitizeArgument(a),
                    sanitizeArgument(b)); 
            }
        } else {
            throw "Invalid argument count " + args.length;
        }
    }
    return stub;
}

const port = 3000;
const app = express();
app.get("/", loadCode("safe_controller.js")._context.module.exports);
app.listen(port, () => console.log("Example app listening on port " + port));
