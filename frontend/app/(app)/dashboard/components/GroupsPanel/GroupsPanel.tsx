"use client"
import React from "react";
import Link from "next/link";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { ColumnsType } from "antd/es/table";
import { Button, Col, Divider, Row, Segmented, Table } from "antd";
import { AppstoreOutlined, BarsOutlined, DeleteOutlined, EditOutlined, InfoOutlined, PlusOutlined } from "@ant-design/icons";

import { Api } from "@/app/lib/api/types";
import { useDashboardStore } from "@/app/(app)/dashboard/store";

interface IGroupsPanelProps { };

const GroupsPanel: React.FunctionComponent<IGroupsPanelProps> = (props: IGroupsPanelProps) => {
    const [mode, setMode] = React.useState<"grid" | "table">("grid");
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
    const { groups, setGroupMenu } = useDashboardStore();
    const store = useDashboardStore();
    console.log(store);

    const renderGridView = React.useCallback(() => {

        const actions: React.ReactNode[] = [
            (
                <div onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // setGroupMenu({ show: true, id: group.id, mode: "info" });
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
                    // setGroupMenu({ show: true, id: , mode: "delete" });
                }}>
                    <DeleteOutlined key="delete" />
                </div>
            )
        ];

        // Maybe create component
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
    }, [groups])

    const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: Api.Resources.Group[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const renderTableView = React.useCallback(() => {
        // Add row
        // Custom empty status 
        return (
            <Table<Api.Resources.Group>
                className="panel-table"
                dataSource={groups}
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
    }, [groups, selectedRowKeys, setSelectedRowKeys])

    return (
        <div className="groups-panel">
            <div className="mode-selector">
                <Button 
                    icon={<PlusOutlined />} 
                    type="primary" 
                    onClick={() => setGroupMenu({ show: true, id: -1, mode: "create" })}
                    children="Create Group"
                />
                <Segmented
                    vertical={false}
                    options={[
                        { value: "grid", icon: <AppstoreOutlined /> },
                        { value: "table", icon: <BarsOutlined /> },
                    ]}
                    value={mode}
                    onChange={(value) => setMode(value as "grid" | "table")}
                />
            </div>
            {mode === "grid" ? renderGridView() : renderTableView()}
        </div>
    )
}

export default GroupsPanel;

const columns: ColumnsType<Api.Resources.Group> = [
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
            <div style={{ width: "100%", display: "flex", justifyContent: "space-around", textDecoration: "none" }}>
                <a style={{ textDecoration: "none" }} onClick={() => console.log(`edit ${record.name}`)} ><InfoOutlined key="info" /></a>
                <Divider type="vertical" />
                <a style={{ marginLeft: 8, textDecoration: "none" }} onClick={() => console.log(`edit ${record.name}`)}><EditOutlined key="edit" color="black" /></a>
                <Divider type="vertical" />
                <a style={{ marginLeft: 8, textDecoration: "none" }} onClick={() => console.log(`delete ${record.name}`)}><DeleteOutlined key="delete" color="black" /></a>
            </div>
        ),
    },
]