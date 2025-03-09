import { IStory } from "./Story.type";
import "./Project.Form.style.css";
import { useState } from "react";

type Props = {
    data: IStory;
    onBackBtnClickHnd: () => void;
    onUpdateClickHnd: (data: IStory) => void;
}

const EditStory = (props: Props) => {
    const { data, onBackBtnClickHnd, onUpdateClickHnd } = props;

    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [priority, setPriority] = useState(data.priority);
    const [status, setStatus] = useState(data.status);

    const onTitleChangeHnd = (e: any) => {
        setTitle(e.target.value);
    }

    const onDescriptionChangeHnd = (e: any) => {
        setDescription(e.target.value);
    }

    const onPriorityChangeHnd = (e: any) => {
        setPriority(e.target.value as "low" | "medium" | "high");
    }

    const onStatusChangeHnd = (e: any) => {
        setStatus(e.target.value as "todo" | "doing" | "done");
    }

    const onSubmitBtnClickHnd = (e: any) => {
        e.preventDefault();
        const updatedData: IStory = {
            id: data.id,
            title: title,
            description: description,
            priority: priority,
            status: status,
            projectId: data.projectId,
            ownerId: data.ownerId,
            createdAt: data.createdAt
        }

        onUpdateClickHnd(updatedData);
        onBackBtnClickHnd();
    }

    return (
        <div className="form-container">
            <h2>Edit Story</h2>
            <form onSubmit={onSubmitBtnClickHnd}>
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={title} onChange={onTitleChangeHnd} />
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" name="description" value={description} onChange={onDescriptionChangeHnd} />
                </div>
                <div>
                    <label>Priority</label>
                    <select name="priority" value={priority} onChange={onPriorityChangeHnd}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={status} onChange={onStatusChangeHnd}>
                        <option value="todo">To Do</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="add-project-buttons">
                    <input type="button" value="Back" onClick={onBackBtnClickHnd} />
                    <input type="submit" value="Update Story" />
                </div>
            </form>
        </div>
    );
};

export default EditStory;