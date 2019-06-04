const HttpWorker = require('./HttpWorker')

// 处理服务返回的数据
const proccessResFunUpper = (data) => {
    console.log('proccessResFun get', data)
    const originName = data && data.resData && data.resData.name || ''
    const resData = {
        name: originName.toUpperCase()
    }
    console.log('proccessResFun return', resData)
    return resData
}

const proccessResFunLower = (data) => {
    console.log('proccessResFun get', data)
    const originName = data && data.resData && data.resData.name || ''
    const resData = {
        name: originName.toLowerCase()
    }
    console.log('proccessResFun return', resData)
    return resData
}


// 调用 worker thread 发起请求
// 请求参数：请求url，请求参数，用于处理数据的函数
// 返回：Promise，处理后的数据
// 每次请求完成后需关闭 worker thread
const myWorker = new HttpWorker('./workerCode.js')
myWorker.runWorker(
    'http://www.baidu.com',
    { id: 0 },
    proccessResFunUpper
).then((res) => {
    console.log('main get worker res', res)
    myWorker.exitThread()
}).catch((err) => {
    console.log('main get worker err', err)
    myWorker.exitThread()
})

// 模拟另一次请求
setTimeout(() => {
    const anotherWorker = new HttpWorker('./workerCode.js')
    anotherWorker.runWorker(
        'http://www.baidu.com',
        { id: 1 },
        proccessResFunLower
    ).then((res) => {
        console.log('main get worker res', res)
        anotherWorker.exitThread()
    }).catch((err) => {
        console.log('main get worker err', err)
        anotherWorker.exitThread()
    })
}, 4);


console.log('other code')
