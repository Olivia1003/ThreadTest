const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

function startWorker(path, callback) {
    let worker = new Worker(path, { workerData: null })
    worker.on('message', (msg) => {
        callback(null, msg)
    })
    worker.on('error', callback)
    worker.on('exit', (code) => {
        if (code != 0)
            console.error(new Error(`Worker stopped with exit code ${code}`))
    })
    return worker
}

let myWorker = startWorker(__dirname + '/httpWorker.js', (err, result) => {
    if (err) return console.error(err)
    console.log('main get msg', result)
})


function getProccessResFun(res) {
    return () => {
        console.log('proccessRes', res)
    }
}

function sendHttpByWorker(url, reqParams, proccessResFun) {
    console.log('sendHttpByWorker', url, reqParams, proccessResFun)
    myWorker.postMessage({
        type: 'request',
        url,
        reqParams,
        // proccessFun: proccessResFun
    })
}

// 主线程通知worker线程发起请求
const proData = sendHttpByWorker(
    'http://www.baidu.com',
    { id: 1 },
    getProccessResFun()
)
console.log('get proData', proData)
