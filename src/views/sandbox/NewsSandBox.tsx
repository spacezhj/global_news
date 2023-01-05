import React, {useState} from 'react';
import "./newsSandbox.css";
import {Layout} from "antd";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
const NewsSandbox = () => {
    const [flag, setFlag] = useState(false);

    const changeFlag=(v:boolean)=>{
        setFlag(v)
    }
    return (
        <Layout className="news_box">
            <SideMenu className="side_menu" collapsed={flag}></SideMenu>
            <TopHeader changeFlag={changeFlag} ></TopHeader>
        </Layout>
    );
};

export default NewsSandbox;
