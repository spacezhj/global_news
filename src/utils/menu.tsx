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
const iconMap= {
    '/home': <PieChartOutlined/>,
    '/user-manage': <DesktopOutlined/>,
    '/right-manage': <ContainerOutlined/>,
    '/user-manage/list': <DesktopOutlined/>,
    '/right-manage/right/list': <ContainerOutlined/>,
    '/right-manage/role/list': <ContainerOutlined/>,

}



export const generateMenu = (list:any): MenuItem[] => {
    let arr: MenuItem[] = [];
    list.forEach((v: any) => {
        if (v.hasOwnProperty("children")&&v.children.length>0) {
            // @ts-ignore
            arr.push(getItem(v.title, v.key, iconMap[v.key], generateMenu(v.children)))

        } else if (v["pagepermisson"]) {
            // @ts-ignore
            arr.push(getItem(<NavLink to={v.key}>{v.title}</NavLink>, v.key, iconMap[v.key]))
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



