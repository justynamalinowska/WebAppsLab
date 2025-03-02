import "./Home.style.css";
import { useState } from "react";
import { IProject, defaultProjectList } from "./Project.type";
import ProjectList from "./ProjectList";

const Home = () => {

    const [projectList, setProjectsList] = useState(defaultProjectList as IProject[]);
    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
            </header>
        </article>

        <section className="section-content">
        <ProjectList list={projectList}/>
        </section>
    </>);
    }

export default Home;