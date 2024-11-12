import {FloatButton, Tooltip} from "antd";
import {CloseCircleOutlined, FileTextOutlined, GoldOutlined, PlusOutlined, ShopOutlined} from "@ant-design/icons";
import {ACTION_BUTTONS_PROPS, disableCreateMode} from "@/app/utils";

ActionButtonsComponent.propTypes = ACTION_BUTTONS_PROPS

export default function ActionButtonsComponent(props) {
  const openPanel = (props, type) => {
    props.setOpenPanel(true)
    props.setType(type)
  }

  return !props.isCreateMode
    ? (
      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <Tooltip title="Show companies" placement="left">
          <FloatButton
            icon={<ShopOutlined />}
            onClick={() => openPanel(props, 'company')}
          />
        </Tooltip>
        <Tooltip title="Show minerals" placement="left">
          <FloatButton
            icon={<GoldOutlined />}
            onClick={() => openPanel(props, 'mineral')}
          />
        </Tooltip>
        <Tooltip title="Show documents" placement="left">
          <FloatButton
            icon={<FileTextOutlined />}
            onClick={() => openPanel(props, 'document')}
          />
        </Tooltip>
        <Tooltip title="Create new project" placement="left">
          <FloatButton icon={<PlusOutlined />} type="primary" onClick={props.enableCreateMode} />
        </Tooltip>
      </FloatButton.Group>
    ) : (
      <Tooltip title="Abort">
        <FloatButton
          icon={<CloseCircleOutlined />}
          onClick={() => disableCreateMode(props)}
        />
      </Tooltip>
    )
}
