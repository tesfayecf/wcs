'use client'
import React from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

interface ILoginProps { }

const Login: React.FunctionComponent<ILoginProps> = (props: ILoginProps) => {
    const router = useRouter();
    const [form] = Form.useForm();

    return (
        <div id="login" className={"login"}>
            <Card id="content" className="content">
                <div id="header" className="header">
                    <div id="title" className="title">
                        <Typography.Title className="text" level={1}>Log in to SMATER+</Typography.Title>
                    </div>
                    <div id="subtitle" className="subtitle">
                        <Typography.Text className="text" >Don't have an account yet?</Typography.Text>
                        <Typography.Link className="text" href="/login">
                            <Link href="/signup">Sign up</Link>
                        </Typography.Link>
                    </div>
                </div>
                <div id="form" className="form">
                    <Form
                        name="login-form"
                        className="login-form"
                        layout="vertical"
                        form={form}
                    >
                        <div id="form-items" className="form-items">
                            <Form.Item
                                label="Email"
                                name="email"
                                className="form-item"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input placeholder="Email" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                label="Password"
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

const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    marginBottom: "10px",
}

const acceptButtonStyle: React.CSSProperties = {
    width: "100%",
    height: "35px"
}

const additionalButtonsContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "30px",
    margin: "5px 5px",
    padding: "0px 45px"
}

const additionalButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "inherit"
}

additionalButtonStyle[':hover'] = {
    backgroundColor: "#55dc9e",
};
