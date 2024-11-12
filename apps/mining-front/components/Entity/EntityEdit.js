import {Button, Divider, Drawer, Input, Space} from "antd";
import {createOrUpdate} from "@/app/CrudService";
import {cancelEdit, handleChange, initializeForm, PANEL_PROPS, submittable} from "@/app/utils";
import {useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";

EntityEditComponent.propTypes = PANEL_PROPS

export default function EntityEditComponent(props) {
  const [entityForm, setEntityForm] = useState(initializeForm(props.type, props.entity, props.docCoords))

  useEffect(() => {
    setEntityForm(initializeForm(props.type, props.entity, props.docCoords))
  }, [props.entity])

  return (
    <form>
      <Drawer
        title={props.entity ? `Edit ${props.type} ${props.entity.name}` : `Create new ${props.type}`}
        onClose={() => cancelEdit(props, setEntityForm)}
        open={props.editing}
      >
        <Space direction="vertical" style={{width: '100%'}}>
          <Input
            status={!entityForm.name ? 'error' : ''}
            placeholder="Name"
            onChange={(e) => handleChange(e, 'name', entityForm, setEntityForm)}
            name="name"
            defaultValue={entityForm.name}
          />
          {
            props.type === 'document'
              ? (
                <TextArea
                  status={!entityForm.content ? 'error' : ''}
                  rows={30}
                  placeholder="Document content"
                  name="content"
                  defaultValue={entityForm.content}
                  onChange={(e) => handleChange(e, 'content', entityForm, setEntityForm)}
                />
              ) : null
          }
        </Space>
        <Divider/>
        <Button
          type="primary"
          onClick={() => createOrUpdate(props, entityForm, setEntityForm)}
          disabled={!submittable(entityForm)}
        >Validate</Button>
        <Button type="button" onClick={() => cancelEdit(props, setEntityForm)}>Cancel</Button>
      </Drawer>
    </form>
  )
}
