import React from "react";
import { IStory } from "./Story.type";

type Props = {
    story: IStory | null;
    onBackBtnClickHnd: () => void;
};

const ViewStory: React.FC<Props> = ({ story, onBackBtnClickHnd }) => {
    if (!story) {
        return <div>No story selected</div>;
    }

    return (
        <div>
            <h2>View Story</h2>
            <p>Title: {story.title}</p>
            <p>Description: {story.description}</p>
            <p>Priority: {story.priority}</p>
            <p>Status: {story.status}</p>
            <button onClick={onBackBtnClickHnd}>Back</button>
        </div>
    );
};

export default ViewStory;