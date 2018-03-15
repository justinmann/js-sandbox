const globalData = {
    x: 1
}

module.exports = { 
    doSomething(data, cb) {
        data.y = 999;        
        cb(globalData);
        return globalData.x;
    }
}