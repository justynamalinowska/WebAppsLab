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
    onSelectStory: (story: IStory) => void; 
};

const StoryList = (props: Props) => {
    const { project, onDeleteClickHnd, onEdit, onPageChange, onBackBtnClickHnd, onSelectStory } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
    const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "doing" | "done">("all");

    const viewStory = (story: IStory) => {
        setSelectedStory(story);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStory(null);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(e.target.value as "all" | "todo" | "doing" | "done");
    };

    const filteredStories = project.stories?.filter(story => 
        filterStatus === "all" || story.status === filterStatus
    );

    return (
        <div>
            <div className="stories-header">
                <h2>{project.name}</h2>
                <select className="custom-select" value={filterStatus} onChange={handleStatusChange}>
                    <option value="all">All</option>
                    <option value="todo">To Do</option>
                    <option value="doing">Doing</option>
                    <option value="done">Done</option>
                </select>
                <input type="button" value="Back" onClick={onBackBtnClickHnd} />
                <input type="button" value="Add Story" onClick={() => onPageChange(PageEnum.addStory)} />
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStories && filteredStories.map((story) => {
                        return (
                            <tr key={story.id}>
                                <td>{story.title}</td>
                                <td>{story.description}</td>
                                <td>{story.priority}</td>
                                <td>{story.status}</td>
                                <td>
                                    <div className="action-buttons">
                                        <input type="button" value="View" onClick={() => viewStory(story)} />
                                        <input type="button" value="Edit" onClick={() => { onEdit(story); onPageChange(PageEnum.editStory); }} />
                                        <input type="button" value="Delete" onClick={() => onDeleteClickHnd(story)} />
                                        <input type="button" value="Select" onClick={() => { 
                                            onSelectStory(story); 
                                            onPageChange(PageEnum.tasks); // Navigate to tasks page
                                        }} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {filteredStories && filteredStories.length === 0 && <p>No stories available.</p>}
            {showModal && selectedStory && (
                <StoryModal story={selectedStory} onClose={closeModal} />
            )}
        </div>
    );
};

export default StoryList;