import {
  Button,
  Card,
  Divider,
  Drawer,
  Empty,
  List,
  Popconfirm,
  Space,
  Statistic,
  Timeline,
  Tooltip,
  Typography
} from "antd";
import {DeleteOutlined, EditOutlined, FileTextOutlined, ShopOutlined} from "@ant-design/icons";
import {remove} from "@/app/CrudService";
import {closePanel, PANEL_PROPS} from "@/app/utils";
import Link from "antd/lib/typography/Link";

ProjectShowComponent.propTypes = PANEL_PROPS

export default function ProjectShowComponent(props) {
  return (
    <Drawer
      title={props.entity.name}
      onClose={() => closePanel(props)}
      open={!!props.entity && !props.editing}
      extra={
        <Space>
          <Tooltip title={`Edit project ${props.entity.name}`} placement="left">
            <Button shape="circle" icon={<EditOutlined />} onClick={() => props.setEditing(true)} />
          </Tooltip>
          <Popconfirm
            title="Delete entity"
            description={`Confirm deletion of entity ${props.entity.name} ?`}
            okText="Yes"
            onConfirm={() => remove(props)}
            cancelText="No"
          >
            <Button color="danger" variant="solid" shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      }
    >
      <em>{props.entity.description}</em>
      <Divider />
      <Statistic title="Project Budget" value={props.entity.budget} precision={2} />
      <Divider />
      <Typography.Title level={4}>Related companies</Typography.Title>
      {
        props.entity.companies.length
          ? (
            <List
              itemLayout="horizontal"
              dataSource={props.entity.companies}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ShopOutlined />}
                    title={item.name}
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No company are handling this entity" />
          )
      }
      <Divider />
      <Typography.Title level={4}>Related minerals</Typography.Title>
      {
        props.entity.minerals.length
          ? (
            <List
              grid={{gutter: 4, column: 2}}
              dataSource={props.entity.minerals}
              renderItem={(item) => (
                <List.Item>
                  <Card>{item.name}</Card>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No minerals are related to this entity" />
          )
      }
      <Divider/>
      <Typography.Title level={4}>Related documents</Typography.Title>
      {
        props.entity.documents.length
          ? (
            <Timeline
              style={{marginTop: '2em'}}
              items={props.entity.documents.map((d) => ({
                children: <Link onClick={() => props.setOpenedDocument(d)}>{d.name}</Link>,
                dot: <FileTextOutlined />,
                color: 'gray'
              }))}
            />
          ) : (
            <Empty description="No documents are related to this entity" />
          )
      }
    </Drawer>
  )
}
