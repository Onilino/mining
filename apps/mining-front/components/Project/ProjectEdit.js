import {Button, Divider, Drawer, Input, InputNumber, Select, Space, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useEffect, useState} from "react";
import {cancelEdit, handleChange, initializeForm, PANEL_PROPS, submittable} from "@/app/utils";
import {createOrUpdate} from "@/app/CrudService";

ProjectEditComponent.propTypes = PANEL_PROPS

export default function ProjectEditComponent(props) {
  const [projectForm, setProjectForm] = useState(initializeForm(props.type, props.entity, props.coords))

  useEffect(() => {
    setProjectForm(initializeForm(props.type, props.entity, props.coords))
  }, [props.entity, props.coords])

  return (
    <form>
      <Drawer
        title={props.entity ? `Edit project ${props.entity.name}` : 'Create new project'}
        onClose={() => cancelEdit(props, setProjectForm)}
        open={props.editing}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            status={!projectForm.name ? 'error' : ''}
            placeholder="Project name"
            onChange={(e) => handleChange(e, 'name', projectForm, setProjectForm)}
            name="name"
            defaultValue={projectForm.name}
          />
          <TextArea
            status={!projectForm.description ? 'error' : ''}
            rows={4}
            placeholder="Project description"
            name="description"
            defaultValue={projectForm.description}
            onChange={(e) => handleChange(e, 'description', projectForm, setProjectForm)}
          />
        </Space>
        <Divider/>
        <Typography.Title level={4}>Project Budget</Typography.Title>
        <InputNumber
          status={!projectForm.budget ? 'error' : ''}
          min={1000}
          placeholder="> 999"
          name="budget"
          style={{ width: '100%' }}
          defaultValue={projectForm.budget}
          onChange={(e) => handleChange(e, 'budget', projectForm, setProjectForm)}
        />
        <Divider/>
        <Typography.Title level={4}>Related companies</Typography.Title>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          name="companies"
          placeholder="Select companies"
          options={props.companies.map((company) => ({value: company.id, label: company.name}))}
          onChange={(e) => handleChange(e, 'companies', projectForm, setProjectForm)}
          defaultValue={projectForm.companies}
        />
        <Divider/>
        <Typography.Title level={4}>Related minerals</Typography.Title>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          name="minerals"
          placeholder="Select minerals"
          options={props.minerals.map((mineral) => ({value: mineral.id, label: mineral.name}))}
          onChange={(e) => handleChange(e, 'minerals', projectForm, setProjectForm)}
          defaultValue={projectForm.minerals}
        />
        <Divider/>
        <Typography.Title level={4}>Related documents</Typography.Title>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          name="documents"
          placeholder="Select documents"
          options={props.documents.map((document) => ({value: document.id, label: document.name}))}
          onChange={(e) => handleChange(e, 'documents', projectForm, setProjectForm)}
          defaultValue={projectForm.documents}
        />
        <Divider/>
        <Button
          type="primary"
          onClick={() => createOrUpdate(props, projectForm, setProjectForm)}
          disabled={!submittable(projectForm)}
        >Validate</Button>
        <Button type="button" onClick={() => cancelEdit(props, setProjectForm)}>Cancel</Button>
      </Drawer>
    </form>
  )
}
