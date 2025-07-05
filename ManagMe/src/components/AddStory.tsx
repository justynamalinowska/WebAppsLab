import "./Project.Form.style.css";
import { useState } from "react";
import { IStory } from "./Story.type";
import { IProject } from "./Project.type";

type Props = {
    project: IProject | null;
    userId: number;
    onBackBtnClickHnd: () => void;
    onSubmitClickHnd: (data: IStory) => void;
}

const AddStory = (props: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

    const { project, userId, onBackBtnClickHnd, onSubmitClickHnd } = props;

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
        if (project) {
            const newStory: IStory = {
                id: 0,
                title,
                description,
                priority,
                status,
                projectId: project.id,
                ownerId: userId.toString(),
                createdAt: new Date()
            };
            onSubmitClickHnd(newStory);
            onBackBtnClickHnd();
        } else {
            alert("No project selected. Please select a project first.");
        }
    }

    return (
        <div className="form-container">
            <h2>New Story</h2>
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
                    <input type="submit" value="Add Story" />
                </div>
            </form>
        </div>
    );
};

export default AddStory;