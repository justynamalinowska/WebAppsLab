import { IProject, PageEnum } from "./Project.type";
import "./ProjectList.style.css";

type Props = {
    list: IProject[];
    setShownPage: (page: PageEnum) => void;
}

const ProjectList = ({ list, setShownPage }: Props) => {
    return (
        <div>
            <div className="projects-header">
            <h2>Projects List</h2>
            <input type="button" value="Add Project" onClick={() => setShownPage(PageEnum.add)}/>
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
                    <div>
                        <input type="button" value="View"/>
                        <input type="button" value="Edit"/>
                        <input type="button" value="Delete"/>
                    </div>
                </td>
            </tr>
            );
            })}
    </tbody>
</table>
        </div>
    )
}

export default ProjectList;