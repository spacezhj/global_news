import instance from "../utils/request";

//http://localhost:8888/regions?_embed=children 获取侧边栏的数据
const getMenu = (params: object) => {
    return instance({
        url: "/rights",
        method: "get",
        params
    })
}
//http://localhost:8888/rights 获取用户列表的数据
const getRoles = (params: object) => {
    return instance({
        url: "/roles",
        method: "get",
        params
    })
}
//删除信息
const deleteRole=(url:string)=>{
    return instance({
        url:url,
        method:"delete"
    })
}

export {
    getMenu,
    getRoles,
    deleteRole
}