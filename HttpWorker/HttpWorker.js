const { Worker, isMainThread, parentPort, workerData, threadId } = require('worker_threads')

class HttpWorker {
    constructor(workerPath) {
        this.httpWorker = new Worker(workerPath, { workerData: null }) // worker thread 实例
    }

    // main thread 通知 worker thread 发起http请求，并设置数据返回的监听
    runWorker(reqUrl, reqParams, processResFun) {
        return new Promise((resolve, reject) => {
            this.httpWorker.postMessage({
                type: 'request',
                reqUrl,
                reqParams
            })
            const msgCallback = (res) => {
                console.log('from worker msgCallback', res)
                const resData = processResFun(res)
                this.cleanUp()
                resolve(resData)
            }
            const errorCallback = (err) => {
                console.log('from worker errorCallback', err)
                this.cleanUp()
                reject(err)
            }
            this.httpWorker.on('message', msgCallback)
            this.httpWorker.on('error', errorCallback)
        })
    }

    // 清除监听器，用于下次调用
    cleanUp() {
        this.httpWorker.removeAllListeners('message')
        this.httpWorker.removeAllListeners('error')
    }

    // 手动关闭 worker thread
    exitThread() {
        console.log('---exit thread', threadId)
        this.httpWorker.postMessage({
            type: 'exit'
        })
    }

}

module.exports = HttpWorker
