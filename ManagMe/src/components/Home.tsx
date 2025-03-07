import "./Home.style.css";
import { useEffect, useState } from "react";
import { IProject, PageEnum } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import User from "./User";

const Home = () => {

    const [projectList, setProjectsList] = useState([] as IProject[]);
    const [shownPage, setShownPage] = useState(PageEnum.list);
    const [dataToEdit, setDataToEdit] = useState({} as IProject);
    const [user, setUser] = useState(new User("Justyna", "Malinowska"));

    const showListPage = () => setShownPage(PageEnum.list);

    useEffect(() => {
        const projectsListInString = window.localStorage.getItem("projects");
        if (projectsListInString) {
            setProjectsList(JSON.parse(projectsListInString));
        }
    }
    , []);

    const _setProjectsList = (data: IProject[]) => {
        setProjectsList(data);
        window.localStorage.setItem("projects", JSON.stringify(data));
    };

    const addProjectHnd = (data: IProject) => {
        _setProjectsList([...projectList, data]);
        showListPage();
    }

    const deleteProject = (data: IProject) => {
        const indexToDelete = projectList.indexOf(data);
        const tempList = [...projectList];

        tempList.splice(indexToDelete, 1);
        _setProjectsList(tempList);
    };

    const editProject = (data: IProject) => {
        setShownPage(PageEnum.edit);
        setDataToEdit(data);
    };

    const updateData = (data: IProject) => {
        const filterData = projectList.filter((project) => project.id === data.id)[0];
        const indexOfRecord = projectList.indexOf(filterData);
        const tempList = [...projectList];
        tempList[indexOfRecord] = data;
        _setProjectsList(tempList);
        showListPage();
    };

    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
                <p>Welcome, {user.name} {user.surname}</p>
            </header>
        </article>

        <section className="section-content">
            {shownPage === PageEnum.list && <ProjectList list={projectList} setShownPage={setShownPage} onDeleteClickHnd={deleteProject} onEdit={editProject}/>}
            {shownPage === PageEnum.add && <AddProject onBackBtnClickHnd={showListPage} onSubmitClickHnd={addProjectHnd}/>}

            {shownPage == PageEnum.edit && <EditProject data={dataToEdit} onBackBtnClickHnd={showListPage} onUpdateClickHnd={updateData}/>}
        </section>
    </>);
    };

export default Home;