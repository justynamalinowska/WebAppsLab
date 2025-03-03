import "./Home.style.css";
import { useState } from "react";
import { IProject, PageEnum, defaultProjectList } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";
import EditProject from "./EditProject";

const Home = () => {

    const [projectList, setProjectsList] = useState(defaultProjectList as IProject[]);
    const [shownPage, setShownPage] = useState(PageEnum.list);
    const [dataToEdit, setDataToEdit] = useState({} as IProject);

    const showListPage = () => setShownPage(PageEnum.list);

    const addProjectHnd = (data: IProject) => {
        setProjectsList([...projectList, data]);
        showListPage();
    }

    const deleteProject = (data: IProject) => {
        const indexToDelete = projectList.indexOf(data);
        const tempList = [...projectList];

        tempList.splice(indexToDelete, 1);
        setProjectsList(tempList);
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
        setProjectsList(tempList);
        showListPage();
    };

    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
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