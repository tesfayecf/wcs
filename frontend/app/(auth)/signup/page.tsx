'use client'
import React from "react";
import Link from "next/link";
import { Button, Card, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

interface ISignupProps { }

const Signup: React.FunctionComponent<ISignupProps> = (props: ISignupProps) => {
    const [form] = Form.useForm();

    return (
        <div id="signup" className="signup">
            <Card id="content" className="content">
                <div id="header" className="header">
                    <div id="title" className="title">
                        <Typography.Title className="text" level={1}>Welcome to SMATER+</Typography.Title>
                    </div>
                    <div id="subtitle" className="subtitle">
                        <Typography.Text className="text" >Already have an account?</Typography.Text>
                        <Typography.Link className="text" href="/login">
                            <Link href="/login">Log in</Link>
                        </Typography.Link>
                    </div>
                </div>
                <div id="signup-form" className="signup-form">
                    <Form
                        name="signup-form"
                        className="signup-form-items"
                        layout="vertical"
                        form={form}
                        onFinish={(values) => {
                            console.log("values", values);
                        }}
                    >
                        <div id="form-items" className="form-items">
                            <Form.Item
                                name="username"
                                className="form-item"
                                required={true}
                                hasFeedback
                                rules={[{ required: true, message: 'Username is required' }]}
                            >
                                <Input placeholder="Username" size="middle" width="100%" prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                className="form-item"
                                required={true}
                                hasFeedback
                                rules={[{ required: true, message: 'Email is required' }]}
                            >
                                <Input placeholder="Email" size="middle" width="100%" prefix={<MailOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                className="form-item"
                                hasFeedback
                                required={true}
                                rules={[{ required: true, message: 'Password is required' }]}
                            >
                                <Input.Password placeholder="Password" size="middle" prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                className="form-item"
                                hasFeedback
                                required={true}
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Cofnirm password is required' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The new password that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm Password" size="middle" prefix={<LockOutlined />} />
                            </Form.Item>
                        </div>
                        <div id="options" className="options">
                            <Form.Item
                                name="promotion"
                                className="option"
                                valuePropName="checked"
                            >
                                <Checkbox defaultChecked>
                                    I want to receive emails about the product, feature updates and promotions.
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="agreement"
                                className="option"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                                    },
                                ]}
                            >
                                <Checkbox>
                                    I agree to the <Typography.Link>Terms of use</Typography.Link> and <Typography.Link>Privacy Policy</Typography.Link>
                                </Checkbox>
                            </Form.Item>
                        </div>
                        <div id="buttons" className="buttons">
                            <Button
                                type="primary"
                                size="large"
                                className="button-item"
                                htmlType="submit"
                                onClick={() => form.submit()}
                            >
                                Sign up
                            </Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div >
    )
}

export default Signup;

