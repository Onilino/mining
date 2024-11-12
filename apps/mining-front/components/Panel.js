import ProjectEdit from "@/components/Project/ProjectEdit";
import EntityEdit from "@/components/Entity/EntityEdit";
import ProjectShow from "@/components/Project/ProjectShow";
import EntityShow from "@/components/Entity/EntityShow";
import {PANEL_PROPS} from "@/app/utils";

PanelComponent.propTypes = PANEL_PROPS

export default function PanelComponent(props) {
  if (!props.openPanel) return

  if (props.editing) {
    return props.type === 'project'
      ? <ProjectEdit {...props} />
      : <EntityEdit {...props} />
  }

  return props.type === 'project' && props.entity
    ? <ProjectShow {...props} />
    : <EntityShow {...props} />
}
