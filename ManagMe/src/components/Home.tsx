import "./Home.style.css";
import { useState } from "react";
import { IProject, PageEnum, defaultProjectList } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";

const Home = () => {

    const [projectList, setProjectsList] = useState(defaultProjectList as IProject[]);
    const [shownPage, setShownPage] = useState(PageEnum.list);
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

    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
            </header>
        </article>

        <section className="section-content">
            {shownPage === PageEnum.list && <ProjectList list={projectList} setShownPage={setShownPage} onDeleteClickHnd={deleteProject}/>}
            {shownPage === PageEnum.add && <AddProject onBackBtnClickHnd={showListPage} onSubmitClickHnd={addProjectHnd}/>}
        </section>
    </>);
    };

export default Home;