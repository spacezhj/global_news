import instance from "../utils/request";

//http://localhost:8888/regions?_embed=children 获取侧边栏的数据
const getMenu = (params: object) => {
    return instance({
        url: "/rights",
        method: "get",
        params
    })
}


//权限管理的接口
//删除信息 rights/:id /children/:id
const deleteRole = (url: string) => {
    return instance({
        url: url,
        method: "delete"
    })
}
//更新权限 rights/:id /children/:id
const updateRole = (url: string, params: object) => {
    return instance({
        url,
        method: "patch",
        data: params
    })
}

//角色列表的接口 roles/:id
const getRolesList = () => {
    return instance({
        url: "/roles",
        method: "get",
    })
}
//删除角色列表的接口 roles/:id
const deleteRolesList = (id: string) => {
    return instance({
        url: `/roles/${id}`,
        method: "delete",
    })
}


//用户列表的接口
//获取用户列表的接口
const getUserList = (params: any) => {
    return instance({
        url: "/users",
        method: "get",
        params
    })
}
//获取区域列表的接口
const getAreaList = () => {
    return instance({
        url: "/regions",
        method: "get",
    })
}
//添加用户角色的接口
const addUserRole = (params: any) => {

    return instance({
        url: "/users",
        method: "post",
        data: params
    })
}
//删除用户角色的接口
const deleteUserRole = (id: number) => {
    return instance({
         url: `/users/${id}`,
        method: "delete",
    })
}
//编辑用户角色的接口
const editUserRole = (id: number, data: any) => {
    return instance({
        url: `/users/${id}`,
        method:"patch",
        data
    })
}

//更新用户状态的接口
const updateUserState = (id: number, data: any) => {
    return instance({
        url: `/users/${id}`,
        method: "patch",
        data
    })
}

//登录的接口
const login = (params: any) => {
    return instance({
        url: "/users",
        method: "get",
        params
    })
}



export {
    getMenu,
    deleteRole,
    updateRole,
    getRolesList,
    deleteRolesList,
    getUserList,
    getAreaList,
    addUserRole,
    editUserRole,
    updateUserState,
    deleteUserRole,
    login
}