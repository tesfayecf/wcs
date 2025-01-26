'use client'
import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React from "react";

interface IResetProps { }

const Reset: React.FunctionComponent<IResetProps> = (props: IResetProps) => {
    const [form] = Form.useForm();

    return (
        <div id="reset" className="reset">
            <div id="content" className="content">
                <div id="header" className="header">
                    <div id="title" className="title">
                        <Typography.Title level={2} className="text">Reset Your Password</Typography.Title>
                    </div>
                    <div id="subtitle" className="subtitle">
                        <Typography.Text className="text">
                            Please enter your new password below.
                        </Typography.Text>

                    </div>
                </div>
                <div id="reset-form" className="reset-form">
                    <Form
                        form={form}
                        name="reset-form"
                        className="reset-form-items"
                        layout="vertical"
                        autoComplete="off"
                    >
                        <div id="form-items" className="form-items">
                            <Form.Item
                                name="password"
                                className="form-item"
                                rules={[{ required: true, message: 'Please input your new password!' }]}
                            >
                                <Input.Password placeholder="New Password" prefix={<LockOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="confirm"
                                className="form-item"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Please confirm your new password!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Passwords do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm New Password" prefix={<LockOutlined />} />
                            </Form.Item>
                        </div>
                        <div id="buttons" className="buttons">

                            <Form.Item>
                                <Button
                                    type="primary"
                                    className="button-item"
                                    htmlType="submit"
                                    block
                                    onClick={() => form.submit()}
                                >
                                    Reset Password
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Reset;
