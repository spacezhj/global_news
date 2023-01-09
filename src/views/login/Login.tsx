import React, {useEffect} from 'react';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Form, Input, message} from "antd";
//2.引入connect用于连接UI组件与redux
import {connect} from "react-redux";
import {setStore} from "../../store/action/login_action";
import {login} from "../../api/default";
import {useNavigate} from "react-router";


const MyComponent = (props: any) => {
    const navigate = useNavigate();
    useEffect(() => {
            console.log("最初的 ==>", props)
    }, []);


    const onFinish = (values: any) => {

        login({
            ...values,
            roleState: true,
            "_expand": "role"
        }).then((res: any) => {
            if (res.length <= 0) return message.error("用户名或密码错误");
            let t= Math.random().toString(36).slice(2)
            props.setStore({
                token:t,
                userInfo:res[0]})
            localStorage.setItem("userInfo", JSON.stringify(res[0]))
            localStorage.setItem("token",t)
            navigate("/home")
        })
    };
    return (
        <div className="login_box">
            <div className="form">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"

                        rules={[{required: true, message: '请输入用户名!'}]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入密码!'}]}
                    >
                        <Input

                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>

            </div>
        </div>
    );
};

export default connect(
    (store: any) => {
        console.log("login中的--->", store.login)
        return store.login
    }
    , {
        setStore: setStore
    })(MyComponent)
