const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

// function startWorker(path, callback) {
//     let worker = new Worker(path, { workerData: null })
//     worker.on('message', (msg) => {
//         callback(null, msg)
//     })
//     worker.on('error', callback)
//     worker.on('exit', (code) => {
//         if (code != 0)
//             console.error(new Error(`Worker stopped with exit code ${code}`))
//     })
//     return worker
// }

// let myWorker = startWorker(__dirname + '/httpWorker.js', (err, result) => {
//     if (err) return console.error(err)
//     console.log('main get msg', result)
// })

// 接收到worker thread返回的数据后
const msgCallback = (data) => {
    console.log('main get msg', data)
}

const errCallback = (data) => {
    console.log('main get err', data)
}

const exitCallback = (data) => {
    console.log('main exit', data)
}

let myWorker = new Worker(__dirname + '/workerCode.js', { workerData: null })
myWorker.on('message', msgCallback)
myWorker.on('error', errCallback)
myWorker.on('exit', exitCallback)


function getProccessResFun(res) {
    return () => {
        console.log('proccessRes', res)
    }
}

function sendHttpByWorker(url, reqParams, proccessResFun) {
    console.log('sendHttpByWorker', url, reqParams, proccessResFun)
    const reqPromise = new Promise((resolve, reject) => {
        myWorker.postMessage({
            type: 'request',
            url,
            reqParams,
            // resolve
            // proccessFun: proccessResFun
        })
    })
}

// main thread通知worker thread发起请求
const proData = sendHttpByWorker(
    'http://www.baidu.com',
    { id: 1 },
    getProccessResFun()
)
// console.log('get proData', proData)
