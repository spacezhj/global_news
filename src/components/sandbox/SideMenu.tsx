import React, {useEffect, useState} from 'react';
import {Menu, MenuProps} from "antd";
import {
    ContainerOutlined,
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import Sider from "antd/lib/layout/Sider";
import {generateMenu, rootSubmenuKeys} from "../../utils/menu";
import {useLocation} from "react-router";
import {getMenu} from "../../api/default";


//定义菜单

const data: Array<object> = [
    {
        key: "/home",
        title: "首页",
        icon: <PieChartOutlined/>,
    },
    {
        key: "/user-manage",
        title: "用户管理",
        icon: <DesktopOutlined/>,
        children: [
            {
                key: "/user-manage/list",
                title: "用户列表",
                icon: <DesktopOutlined/>,
            }
        ]
    },
    {
        key: "/right-manage",
        title: "权限管理",
        icon: <ContainerOutlined/>,
        children: [
            {
                key: "/right-manage/list",
                title: "权限列表",
                icon: <ContainerOutlined/>,
            },
            {
                key: "/right-manage/role/list",
                title: "角色列表",
                icon: <ContainerOutlined/>,
            }
        ]
    }
]
// @ts-ignore
console.log(generateMenu(data));

const SideMenu = (props: any) => {
    const [menuData, setMenuData] = useState<Array<any>>([]);
    let {pathname} = useLocation();
    //默认选中的菜单
    const [openKeys, setOpenKeys] = useState<string[]>(["/home"]);
    //获取一级路由
    const rootSubmenu = rootSubmenuKeys(data);
    //点击一级菜单，其它管理菜单收起
    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenu.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    // 挂载后获取菜单数据
    useEffect(() => {
        getMenu({"_embed":"children"}).then(res=>{
            setMenuData(generateMenu(res));
        })
    }, []);

    //属性变化时，重新设置默认选中的菜单
    useEffect(() => {
        setOpenKeys(() => [defaultOpenKeys()])

    }, [pathname])
    // 查找默认选中的菜单
    const defaultOpenKeys = (): string => {
        // eslint-disable-next-line array-callback-return
        return rootSubmenu.find((v: string) => {
            if (pathname.indexOf(v) !== -1) {
                return v
            }
        }) || "/home"

    }

    return (
        <div className="side_menu">
            <Sider trigger={null} collapsible collapsed={props.collapsed}>
                <div className="title">新闻发布中心</div>
                <Menu
                    defaultSelectedKeys={[pathname]}
                    defaultOpenKeys={openKeys}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={props.collapsed}
                    // items={generateMenu(data)}
                    items={menuData}
                />
            </Sider>
        </div>
    );
};

export default SideMenu;
