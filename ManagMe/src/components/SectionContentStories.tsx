import React from "react";
import { IProject } from "./Project.type";
import { IStory } from "./Story.type";

type Props = {
    project: IProject;
    userStories: IStory[];
};

const SectionContentStories = ({ project, userStories }: Props) => {
    return (
        <div className="section-content-stories">
            <h2>{project.name}</h2>
            <ul>
                {userStories.map((story) => (
                    <li key={story.id}>
                        <h3>{story.name}</h3>
                        <p>{story.description}</p>
                        <p>Priority: {story.priority}</p>
                        <p>Status: {story.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SectionContentStories;