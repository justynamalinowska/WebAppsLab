import { IProject } from "./Project.type";
import "./ProjectList.style.css";

type Props = {
    list: IProject[];
}

const projectList = (Props: Props) => {

    const{list} = Props;
    return (
        <div>
            <h2>Projects List</h2>
            <table className="styled-table">
    <thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        {list.map((project) => {
            return (
            <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
            </tr>
            );
            })}
    </tbody>
</table>
        </div>
    )
}

export default projectList;