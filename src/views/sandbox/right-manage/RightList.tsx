import React, {useEffect, useState} from 'react';
import {Button, Table, Tag, Modal, message, Popover, Switch} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import {deleteRole, getMenu, updateRole} from "../../../api/default";
import {closeMessage, openMessage} from '../../../utils/message';


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
            render: (item: any) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={confirmMethod(item)}></Button>
                    <Popover style={{textAlign: "center"}}
                             content={
                                 <Switch checked={item.pagepermisson === 1}
                                         loading={updateFlag}
                                         onChange={permissionChange(item)}></Switch>
                             }
                             title="更新路由配置"

                             trigger={item.pagepermisson !== undefined ? "click" : ""}
                    >
                        <Button style={{marginLeft: "5px"}}
                                type="primary"
                                shape="circle"
                                disabled={item.pagepermisson === undefined}
                                icon={<EditOutlined/>}>

                        </Button>
                    </Popover>
                </div>
            }
        }

    ];

    useEffect(() => {
        getMenu({"_embed": "children"}).then((res: any) => {
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
        openMessage({messageApi});
        let t = filterId(dataSource, v.id)
        deleteRole(url).then( ()=> {
            closeMessage({
                messageApi, fn: () => {
                    setDataSource(t as []);
                }
            });
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

    //更新加载的标识
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    //更新权限配置
    const permissionChange = (item: any) => {
        return () => {
            setUpdateFlag(true)
            //由于引用类型可以直接改
            item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
            setDataSource([...dataSource])
            //更新数据库
            let url: string = "";
            if (item.grade === 1) {
                url = `rights/${item.id}`;
            } else {
                url = `children/${item.id}`;
            }
            updateRole(url, {pagepermisson: item.pagepermisson}).then((res: any) => {
                setTimeout(() => {
                    setUpdateFlag(false)
                }, 1500)
            })
        }
    }


    const [messageApi, contextHolder] = message.useMessage();

    return (
        <div className="right_list">
            {contextHolder}
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}/>
        </div>
    );
};

export default RightList;
