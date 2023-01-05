import axios from "axios";
const baseURL: string = 'http://localhost:8888'

const instance = axios.create({
    baseURL,
    timeout: 5000,

});

// 请求拦截器
instance.interceptors.request.use((config: any)=>{

    return config
})


// 响应拦截器
instance.interceptors.response.use((res: any)=>{
    return res.data
})
export default instance

