import { IProject, PageEnum } from "./Project.type";
import { IStory } from "./Story.type";
import "./StoryList.style.css";
import { useState } from "react";

type Props = {
    project: IProject;
    onDeleteClickHnd: (data: IStory) => void;
    onEdit: (data: IStory) => void;
    onPageChange: (page: PageEnum) => void;
};

const StoryList = (props: Props) => {
    const { project, onDeleteClickHnd, onEdit, onPageChange } = props;
    const [showModal, setShowModal] = useState(false);

    const viewStory = (story: IStory) => {
        setShowModal(true);
        onPageChange(PageEnum.viewStory);
    };

    return (
        <div>
            <div className="stories-header">
                <h2>{project.name}</h2>
                <input type="button" value="Add Story" onClick={() => onPageChange(PageEnum.addStory)} />
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {project.stories && project.stories.map((story) => {
                        return (
                            <tr key={story.id}>
                                <td>{story.id}</td>
                                <td>{story.title}</td>
                                <td>{story.description}</td>
                                <td>{story.priority}</td>
                                <td>{story.status}</td>
                                <td>
                                    <div className="action-buttons">
                                        <input type="button" value="View" onClick={() => viewStory(story)} />
                                        <input type="button" value="Edit" onClick={() => { onEdit(story); onPageChange(PageEnum.editStory); }} />
                                        <input type="button" value="Delete" onClick={() => { onDeleteClickHnd(story); onPageChange(PageEnum.deleteStory); }} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default StoryList;