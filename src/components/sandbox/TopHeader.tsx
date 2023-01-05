import React, {useState} from 'react';
import {Layout, theme, MenuProps, Dropdown} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate} from "react-router";
import {DownOutlined} from '@ant-design/icons';

const {Header, Content} = Layout;

// const onClick: MenuProps['onClick'] = ({key}) => {
//     message.info(`Click on item ${key}`);
// };


const TopHeader = (props: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const {token: {colorBgContainer},} = theme.useToken();
    let navigate = useNavigate();
    //侧边栏切换
    const toggle = (): void => {
        setCollapsed(!collapsed)
        props.changeFlag(!collapsed)

    }
    //退出功能
    const exit = (e: any) => {
        console.log("退出了")
        navigate("/login")
    }

    const items: MenuProps['items'] = [
        {
            label: '管理员',
            key: '1',
        },
        {
            label: (<span onClick={exit}>退出</span>),
            key: '2',
        },

    ];


    return (
        <Layout className="site-layout">
            <Header className="header" style={{background: colorBgContainer}}>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: toggle,
                })}
                <div className="func">
                    <span style={{marginRight:"10px"}}>欢迎回来admin</span>
                    <Dropdown menu={{items}}>
                        <DownOutlined/>
                    </Dropdown>
                </div>

            </Header>
            <Content className="content"
                style={{
                    background: colorBgContainer,
                }}
            >
                <Outlet></Outlet>
            </Content>
        </Layout>
    );
};

export default TopHeader;
