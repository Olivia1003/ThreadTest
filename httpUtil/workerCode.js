const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const axios = require('axios')

// export function sendRequest(url) {
//     console.log('worker sendRequest', url)
// }


// worker线程接收主线程通知
parentPort.on('message', (data) => {
    console.log('worker get msg', data)
    if (data.type === 'request') {
        handleRequest(data.url, data.reqParams)
            .then((resData) => {
                console.log('worker get resData', resData)
                parentPort.postMessage({
                    resData
                });
            })
            .catch((err) => {
                console.log('worker get resData err', err)
            })
    }
})

// worker线程发起http请求，并处理返回数据
async function handleRequest(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(function (response) {
                console.log('axios res', response.status)
                // resolve(response)
                resolve({ name: 'jerry' })
            })
            .catch(function (error) {
                console.log('axios err', error)
                reject(error)
            });
    })
}
