// 这个主要是路由表组件的写法
import React, {useState, Suspense, lazy, useEffect} from 'react'
import {useRoutes, RouteObject, NavLink} from 'react-router-dom'

import {getMenu} from "../api/default";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";
import UserList from "../views/sandbox/user-manage/UserList";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import Error from "../views/sandbox/nomermission/Error";
import Home from "../views/sandbox/home/Home";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import Published from "../views/sandbox/publish-manage/Published";
import Sunset from "../views/sandbox/publish-manage/Sunset";

interface route {
    path: string,
    element?: any,
    children?: route[]
}

//路由表映射对象
const routeMap: any = {
    "/home": <Home/>,
    "/user-manage/list": <UserList/>,
    "/right-manage/role/list": <RoleList/>,
    "/right-manage/right/list": <RightList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/category": <NewsCategory/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <Unpublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,
}


export const UseMenu = () => {
    const [menuData, setMenuData] = useState<Array<any>>([]);

    useEffect(() => {
        getMenu({"_embed": "children"}).then((res: any) => {
            setMenuData(t(res)as [])
        })
    }, []);


    const t = (list: Array<route>): route[] | undefined => {
        let {role: {rights}} = JSON.parse(localStorage.getItem("userInfo") || "{}");
        let arr: route[] = [];
        list?.forEach((v: any) => {
            //    判断有符合的权限菜单和pagepermisson 满足条件都是要显示的
            if (rights.includes(v.key) && v.pagepermisson) {
                // 判断有没有孩子节点，有孩子节点就递归调用，不需要链接跳转
                if (v.hasOwnProperty("children") && v.children.length > 0) {
                    arr.push({
                        path: v.key.slice(1),
                        children: t(v.children)
                    })
                } else {
                    let paths=v.key.split("/")
                    arr.push({
                        path:paths[paths.length-1],
                        element: routeMap[v.key],
                    })
                }
            }
        })
        return arr.length > 0 ? arr : undefined;

    }

    return [
        {
            path: "/",
            element: <NewsSandBox/>,
            children: menuData
        },
        {
            path: "/login",
            element: <Login/>,
        },
        {
            path: "*",
            element: <Error/>,
        },
    ]

}


// 声明类型
namespace SyncRoute {
    export type Routes = {
        path: string,
        component?: React.LazyExoticComponent<any>,
        children?: Routes[]
    }
}

const RouteTable: SyncRoute.Routes[] = [
    {
        path: '/',
        component: lazy(() => import('../views/sandbox/NewsSandBox')),
        children: [
            {
                path: 'home',
                component: lazy(() => import('../views/sandbox/home/Home')),
            },
            {
                path: 'user-manage',
                children: [
                    {
                        path: "list",
                        component: lazy(() => import('../views/sandbox/user-manage/UserList')),
                    }
                ]
            },
            {
                path: "right-manage",
                // element: <RightList/>,
                children: [
                    {
                        path: "right/list",
                        component: lazy(() => import('../views/sandbox/right-manage/RightList')),
                    },
                    {
                        path: "role/list",
                        component: lazy(() => import('../views/sandbox/right-manage/RoleList')),
                    }
                ]
            }
        ]
    }
]

const syncRouter = (table: SyncRoute.Routes[]): RouteObject[] => {
    let mRouteTable: RouteObject[] = []
    table.forEach((route: any) => {
        mRouteTable.push({
            path: route.path,
            element: <Home/>,
            children: route.children && syncRouter(route.children)
        })
    })
    console.log("mRouteTable ==>", mRouteTable)
    return mRouteTable
}

// 直接暴露成一个组件调用
export default () => useRoutes(syncRouter(RouteTable))

