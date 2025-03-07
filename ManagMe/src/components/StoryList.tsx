import { IStory } from "./Story.type";
// import "./StoryList.style.css";
import { useState } from "react";

type Props = {
    list: IStory[];
    projectName: string;
    onDeleteClickHnd: (data: IStory) => void;
    onEdit: (data: IStory) => void;
    onSelect: (data: IStory) => void;
};

const StoryList = (props: Props) => {
    const { list = [], projectName, onDeleteClickHnd, onEdit, onSelect } = props; // Default to empty array if list is undefined
    const [showModal, setShowModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState<IStory | null>(null);

    const viewStory = (story: IStory) => {
        setSelectedStory(story);
        setShowModal(true); 
    };

    return (
        <div>
            <div className="stories-header">
                <h2>{projectName}</h2>
                <input type="button" value="Add Story" onClick={() => onSelect({} as IStory)} />
            </div>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((story) => {
                        return (
                            <tr key={story.id}>
                                <td>{story.id}</td>
                                <td>{story.name}</td>
                                <td>{story.description}</td>
                                <td>{story.priority}</td>
                                <td>{story.status}</td>
                                <td>
                                    <div className="action-buttons">
                                        <input type="button" value="View" onClick={() => viewStory(story)} />
                                        <input type="button" value="Edit" onClick={() => onEdit(story)} />
                                        <input type="button" value="Delete" onClick={() => onDeleteClickHnd(story)} />
                                        <input type="button" value="Select" onClick={() => onSelect(story)} />
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {showModal && selectedStory && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>{selectedStory.name}</h2>
                        <p>{selectedStory.description}</p>
                        <p>Priority: {selectedStory.priority}</p>
                        <p>Status: {selectedStory.status}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryList;