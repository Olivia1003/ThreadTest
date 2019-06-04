const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const axios = require('axios')

const NAME_LIST = ['Jack', 'Mary', 'Zoe']

// worker thread 接收主线程通知
parentPort.on('message', (data) => {
    console.log('worker get msg', data)
    if (data.type == 'request') {
        handleRequest(data.reqUrl, data.reqParams)
            .then((resData) => {
                console.log('worker get resData', resData)
                parentPort.postMessage({
                    resData
                });
            })
            .catch((err) => {
                console.log('worker get resData err', err)
            })
    } else if (data.type == 'exit') {
        process.exit()
    }

})

// worker thread 发起http请求，并返回原始数据
async function handleRequest(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(function (response) {
                console.log('axios res', response.status)
                // resolve(response)
                // 模拟 http 请求
                const id = params.id
                const name = NAME_LIST[id]
                resolve({ name })
            })
            .catch(function (error) {
                console.log('axios err', error)
                reject(error)
            });
    })
}
