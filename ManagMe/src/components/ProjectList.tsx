import { IProject, PageEnum } from "./Project.type";
import "./ProjectList.style.css";
import ProjectModal from "./ProjectModal";
import { useState } from "react";

type Props = {
    list: IProject[];
    setShownPage: (page: PageEnum) => void;
    onDeleteClickHnd: (data: IProject) => void;
    onEdit: (data: IProject) => void;
    onSelect: (data: IProject) => void;
};

const ProjectList = (props: Props) => {
    const { list, setShownPage, onDeleteClickHnd, onEdit, onSelect } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

    const viewProject = (project: IProject) => {
        setSelectedProject(project);
        setShowModal(true); 
    };

    return (
        <div>
            <div className="projects-header">
                <h2>Projects List</h2>
                <input type="button" value="Add Project" onClick={() => setShownPage(PageEnum.add)} />
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((project) => {
                        return (
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>
                                    <div className="action-buttons">
                                        <input type="button" value="View" onClick={() => viewProject(project)} /> {/* Przekazujemy projekt do viewProject */}
                                        <input type="button" value="Edit" onClick={() => onEdit(project)}/>
                                        <input type="button" value="Delete" onClick={() => onDeleteClickHnd(project)} />
                                        <input type="button" value="Select" onClick={() => onSelect(project)} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal && selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
};

export default ProjectList;