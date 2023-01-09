//开启加载
const openMessage = (params: t) => {
    let {key="one", content='加载中...', fn, messageApi} = params
    messageApi.open({
        key,
        type: 'loading',
        content,
        duration: 0
    });
}
//关闭加载
const closeMessage = (params: t) => {
    let {key="one", content="删除成功", fn, messageApi,delayTime=1000} = params
    setTimeout(() => {
       messageApi.open({
            key,
            type: 'success',
            content,
            duration: 2,
        });
        fn && fn()

    }, delayTime)
}

interface t {
    key?: string,//key值
    messageApi: any,//messageApi
    content?: string,//提示内容
    fn?: Function,//回调函数
    delayTime?: number//延迟时间
}


export {
    openMessage,
    closeMessage

}