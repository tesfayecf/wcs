'use client'
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login } from "@/app/(auth)/actions";
import { ILoginForm } from "@/app/(auth)/types";

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();
    const [form] = Form.useForm();

    return (
        <div id="login" className={"login"}>
            <Card id="content" className="content">
                <div id="header" className="header">
                    <div id="title" className="title">
                        <Typography.Title className="text" level={1}>Log in. Be the change!</Typography.Title>
                    </div>
                    <div id="subtitle" className="subtitle">
                        <Typography.Text className="text" >Don't have an account yet?</Typography.Text>
                        <Typography.Link className="text" href="/login">
                            <Link href="/signup">Sign up</Link>
                        </Typography.Link>
                    </div>
                </div>
                <div id="login-form" className="login-form">
                    <Form
                        name="login-form"
                        className="login-form-items"
                        layout="vertical"
                        form={form}
                        onFinish={(values: ILoginForm) => {
                            login({
                                email: values.email,
                                password: values.password,
                            })
                        }}
                    >
                        <div id="form-items" className="form-items">
                            <Form.Item
                                name="email"
                                className="form-item"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input placeholder="Email" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                name="password"
                                className="form-item"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password placeholder="Password" prefix={<LockOutlined />} />
                            </Form.Item>
                        </div>
                        <div id="options" className="options">
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                className="option-item"
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <Typography.Link>
                                <Link href="/recover" className="text">Forgot password?</Link>
                            </Typography.Link>
                        </div>
                        <div id="buttons" className="buttons">
                            <Button
                                type="primary"
                                className="button-item"
                                onClick={() => form.submit()}
                            >
                                Login
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card >
        </div >
    )
}

export default Login;