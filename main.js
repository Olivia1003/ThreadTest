const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const request = require("request");

function startWorker(path, cb) {
    let w = new Worker(path, { workerData: null });
    w.on('message', (msg) => {
        cb(null, msg)
    })
    w.on('error', cb);
    w.on('exit', (code) => {
        if (code != 0)
            console.error(new Error(`Worker stopped with exit code ${code}`))
    });
    return w;
}

console.log("this is the main thread")

let myWorker = startWorker(__dirname + '/workerCode.js', (err, result) => {
    if (err) return console.error(err);
    console.log("[[Heavy computation function finished]]")
    console.log("First value is: ", result.val);
    console.log("Took: ", (result.timeDiff / 1000), " seconds");
    console.log('msg took: ', (new Date() - result.msgStart) / 1000, 's')
})

const start = Date.now();
const requestStart = new Date()
request.get('https://zhuanlan.zhihu.com/p/38393122', (err, resp) => {
    if (err) {
        return console.error(err);
    }
    const requestEnd = new Date()
    console.log("main thread Total bytes received: ", resp.body.length);
    console.log("main thread request took: ", (requestEnd - requestStart) / 1000, 's');

    //myWorker.postMessage({finished: true, timeDiff: Date.now() - start}) //you could send messages to your workers like this
}) 
