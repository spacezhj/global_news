import React, {useEffect, useState,} from 'react';
//2.引入connect用于连接UI组件与redux
import {connect} from "react-redux";
import {Button, Form, Input, message, Modal, Select, Switch, Table} from "antd";
import {DeleteOutlined, ExclamationCircleFilled, UnorderedListOutlined} from "@ant-design/icons";
import {
    deleteUserRole, editUserRole,
    getAreaList,
    getRolesList,
    getUserList,
    updateUserState
} from "../../../api/default";
import {closeMessage, openMessage} from "../../../utils/message";
import axios from "axios";


const UserList = (props: any) => {
    const [dataSource, setDataSource] = useState<Array<any>>([]);
    const [regions, setRegions] = useState([]);//区域的数据列表
    //是添加还是编辑
    const [isAdd, setIsAdd] = useState<boolean>(true);
    //用于保存当前编辑的用户信息
    const [currentUser, setCurrentUser] = useState<any>({});
    const [roleNameS, setRoleNameS] = useState<[]>([]);//角色的数据列表

    const columns = [
        {
            title: '区域',
            filters: [
                ...regions.map((item: any) => {
                    return {
                        text: item.title,
                        value: item.value
                    }
                }),
                {
                    text: "全球",
                    value: "全球"
                }

            ],
            onFilter: (value: any, item: any) => {
                if (value === "全球") {
                    return item.region === ""
                }
                return item.region === value
            },
            render: (item: any) => {
                return <b>
                    {!item.region && item.roleId === 1 ? "全球" : item.region}
                </b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleId',
            render: (key: any, item: any) => {
                return item?.role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            render: (item: any) => {
                return <Switch checked={item.roleState}
                               disabled={item.default}
                               onChange={roleChange(item)}></Switch>
            }
        },
        {
            title: '状态',
            render: (item: any) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined/>} disabled={item.default}
                            onClick={confirmMethod(item)}></Button>
                    <Button disabled={item.default} style={{marginLeft: "5px"}} type="primary"
                            icon={<UnorderedListOutlined/>} onClick={() => {
                        setIsAdd(false);
                        setOpen(true);
                        setCurrentUser({...item});
                    }}></Button>
                </div>
            }
        },


    ];
    useEffect(() => {
        let {region, roleId} = props.userInfo;

        getUserList({_expand: "role"}).then((res: any) => {
            let {roleId} = props.userInfo;
            //过滤比当前权限小的用户的
            let list = res.filter((v: any) => {
                return v.roleId >= roleId
            })
            setDataSource(list);
        })
        getAreaList().then((res: any) => {
            let t = res.map((v: any) => {
                return region !== v.value ? {...v, disabled: true} : v
            })

            setRegions(t as any)
        })
        getRolesList().then((res: any) => {
            let t2 = res.map((v: any) => {
                let m = {
                    label: v.roleName,
                    value: v.id,
                    id: v.id
                }
                return roleId !== v.id ? {...m, disabled: true} : m
            })
            setRoleNameS(t2 as any)
        })

    }, []);

    const confirmMethod = (item: any) => {
        return () => {
            Modal.confirm({
                title: '确定要删除',
                icon: <ExclamationCircleFilled/>,
                content: `${item.username}角色?`,
                okText: '是',
                cancelText: '否',
                onOk() {
                    deleteItem(item)
                }
            });
        }
    }
    const deleteItem = (item: any) => {
        openMessage({messageApi})
        let t = dataSource.filter(v => {
            return v.id !== item.id
        })
        deleteUserRole(item.id).then(res => {
            closeMessage({
                messageApi, fn: () => {
                    setDataSource(t)
                }
            })
        })
    }
    const [messageApi, contextHolder] = message.useMessage();

    const roleChange = (v: any) => {
        return (checked: boolean) => {
            openMessage({messageApi})
            let t = dataSource.map(item => {
                return item.id === v.id ? {...item, roleState: checked} : item
            })

            updateUserState(v.id, {roleState: checked}).then(res => {
                closeMessage({
                    delayTime: 500, messageApi, content: "修改成功", fn: () => {
                        setDataSource(t)
                    }
                })
            })
        }
    }
    const [open, setOpen] = useState(false);

    const onCreate = (values: any) => {
        openMessage({messageApi})
        setOpen(false);
        //报错不知道原因
        // addUserRole({...values,"roleState":true,"default":false}).then(res=>{
        //     console.log("res==>",res)
        //     setDataSource([...dataSource,res])
        // })
        if (isAdd) {
            axios.post("http://localhost:8888/users", {
                ...values,
                "roleState": true,
                "default": false
            }).then(res => {
                setDataSource([...dataSource, {
                    ...res.data,
                    role: dataSource.find(item => item.id === res.data.roleId).role
                }])
                closeMessage({messageApi, content: "添加成功"})
            })
        } else {
            editUserRole(currentUser.id, values).then((r: any) => {
                setDataSource(() => {
                    return dataSource.map(v => {
                        if (v.id === r.id) {
                            return {...v, ...r}
                        }
                        return v
                        // return v.id === r.id ? {...v, ...values} : v
                    })
                })
                closeMessage({messageApi, content: "修改成功"})
            })
        }
    }

    // @ts-ignore
    // const regionChang = ({region, roleId}) => {
    //
    // }

    return (
        <div>
            {contextHolder}
            <Button
                type="primary"
                onClick={() => {
                    setOpen(true);
                    setIsAdd(true);
                    // regionChang()
                }}
                style={{marginBottom: "10px"}}
            >
                添加角色
            </Button>
            <CollectionCreateForm
                open={open}
                onCreate={onCreate}
                isAdd={isAdd}
                regions={regions}
                roleName={roleNameS}
                currentUser={isAdd ? undefined : currentUser}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <Table rowKey="id" dataSource={dataSource} columns={columns} pagination={{pageSize: 5}}/>
        </div>
    );
};

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
    isAdd: boolean;
    currentUser: any;
    regions: any;
    roleName: any;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
                                                                       open,
                                                                       onCreate,
                                                                       onCancel,
                                                                       isAdd,
                                                                       currentUser,
                                                                       regions,
                                                                       roleName
                                                                   }) => {
    const [form] = Form.useForm();
    //密码显示隐藏
    const [passwordVisible, setPasswordVisible] = React.useState(false);


    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {


    }, []);
    useEffect(() => {
        //判断是否为空对象
        if (currentUser) {
            // form.resetFields();
            form.setFieldsValue(currentUser);
            setIsDisabled(currentUser.roleId === 1)
        }
        return () => {
            form.resetFields();
        }
    }, [isAdd, currentUser]);


    //提交表单且数据验证成功后回调事件
    const onSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                form.resetFields();//重置表单
                onCreate(values);
            })
            .catch((info) => {
                console.log('请填写:', info);
            });
    }

    return (
        <Modal
            open={open}
            title={isAdd ? "添加角色" : "修改角色"}
            okText={isAdd ? "添加" : "修改"}
            cancelText="取消"
            onCancel={onCancel}
            onOk={onSubmit}
            getContainer={false}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{modifier: 'public'}}
            >
                <Form.Item
                    name="username"
                    label="用户名"

                    rules={[{required: true, message: '用户名必填'}]}
                >
                    <Input placeholder="请输入用户名"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{required: true, min: 4, max: 8, message: '密码必填'}]}
                >
                    <Input.Password placeholder="请输入4~8位密码"
                                    visibilityToggle={{visible: passwordVisible, onVisibleChange: setPasswordVisible}}/>
                </Form.Item>
                <Form.Item name="region" label="区域" rules={isDisabled ? [] : [{required: true, message: '必要的'}]}>
                    <Select
                        disabled={isDisabled}
                        options={regions}
                        fieldNames={{label: "value"}}
                    />
                </Form.Item>
                <Form.Item name="roleId" label="角色" rules={[{required: true, message: '角色必填'}]}>
                    <Select
                        options={
                            roleName
                        }
                        fieldNames={{label: "label"}}
                        onChange={(v) => {
                            if (v === 1) {
                                setIsDisabled(true)
                                form.setFieldsValue({region: ""})
                            } else {
                                setIsDisabled(false)
                            }
                        }}
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
};


export default connect(
    (state: any) => {
        return state.login
    }, {})
(UserList);
