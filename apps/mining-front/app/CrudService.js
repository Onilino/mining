import {cancelEdit, closePanel, context, submittable} from "@/app/utils";

export function list(endpoint, setter, setEntity, entity, setCenter) {
  fetch(`http://localhost:8000/${endpoint}?format=json`)
    .then(response => response.json())
    .then(data => {
      setter(data)

      if (entity) {
        setEntity(data.find(({id}) => id === entity.id))
      }

      if (data.length && setCenter) {
        setCenter([data[0].coords[0][0], data[0].coords[0][1]])
      }
    })
    .catch(err => console.error('Request error:', err))
}

export function createOrUpdate(props, entityForm, setEntityForm) {
  if (!submittable(entityForm)) return

  fetch(`http://localhost:8000/${context[props.type].endpoint}/` + (props.entity ? `${props.entity.id}/` : ''), {
    body: JSON.stringify(entityForm),
    method: props.entity ? 'PUT' : 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(() => {
      const type = props.entity ? 'info' : 'success'

      props.openNotification(type, `${context[props.type].title} ${props.entity?.name ?? entityForm.name}`, (
        <p>{context[props.type].title} {props.entity?.name ?? entityForm.name} successfully {props.entity ? 'edited' : 'created'} !</p>
      ))

      list(context[props.type].endpoint, props[context[props.type].setter], props.setEntity, props.entity)

      if (props.type !== 'project') {
        list('projects', props.setProjects)
      } else {
        list('documents', props.setDocuments)
      }

      cancelEdit(props, setEntityForm)
    })
    .catch(err => {
      console.error('Request error:', err)
      props.openNotification('error', `${context[props.type].title} ${props.entity?.name ?? entityForm.name}`, (
        <p>Unable to {props.entity ? 'edit' : 'create'} entity {context[props.type].title}</p>
      ))
    })
}

export function remove(props, entity) {
  if (!props.entity && !entity) return

  fetch(`http://localhost:8000/${context[props.type].endpoint}/${props.entity?.id ?? entity.id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(res => res)
    .then(() => {
      props.openNotification('info', (
        <p>{context[props.type].title} {props.entity?.name ?? entity.name} successfully deleted !</p>
      ))
      list(context[props.type].endpoint, props[context[props.type].setter])

      if (props.type === 'project') {
        list('documents', props.setDocuments)
        closePanel(props)
      } else {
        props.setEntity(null)
      }
    })
    .catch(err => {
      console.error('Request error:', err)
      props.openNotification('error', `${context[props.type].title} ${props.entity?.name ?? entity.name}`, (
        <p>Unable to remove {context[props.type].title} {props.entity?.name ?? entity.name}</p>
      ))
    })
}
