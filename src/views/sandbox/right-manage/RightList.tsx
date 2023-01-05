import React, {useEffect, useState} from 'react';
import {Button, Table, Tag, Modal, message} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';

import {deleteRole, getMenu} from "../../../api/default";

const RightList = () => {
    const [dataSource, setDataSource] = useState<[]>([]);

    const columns = [
        {
            title: '姓名',
            dataIndex: 'id',
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key: string) => {
                return <Tag color="orange">{key}</Tag>;
            }
        },
        {
            title: '操作',
            render: (item: object) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={confirmMethod(item)}></Button>
                    <Button style={{marginLeft: "5px"}} type="primary" shape="circle" icon={<EditOutlined/>}></Button>
                </div>
            }
        }

    ];

    useEffect(() => {
        getMenu({"_embed": "children"}).then((res: any) => {
            console.log(res);
            let b = res.map((v: { children: string | any[] }) => {
                return v.children.length === 0 ? {...v, children: undefined} : v;
            })
            setDataSource(b);
        })
    }, []);
    //删除确认
    const confirmMethod = (item: any) => {
        return () => {
            Modal.confirm({
                title: '确定要删除？',
                icon: <ExclamationCircleFilled/>,
                content: `${item['title']}权限`,
                okText: '是',
                cancelText: '否',
                onOk() {
                    deleteItem(item)
                }
            });
        }
    }
    //删除的逻辑
    const deleteItem = (v: { id: string, grade: number }) => {
        let url: string = "";
        if (v.grade === 1) {
            url = `rights/${v.id}`;
        } else {
            url = `children/${v.id}`;
        }
        openMessage();
        let t = filterId(dataSource, v.id)
        setDataSource(t as []);
        deleteRole(url).then((res: any) => {
            console.log("res ==>", res)

            closeMessage();
        })
    }
    //过滤ID相同的元素
    const filterId = (arr: [], id: string) => {
        let res: never[] = [];
        arr.forEach(item => {
            if (item["id"] !== id) {
                // @ts-ignore
                if (item["children"]) {
                    // @ts-ignore
                    item["children"] = filterId(item["children"], id)
                }
                res.push(item)

            }
        })
        return res.length === 0 ? undefined : res;
    }

    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    //开启加载
    const openMessage = () => {
        messageApi.open({
            key,
            type: 'loading',
            content: '加载中...',
            duration: 0
        });
    }
    //关闭加载
    const closeMessage = () => {
        setTimeout(()=>{
            messageApi.open({
                key,
                type: 'success',
                content: '删除成功',
                duration: 2,
            });
        },1500)
    }


    return (
        <div className="right_list">
            {contextHolder}
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}/>
        </div>
    );
};

export default RightList;
