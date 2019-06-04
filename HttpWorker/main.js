const HttpWorker = require('./HttpWorker')

// main thread 的某些数据
let nameA = ''
let nameB = ''

// 处理服务返回的数据
const proccessResFunUpper = (data) => {
    console.log('proccessResFunUpper get', data)
    const originName = data && data.resData && data.resData.name || ''
    const resData = {
        name: originName.toUpperCase()
    }
    console.log('proccessResFunUpper return', resData)
    return resData
}

const proccessResFunLower = (data) => {
    console.log('proccessResFunLower get', data)
    const originName = data && data.resData && data.resData.name || ''
    const resData = {
        name: originName.toLowerCase()
    }
    console.log('proccessResFunLower return', resData)
    return resData
}

// worker thread 返回处理后的数据后，main thread 将数据保存下来
const responseHandleA = (data) => {
    nameA = data.name
    console.log('---set nameA', nameA)
}

const responseHandleB = (data) => {
    nameB = data.name
    console.log('---set nameB', nameB)
}

// 初始化worker thread（可以一直保留，用于发送http请求）
const myWorker = new HttpWorker('./workerCode.js')

// 调用 worker thread 发起请求
// 请求参数：请求url，请求参数，用于处理数据的函数，返回数据后的处理函数
// 返回：Promise，处理后的数据
myWorker.sendRequest(
    'http://www.baidu.com',
    { id: 0 },
    proccessResFunUpper,
    responseHandleA.bind(this)
)

// 模拟另一次请求
setTimeout(() => {
    myWorker.sendRequest(
        'http://www.baidu.com',
        { id: 1 },
        proccessResFunLower,
        responseHandleB.bind(this)
    )
}, 4);
