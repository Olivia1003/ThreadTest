### HttpWorker
作用：使用worker thread来执行http请求。每次执行请求任务，需生成一个HttpWorker，用于发送请求并处理服务返回的数据，将处理后的数据发送给主线程，完成后销毁HttpWorker。

待优化：可以考虑用queue缓存请求来优化，或者用线程池。

### 分支
normal：每次执行请求任务，都需新建一个HttpWorker，完成后销毁
queue：用队列来缓存请求，只需初始新建一个HttpWorker，多次使用

### 运行
1. `npm i`
2. `node --experimental-worker main.js`

### 参考
https://zhuanlan.zhihu.com/p/38393122
https://juejin.im/post/5c9b537de51d456c423a8728
