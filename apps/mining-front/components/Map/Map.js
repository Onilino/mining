"use client";

import 'leaflet/dist/leaflet.css'
import React, {useEffect, useRef, useState} from 'react'
import {MapContainer, Marker, Polygon, Polyline, TileLayer, Tooltip, useMapEvents} from 'react-leaflet'
import {
  disableCreateMode,
  docIcon,
  docProjectIcon,
  enableCreateMode,
  finishNewDocumentCreate,
  finishNewProjectCreate,
  getCompaniesLabel,
  getEntities,
  markerIcon,
  openProject
} from "@/app/utils"
import ActionButtons from "@/components/ActionButtons"
import {Button, Modal, notification} from "antd"
import Panel from "@/components/Panel"
import {list} from "@/app/CrudService"

export default function MapComponent() {
  const mapRef = useRef(null)
  const projectRefs = useRef({})
  const [api, contextHolder] = notification.useNotification()

  const [projects, setProjects] = useState([])
  const [companies, setCompanies] = useState([])
  const [minerals, setMinerals] = useState([])
  const [documents, setDocuments] = useState([])

  const [entity, setEntity] = useState(null)

  const [projectCenters, setProjectCenters] = useState({})
  const [newProjectCoords, setNewProjectCoords] = useState([])
  const [newDocumentCoords, setNewDocumentCoords] = useState([])
  const [isPolygonClosed, setIsPolygonClosed] = useState(true)
  const [isMarkerClosed, setIsMarkerClosed] = useState(true)
  const [editing, setEditing] = useState(false)
  const [openedDocument, setOpenedDocument] = useState(false)
  const [openPanel, setOpenPanel] = useState(false)
  const [center, setCenter] = useState([0, 0])
  const [type, setType] = useState(null)

  useEffect(() => {
    list('projects', setProjects, null, null, setCenter)
    list('companies', setCompanies)
    list('minerals', setMinerals)
    list('documents', setDocuments)
  }, [])

  useEffect(() => {
    const centers = {}

    Object.entries(projectRefs.current).forEach(([projectId, ref]) => {
      if (ref) {
        const center = ref.getCenter()

        centers[projectId] = [center.lat, center.lng]
      }
    })
    setProjectCenters(centers)
  }, [projects])

  useEffect(() => {
    const map = mapRef.current

    if (map) {
      map.flyTo(center)
    }
  }, [center])

  const ClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng

        if (!isPolygonClosed) {
          setNewProjectCoords([...newProjectCoords, [lat, lng]]);
        } else if (!isMarkerClosed) {
          setNewDocumentCoords([lat, lng])
          finishNewDocumentCreate(setEditing, setType, setOpenPanel, setIsMarkerClosed)
        }
      },
    });
  }

  const openNotification = (type, title, msg) => {
    api[type]({
      message: title,
      description: <span>{msg}</span>,
      placement: 'bottom',
    });
  }

  return (
    <React.StrictMode>
      <MapContainer ref={mapRef} center={center} zoom={12} style={{height: "100vh", width: "100%"}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
        {
          projects.map(project => (
            <Polygon
              key={`project-${project['id']}`}
              ref={(el) => projectRefs.current[project['id']] = el}
              positions={project.coords}
              eventHandlers={{click: () => openProject(project, isPolygonClosed, setEntity, setOpenPanel, setType)}}
            >
              <Tooltip>{project['name']} ({getCompaniesLabel(project['companies'])})</Tooltip>
            </Polygon>
          ))
        }
        {
          documents.map(document => (
            <React.Fragment key={`document-${document['id']}`}>
              <Marker
                position={document['coords']}
                eventHandlers={{click: () => setOpenedDocument(document)}}
                icon={document['projects'].length ? docProjectIcon : docIcon}
              >
                <Tooltip>{document['name']}</Tooltip>
              </Marker>
              {
                document['projects'].map(projectId => projectCenters[projectId]
                  ? (
                    <Polyline
                      key={`document-project-${document['id']}-${projectId}`}
                      positions={[document['coords'], projectCenters[projectId]]}
                      pathOptions={{color: 'orangered'}}
                    />
                  ) : null
                )
              }
            </React.Fragment>
          ))
        }
        {
          newProjectCoords.length
            ? (
              <>
                <Marker
                  position={newProjectCoords[0]}
                  eventHandlers={{click: () => finishNewProjectCreate(newProjectCoords, setEditing, setType, setOpenPanel, setIsPolygonClosed)}}
                  icon={markerIcon}
                >
                  <Tooltip>Click the marker to finish project area delimitation</Tooltip>
                </Marker>
                <Polygon positions={newProjectCoords} pathOptions={{color: 'green'}} />
              </>
            ) : null
        }
      </MapContainer>
      <Panel
        openPanel={openPanel}
        setOpenPanel={setOpenPanel}
        editing={editing}
        setEditing={setEditing}
        entities={getEntities(type, companies, minerals, documents)}
        companies={companies}
        minerals={minerals}
        documents={documents}
        entity={entity}
        setEntity={setEntity}
        setProjects={setProjects}
        setCompanies={setCompanies}
        setMinerals={setMinerals}
        setDocuments={setDocuments}
        setOpenedDocument={setOpenedDocument}
        coords={newProjectCoords}
        docCoords={newDocumentCoords}
        setNewProjectCoords={setNewProjectCoords}
        setIsPolygonClosed={setIsPolygonClosed}
        enableCreateMode={() => enableCreateMode(openNotification, setIsPolygonClosed, setIsMarkerClosed, 'document')}
        setNewDocumentCoords={setNewDocumentCoords}
        setIsMarkerClosed={setIsMarkerClosed}
        type={type}
        openNotification={openNotification}
      />
      <ActionButtons
        isCreateMode={!isPolygonClosed || !isMarkerClosed}
        enableCreateMode={() => enableCreateMode(openNotification, setIsPolygonClosed, setIsMarkerClosed, 'project')}
        disableCreateMode={() => disableCreateMode(setNewProjectCoords, setIsPolygonClosed, setNewDocumentCoords, setIsMarkerClosed)}
        setType={setType}
        setOpenPanel={setOpenPanel}
        setNewProjectCoords={setNewProjectCoords}
        setIsPolygonClosed={setIsPolygonClosed}
        setNewDocumentCoords={setNewDocumentCoords}
        setIsMarkerClosed={setIsMarkerClosed}
      />
      <Modal
        title={`Document "${openedDocument?.name}"`}
        centered
        width={1000}
        zIndex={1050}
        open={!!openedDocument}
        onCancel={() => setOpenedDocument(null)}
        footer={[
          <Button key="back" onClick={() => setOpenedDocument(null)}>Close</Button>,
        ]}
      >
        <span dangerouslySetInnerHTML={{__html: openedDocument?.content?.replaceAll('\n\n', '.<br/><br/>')}}></span>
      </Modal>
      {contextHolder}
    </React.StrictMode>
  )
}
