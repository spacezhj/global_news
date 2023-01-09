import React, {useEffect, useState} from 'react';
import {Button, message, Modal, Table, Tag, Tree} from 'antd';
import {deleteRolesList, getMenu, getRolesList, updateRole} from '../../../api/default';

import {
    DeleteOutlined,
    ExclamationCircleFilled,
    UnorderedListOutlined
} from '@ant-design/icons';
import {closeMessage, openMessage} from '../../../utils/message';


const RoleList = () => {
    const [dataSource, setDataSource] = useState<[]>([]);//角色列表
    const [rightData, setRightData] = useState<any>([]);//权限数据
    const [rightKeys, setRightKeys] = useState<any>([]);//当前用户权限keys
    const [rightId, setRightId] = useState<number>(0);//当前用户id
    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item: ListItem) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} onClick={confirmMethod(item)}></Button>
                    <Button style={{marginLeft: "5px"}} type="primary" icon={<UnorderedListOutlined/>} onClick={() => {
                        setRightKeys(item.rights)
                        setRightId(item.id)
                        setOpen(true)
                    }}></Button>
                </div>
            }
        }

    ];

    useEffect(() => {
        getRolesList().then((res: any) => {
            setDataSource(res);
        })
        //    获取权限的列表，复用接口
        getMenu({"_embed": "children"}).then(res => {
            setRightData(res)
        })
    }, []);
    const confirmMethod = (item: ListItem) => {
        return () => {
            Modal.confirm({
                title: '确定要删除',
                icon: <ExclamationCircleFilled/>,
                content: `${item.roleName}角色?`,
                okText: '是',
                cancelText: '否',
                onOk() {
                    deleteItem(item)
                }
            });
        }
    }
    const [messageApi, contextHolder] = message.useMessage();

    // 删除选项
    const deleteItem = (item: ListItem) => {
        openMessage({messageApi});

        deleteRolesList(String(item.id)).then((res: any) => {
            closeMessage({messageApi,fn:()=>{
                    setDataSource((): [] => {
                        return dataSource.filter((data: any) => data.id !== item.id) as []
                    });
                }});
        })

    }

    // 更新权限
    const [open, setOpen] = useState<boolean>(false);

    const handleOk = () => {
        openMessage({messageApi});
        setOpen(false)
        //    同步信息,由于引用关系，赋值会受到影响，所有直接改就可以
        let t = dataSource.map((item: ListItem) => {
            if (item.id === rightId) {
                return {
                    ...item,
                    rights: rightKeys
                }
            }
            return item
        })
        setDataSource(t as [])
        //    patch
        updateRole(`roles/${rightId}`, {rights: rightKeys}).then(r => {
            closeMessage({messageApi,content: '更新成功'});
        })
    }


    //列表权限回调
    const onCheck = (keys: any) => {
        setRightKeys(keys.checked)
    }

    return (
        <div>
            {contextHolder}
            <Table dataSource={dataSource}
                   columns={columns}
                   rowKey={(item: any) => item.id}
                   pagination={{pageSize: 5}}/>
            <Modal
                title="编辑"
                centered
                open={open}
                onOk={handleOk}
                onCancel={() => setOpen(false)}
                width={1000}>
                <Tree
                    checkable

                    onCheck={onCheck}
                    checkedKeys={rightKeys}
                    checkStrictly={true}
                    treeData={rightData}
                />
            </Modal>
        </div>
    );
};

export default RoleList;

interface ListItem {
    id: number,
    roleName: string
    rights: Array<string>,

}

