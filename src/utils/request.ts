import axios from "axios";
import Store from "../store/store";

const baseURL: string = 'http://localhost:8888'

const instance = axios.create({
    baseURL,
    timeout: 5000,
    // headers: {'content-type': 'application/json; charset=utf-8'}
});
let b = localStorage.getItem("token");

//设置白名单
const whiteList=['/login','/register']

// 请求拦截器
instance.interceptors.request.use((config: any) => {
    //判断是否存在token，如果存在的话，放行，如果不存在的话，跳转到登录页面

    if(config.url!=='/users'&&!localStorage.getItem('token')){
        console.log("没有token")
        window.location.href = '#/login'
    }


    return config
})


// 响应拦截器
instance.interceptors.response.use((res: any) => {
    if (res.status === 200) {
        return res.data
    } else {

        return Promise.reject(res)
    }
})
export default instance

