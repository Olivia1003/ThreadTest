const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

class HttpWorker {

    constructor(workerPath) {
        this.httpWorker = new Worker(workerPath, { workerData: null }) // worker thread实例
        this.queue = [] // 请求队列
        this.isFree = true
    }

    runWorker() {
        if (this.isFree) {
            const nextReq = this.popQueue()
            this.handleReqItem(nextReq)
        }
    }

    // main thread 通知 worker thread 发起http请求
    sendRequest(reqUrl, reqParams, processResFun) {
        // if (this.isFree) { // worker thread 空闲
        //     this.handleReqItem({ reqUrl, reqParams, processResFun })
        //         .then((res) => {

        //         })
        //         .catch((err) => {

        //         })
        // } else {
        //     this.pushQueue({ reqUrl, reqParams, processResFun })
        // }
        this.pushQueue({ reqUrl, reqParams, processResFun })
        this.runWorker()
    }

    // 处理单个http请求，并设置返回结果的监听
    handleReqItem(reqItem) {
        const { reqUrl, reqParams, processResFun } = reqItem
        return new Promise((resolve, reject) => {
            this.httpWorker.postMessage({
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
        console.log('worker cleanUp')
        this.httpWorker.removeAllListeners('message')
        this.httpWorker.removeAllListeners('error')
    }

    pushQueue(item) {
        this.queue.concat(item)
    }

    popQueue() {
        if (this.queue.length > 0) {
            return this.queue.shift()
        }
        return null
    }


    // public run(getData: () => T) {
    //     return new Promise((resolve, reject) => {

    //         const callback = (error, result) => {
    //             if (error) {
    //                 return reject(error);
    //             }
    //             return resolve(result);
    //         }

    //         this.runWorker(getData, callback);
    //     });
    // }

    // private async runWorker(getData, callback) {
    //     const worker = this.httpWorker

    //     const messageCallback = (result: N) => {
    //         callback(null, result)
    //         cleanUp();
    //     };

    //     const errorCallback = (error: any) => {
    //         callback(error)
    //         cleanUp();
    //     };

    //     const cleanUp = () => {
    //         worker.removeAllListeners('message');
    //         worker.removeAllListeners('error');

    //         this.runWorker(workerId, this.queue.shift());
    //     };

    //     worker.once('message', messageCallback);
    //     worker.once('error', errorCallback);

    //     worker.postMessage(await queueItem.getData());
    // }

}

module.exports = HttpWorker
