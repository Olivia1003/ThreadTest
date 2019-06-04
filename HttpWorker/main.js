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
        name: originName.toUpperCase()
    }
    console.log('proccessResFun return', resData)
    return resData
}

// 初始化worker thread
const myWorker = new HttpWorker('./workerCode.js')

// 调用worker thread发起请求
// 请求参数：请求url，请求参数，用于处理数据的函数
// 返回：Promise，处理后的数据
myWorker.runWorker(
    'http://www.baidu.com',
    { id: 0 },
    proccessResFunUpper
).then((res) => {
    console.log('main get worker res', res)
})

// 模拟另一次请求
setTimeout(() => {
    myWorker.runWorker(
        'http://www.baidu.com',
        { id: 1 },
        proccessResFunLower
    ).then((res) => {
        console.log('main get worker res', res)
    })
}, 4);
