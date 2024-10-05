"use client"
import React from "react";
import { IGroup, IGroupCreationForm } from "../../types";
import { Button, Col, Form, Input, Modal, Row, Segmented, Switch, Table, Typography } from "antd";
import { ColumnsType, TableProps } from "antd/es/table";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { AppstoreOutlined, DeleteOutlined, EditOutlined, InfoOutlined, LoadingOutlined, PlusOutlined, TableOutlined } from "@ant-design/icons";
import Link from "next/link";
import { createGroup, editGroup, deleteGroup } from "../../actions";
import useDashboardStore from "@/app/(app)/dashboard/store";

interface IGroupsPanelProps {
    groups?: IGroup[];
}

const GroupsPanel: React.FunctionComponent<IGroupsPanelProps> = (props: IGroupsPanelProps) => {
    const [mode, setMode] = React.useState<"grid" | "table">("grid");
    const [groups, setGroups] = React.useState<IGroup[]>(props.groups || []);
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu);

    React.useEffect(() => {
        setGroups(props.groups || []);
    }, [props.groups]);

    const renderGridView = React.useCallback(() => {

        const actions: React.ReactNode[] = [
            (
                <div onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(e)
                }}>
                    <InfoOutlined key="info" />
                </div>
            ),
            (
                <div onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // setGroupMenu({ show: true, id: , mode: "edit" });
                }}>
                    <EditOutlined key="edit" />
                </div>
            ),
            (
                <div onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("delete")
                }}>
                    <DeleteOutlined key="delete" />
                </div>
            )
        ];

        return (
            <div id="panel-grid" className="panel-grid">
                <Row gutter={[24, 24]}>
                    {groups.map((group, index) => (
                        <Col key={group.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                            <Link href={`/group/${group.id}`}>
                                <Card
                                    hoverable
                                    style={{ width: '100%', height: '100%' }}
                                    actions={actions}
                                >
                                    <Meta title={group.name} description={group.location} />
                                    {/* Add additional content here if needed (stats, status) */}
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </div>

        );
    }, [props.groups])



    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: IGroup[]) => {
        console.log("selectedRowKeys changed: ", selectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const renderTableView = React.useCallback(() => {

        // Add row
        // Custom empty status 


        return (
            <Table<IGroup>
                className="panel-table"
                dataSource={props.groups}
                columns={columns}
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange,
                }}
                bordered={true}
                scroll={{ x: true }}
                pagination={{ position: ["bottomRight"] }}
            />
        )
    }, [props.groups, selectedRowKeys, setSelectedRowKeys])

    return (
        <div className="groups-panel">
            <div className="mode-selector">
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setGroupMenu({ show: true, id: -1, mode: "create" })}>
                    Create Group
                </Button>
                <Segmented
                    vertical={false}
                    options={[
                        { value: "grid", icon: <AppstoreOutlined /> },
                        { value: "table", icon: <TableOutlined /> },
                    ]}
                    value={mode}
                    onChange={(value) => setMode(value as "grid" | "table")}
                />
            </div>
            {mode === "grid" ? renderGridView() : renderTableView()}
            <GroupMenu /> {/*  TODO: move to dashboard */}
        </div>
    )
}

export default GroupsPanel;

const columns: ColumnsType<IGroup> = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
    },
    {
        title: "Location",
        dataIndex: "location",
        key: "location",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "25%",
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <>
                <a onClick={() => console.log(`edit ${record.name}`)}>Edit</a>
                <a style={{ marginLeft: 8 }} onClick={() => console.log(`delete ${record.name}`)}>Delete</a>
            </>
        ),
    },
]

interface IGroupForm { }

const GroupMenu: React.FunctionComponent<IGroupForm> = (props: IGroupForm) => {
    const [form] = Form.useForm<IGroupCreationForm>();
    const [isLoading, setIsLoading] = React.useState(false);
    const groups = useDashboardStore((state) => state.groups);
    const groupMenu = useDashboardStore((state) => state.groupMenu);
    const setGroupMenu = useDashboardStore((state) => state.setGroupMenu);

    const onFinish = (values: IGroupCreationForm) => {
        setIsLoading(true);
        // Timeout
        // setTimeout(() => {
        //     setIsLoading(false);
        //     setGroupMenu({ id: -1, mode: "", show: false });
        //     form.resetFields();
        //     // TODO: show alert
        // }, 2000);
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