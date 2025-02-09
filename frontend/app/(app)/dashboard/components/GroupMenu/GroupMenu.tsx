"use client"
import React from "react";
import { Button, Form, Input, Modal, Typography } from "antd";

import { createGroup, editGroup, deleteGroup } from "@/app/(app)/dashboard/actions";
import { useDashboardStore } from "@/app/(app)/dashboard/store";
import { Group } from "@/app/(app)/group/[groupId]/types";

interface IGroupMenu { }

const GroupMenu: React.FunctionComponent<IGroupMenu> = (props: IGroupMenu) => {
    const [form] = Form.useForm<Group.IGroupForm>();
    const [isLoading, setIsLoading] = React.useState(false);
    const groups = useDashboardStore((state) => state.groups);
    const groupMenu = useDashboardStore((state) => state.groupMenu);
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu);

    const onFinish = (values: Group.IGroupForm) => {
        setIsLoading(true);
        // Timeout
        // setTimeout(() => { }, 2000);
        if (groupMenu.mode == "create") createGroup(values);
        else if (groupMenu.mode == "edit") editGroup(groupMenu.id, values);
        else if (groupMenu.mode == "delete") deleteGroup(groupMenu.id);

        setIsLoading(false);
        setGroupMenu({ id: -1, mode: "", show: false });
        form.resetFields();
        // TODO: show notification
    }

    const onAbort = () => {
        form.resetFields();

        setGroupMenu({ id: -1, mode: "", show: false });
        // TODO: show alert
    }

    return (
        <Modal
            open={groupMenu.show}
            onCancel={onAbort}
            footer={null}
        >
            <div id="group-menu-header" className="group-menu-header">
                <div id="title" className="title">
                    <Typography.Title level={3}>
                        {groupMenu.mode == "create" ? "Create Group" : groupMenu.mode == "edit" ? "Edit Group" : "Delete Group"}
                    </Typography.Title>
                </div>
            </div>
            <div id="group-menu-form" className="group-menu-form">
                <Form
                    name="group-menu-form"
                    className="group-menu-form-items"
                    form={form}
                    initialValues={groupMenu.id == -1 ? undefined : groups.find(g => g.id == groupMenu.id)}
                    onFinish={onFinish}
                    onAbort={onAbort}
                    disabled={isLoading}
                >
                    <div id="form-items" className="form-items">
                        <Form.Item
                            name="name"
                            className="form-item"
                            rules={[{ required: true, message: 'Please input group name!' }]}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>

                        <Form.Item
                            name="location"
                            className="form-item"
                            rules={[{ required: true, message: 'Please input location!' }]}
                        >
                            <Input placeholder="Location" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            className="form-item"
                            rules={[{ required: true, message: 'Please input description!' }]}
                        >
                            <Input.TextArea placeholder="Description" />
                        </Form.Item>
                    </div>
                    <div id="buttons" className="buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <Button
                            onClick={onAbort}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            loading={isLoading}
                        >
                            {
                                isLoading ?
                                    "Loading..." :
                                    groupMenu.mode == "create" ? "Create" : groupMenu.mode == "edit" ? "Edit" : "Delete"
                            }
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal >
    )
} 

export default GroupMenu;