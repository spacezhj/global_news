import {MenuProps} from "antd";
import React from "react";
import {NavLink} from "react-router-dom";
import {ContainerOutlined, DesktopOutlined, PieChartOutlined} from "@ant-design/icons";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


//设置图标映射关系
const iconMap = {
    '/home': <PieChartOutlined/>,
    '/user-manage': <DesktopOutlined/>,
    '/user-manage/list': <DesktopOutlined/>,
    '/right-manage': <ContainerOutlined/>,
    '/right-manage/right/list': <ContainerOutlined/>,
    '/right-manage/role/list': <ContainerOutlined/>,

}


export const generateMenu = (list: any): MenuItem[] => {
    let {role: {rights}} = JSON.parse(localStorage.getItem("userInfo") || "{}");
    let arr: MenuItem[] = [];
    list.forEach((v: any) => {
        //    判断有符合的权限菜单和pagepermisson 满足条件都是要显示的
        if (rights.includes(v.key) && v.pagepermisson) {
            // 判断有没有孩子节点，有孩子节点就递归调用，不需要链接跳转
            if (v.hasOwnProperty("children") && v.children.length > 0) {
                // @ts-ignore
                arr.push(getItem(v.title, v.key, iconMap[v.key], generateMenu(v.children)))
            } else {
                // @ts-ignore
                arr.push(getItem(<NavLink to={v.key}>{v.title}</NavLink>, v.key, iconMap[v.key]))
            }
        }
    })
    return arr
}
export const rootSubmenuKeys = (data: Array<object>) => {
    let arr: string[] = []
    data.forEach(v => {
        // @ts-ignore
        arr.push(v.key)
    })
    return arr
}



