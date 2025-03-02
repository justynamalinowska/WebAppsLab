import "./Home.style.css";
import { useState } from "react";
import { IProject, PageEnum, defaultProjectList } from "./Project.type";
import ProjectList from "./ProjectList";
import AddProject from "./AddProject";

const Home = () => {

    const [projectList, setProjectsList] = useState(defaultProjectList as IProject[]);
    const [shownPage, setShownPage] = useState(PageEnum.list);
    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
            </header>
        </article>

        <section className="section-content">
            {shownPage === PageEnum.list && <ProjectList list={projectList}/>}
            {shownPage === PageEnum.add && <AddProject/>}
        </section>
    </>);
    };

export default Home;