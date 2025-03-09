import { IStory } from "./Story.type";
import "./ProjectModal.style.css"

type StoryModalProps = {
    story: IStory;
    onClose: () => void;
};

const StoryModal = ({ story, onClose }: StoryModalProps) => {
    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <p>Priority: {story.priority}</p>
                <p>Status: {story.status}</p>
                <button onClick={onClose}>Close</button> 
            </div>
        </div>
    );
};

export default StoryModal;