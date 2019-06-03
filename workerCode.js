const { parentPort } = require('worker_threads');
const request = require("request");

function random(min, max) {
    return Math.random() * (max - min) + min
}

const sorter = require("./test2-worker");

const start = Date.now()
let bigList = Array(1000000).fill().map((_) => random(1, 10000))

/**
// 你可以用这个方法从主线程接收消息
parentPort.on('message', (msg) => {
	console.log("Main thread finished on: ", (msg.timeDiff / 1000), " seconds...");
})
*/


sorter.sort(bigList);
const msgStart = new Date()
parentPort.postMessage({ val: sorter.firstValue, timeDiff: Date.now() - start, msgStart });

const requestStart = new Date()
request.get('http://www.baidu.com', (err, resp) => {
    if (err) {
        return console.error(err);
    }
    const requestEnd = new Date()
    console.log("worker thread Total bytes received: ", resp.body.length);
    console.log("worker thread request took: ", (requestEnd - requestStart) / 1000, 's');
    //myWorker.postMessage({finished: true, timeDiff: Date.now() - start}) //you could send messages to your workers like this
}) 
