const lib = require("safe_library");

console.log("Hello");

module.exports = function(req, res) { 
    myData = {
        y : 1
    };

    res.send("Hello World!" + lib.doSomething(myData, function(obj) {
        obj.x = 999;
        console.log("obj.x is " + obj.x);
    }) + myData.y);
}