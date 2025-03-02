import "./Home.style.css";
import { useState } from "react";
import { IProject, defaultProjectList } from "./Project.type";

const Home = () => {

    const [projectsList, setProjectsList] = useState(defaultProjectList as IProject[]);
    return (
    <> 
        <article className="article-header">
            <header>
                <h1>ManageMe</h1>
            </header>
        </article>

        <section>
            <div className="ection-content"></div>
        </section>
    </>);
    }

export default Home;