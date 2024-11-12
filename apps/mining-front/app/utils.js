import L from "leaflet";
import {FileTextOutlined, GoldOutlined, ShopOutlined} from "@ant-design/icons";
import PropTypes from "prop-types";

export const markerIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

export const docIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/887/887997.png',
  iconSize: [25, 30],
  iconAnchor: [12, 20],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [45, 45],
  shadowAnchor: [12, 35],
});

export const docProjectIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3921/3921808.png',
  iconSize: [25, 30],
  iconAnchor: [12, 20],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [45, 45],
  shadowAnchor: [12, 35],
});

export const PANEL_PROPS = {
  openPanel: PropTypes.bool.isRequired,
  setOpenPanel: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
  entities: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
  minerals: PropTypes.array.isRequired,
  documents: PropTypes.array.isRequired,
  entity: PropTypes.bool.isRequired,
  setEntity: PropTypes.func.isRequired,
  setProjects: PropTypes.func.isRequired,
  setCompanies: PropTypes.func.isRequired,
  setMinerals: PropTypes.func.isRequired,
  setDocuments: PropTypes.func.isRequired,
  setOpenedDocument: PropTypes.func.isRequired,
  coords: PropTypes.array.isRequired,
  docCoords: PropTypes.array.isRequired,
  setNewProjectCoords: PropTypes.func.isRequired,
  setIsPolygonClosed: PropTypes.func.isRequired,
  enableCreateMode: PropTypes.func.isRequired,
  setNewDocumentCoords: PropTypes.func.isRequired,
  setIsMarkerClosed: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  openNotification: PropTypes.func.isRequired,
}

export const ACTION_BUTTONS_PROPS = {
  isCreateMode: PropTypes.bool.isRequired,
  enableCreateMode: PropTypes.func.isRequired,
  disableCreateMode: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  setOpenPanel: PropTypes.func.isRequired
}

export const context = {
  project: {
    title: 'Project',
    endpoint: 'projects',
    setter: 'setProjects'
  },
  company: {
    title: 'Company',
    endpoint: 'companies',
    setter: 'setCompanies',
    icon: <ShopOutlined />
  },
  mineral: {
    title: 'Mineral',
    endpoint: 'minerals',
    setter: 'setMinerals',
    icon: <GoldOutlined />
  },
  document: {
    title: 'Document',
    endpoint: 'documents',
    setter: 'setDocuments',
    icon: <FileTextOutlined />
  }
}

export function initializeForm(type, entity, coords) {
  switch (type) {
    case 'project':
      return {
        name: entity?.name ?? null,
        description: entity?.description ?? null,
        budget: entity?.budget ?? null,
        companies: entity?.companies.map(({id}) => id) ?? [],
        minerals: entity?.minerals.map(({id}) => id) ?? [],
        documents: entity?.documents.map(({id}) => id) ?? [],
        coords: entity?.coords ?? coords
      }
    case 'document':
      return {
        name: entity?.name ?? null,
        content: entity?.content ?? null,
        coords: entity?.coords ?? coords,
        projects: entity?.projects ?? []
      }
    default:
      return {
        name: entity?.name ?? null
      }
  }
}

export function submittable(entityForm) {
  return Object.entries(entityForm).every(([key, value]) => {
    if (key === 'coords') {
      return !!value.length
    }

    return !!value
  })
}

export function handleChange(e, key, entityForm, setEntityForm) {
  switch (key) {
    case 'name':
    case 'content':
    case 'description': {
      setEntityForm({
        ...entityForm,
        [key]: e.target.value,
      })
      return
    }
    default:
      setEntityForm({
        ...entityForm,
        [key]: e
      })
  }
}

export function getCompaniesLabel(companies) {
  return companies.map(c => c.name).join(', ')
}

export function openProject(project, isPolygonClosed, setEntity, setOpenPanel, setType) {
  if (isPolygonClosed) {
    setType('project')
    setOpenPanel(true)
    setEntity(project)
  }
}

export function getEntities(type, companies, minerals, documents) {
  switch (type) {
    case 'company':
      return companies
    case 'mineral':
      return minerals
    default:
      return documents
  }
}

export function cancelEdit(props, setEntityForm) {
  if (props.type !== 'project') {
    props.setEntity(null)
  }

  if (!props.entity) {
    closePanel(props)
  }

  props.setEditing(false)
  setEntityForm(initializeForm(props.type, props.entity, props.coords))
}

export function closePanel(props) {
  props.setOpenPanel(false)
  props.setEditing(false)
  props.setEntity(null)
  disableCreateMode(props)
}

export function finishNewProjectCreate(newProjectCoords, setEditing, setType, setOpenPanel, setIsPolygonClosed) {
  if (newProjectCoords.length < 3) {
    return
  }

  setEditing(true)
  setType('project')
  setOpenPanel(true)
  setIsPolygonClosed(true)
}

export function finishNewDocumentCreate(setEditing, setType, setOpenPanel, setIsMarkerClosed) {
  setEditing(true)
  setType('document')
  setOpenPanel(true)
  setIsMarkerClosed(true)
}

export function enableCreateMode(openNotification, setIsPolygonClosed, setIsMarkerClosed, type) {
  if (type === 'project') {
    setIsPolygonClosed(false)
    openNotification('info', 'Draw your project', (
      <p>Draw your project area (3 segments min.)<br/>Then, click on the Marker to edit project info</p>
    ))
  } else {
    setIsMarkerClosed(false)
    openNotification('info', 'Select document location', (<p>Select document location on the map</p>))
  }
}

export function disableCreateMode(props) {
  props.setNewProjectCoords([])
  props.setNewDocumentCoords([])
  props.setIsPolygonClosed(true)
  props.setIsMarkerClosed(true)
}
