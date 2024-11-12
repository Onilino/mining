import {Button, Drawer, Empty, List, Popconfirm, Tooltip} from "antd";
import {closePanel, context, PANEL_PROPS} from "@/app/utils";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {remove} from "@/app/CrudService";

EntityShowComponent.propTypes = PANEL_PROPS

export default function EntityShowComponent(props) {
  const enableEditMode = (item) => {
    props.setEntity(item)
    props.setEditing(true)
  }

  const enableCreateMode = () => {
    if (props.type === 'document') {
      closePanel(props)
      props.enableCreateMode()
    } else {
      props.setEditing(true)
    }
  }

  return (
    (
      <Drawer
        title={`${context[props.type].title} list`}
        onClose={() => closePanel(props)}
        open={!props.editing}
        extra={
          <Tooltip title={`Create ${props.type}`} placement="left">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={enableCreateMode} />
          </Tooltip>
        }
      >
        {
          props.entities?.length
            ? (
              <List
                itemLayout="horizontal"
                dataSource={props.entities}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      (
                        <Tooltip key={item.id} title={`Edit ${props.type} ${item.name}`} placement="left">
                          <Button
                            shape="circle"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => enableEditMode(item)}
                          />
                        </Tooltip>
                      ), (
                        <Popconfirm
                          key={item.id}
                          title="Delete project"
                          description={`Confirm deletion of ${props.type} ${item.name} ?`}
                          okText="Yes"
                          placement="left"
                          onConfirm={() => remove(props, item)}
                          cancelText="No"
                        >
                          <Button
                            color="danger"
                            variant="solid"
                            size="small"
                            shape="circle"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={context[props.type].icon}
                      title={item.name}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description={`No ${props.type} found`} />
            )
        }
      </Drawer>
    )
  )
}
