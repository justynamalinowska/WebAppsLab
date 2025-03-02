import { IProject } from "./Project.type";
import "./ProjectModal.style.css"

type ProjectModalProps = {
    project: IProject;
    onClose: () => void;
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <button onClick={onClose}>Close</button> 
            </div>
        </div>
    );
};

export default ProjectModal;