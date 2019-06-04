const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

class HttpWorker {
    constructor(workerPath) {
        this.httpWorker = new Worker(workerPath, { workerData: null }) // worker thread实例
        this.queue = [] // 请求队列
        this.isFree = true // 是否空闲，串行处理
    }

    // 将请求push入队列
    sendRequest(reqUrl, reqParams, processResFun, reponseHandle) {
        // console.log('main sendRequest', reqUrl, reqParams, processResFun, reponseHandle)
        this.pushQueue({ reqUrl, reqParams, processResFun, reponseHandle })
        this.runWorker()
    }

    // 若空闲，从队列取出一个请求，进行处理
    runWorker() {
        if (this.isFree) {
            const nextReq = this.popQueue()
            // console.log('pop item:', nextReq)
            this.isFree = false
            this.handleReqItem(nextReq)
        }
    }

    // 处理单个http请求，并设置返回结果的监听
    handleReqItem(reqItem) {
        if (reqItem) {
            console.log('handleReqItem', reqItem)
            const { reqUrl, reqParams, processResFun, reponseHandle } = reqItem
            this.httpWorker.postMessage({
                reqUrl,
                reqParams
            })
            const msgCallback = (res) => {
                // console.log('from worker msgCallback', res)
                const resData = processResFun(res)
                reponseHandle(resData)
                this.cleanUp()
            }
            const errorCallback = (err) => {
                console.log('from worker errorCallback', err)
                this.cleanUp()
            }
            this.httpWorker.on('message', msgCallback)
            this.httpWorker.on('error', errorCallback)
        }
    }

    // 清除监听器，设置空闲状态
    cleanUp() {
        console.log('worker cleanUp')
        this.httpWorker.removeAllListeners('message')
        this.httpWorker.removeAllListeners('error')

        this.isFree = true
        this.runWorker()
    }

    pushQueue(item) {
        this.queue.push(item)
        // console.log('push into queue:', item)
    }

    popQueue() {
        if (this.queue.length > 0) {
            return this.queue.shift()
        }
        return null
    }

}

module.exports = HttpWorker
