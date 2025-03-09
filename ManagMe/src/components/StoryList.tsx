import { IProject, PageEnum } from "./Project.type";
import { IStory } from "./Story.type";
import "./StoryList.style.css";
import { useState } from "react";
import StoryModal from "./StoryModal";

type Props = {
    project: IProject;
    onDeleteClickHnd: (data: IStory) => void;
    onEdit: (data: IStory) => void;
    onPageChange: (page: PageEnum) => void;
    onBackBtnClickHnd: () => void;
};

const StoryList = (props: Props) => {
    const { project, onDeleteClickHnd, onEdit, onPageChange, onBackBtnClickHnd } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IStory | null>(null);

    const viewStory = (story: IStory) => {
        setSelectedStory(story);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStory(null);
    };

    return (
        <div>
            <div className="stories-header">
                <h2>{project.name}</h2>
                <input type="button" value="Back" onClick={onBackBtnClickHnd} />
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
                                        <input type="button" value="Delete" onClick={() => onDeleteClickHnd(story)} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal && selectedStory && (
                <StoryModal story={selectedStory} onClose={closeModal} />
            )}
        </div>
    );
};

export default StoryList;